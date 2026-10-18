package handler

import (
	"errors"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/naek/backend/internal/market"
	"github.com/naek/backend/internal/service"
)

const maxSearchQueryLength = 64
const maxTickerLength = 16

// allowedOHLCVRanges lists the time windows the API accepts for historical
// data. Keep this in sync with the frontend range selector.
var allowedOHLCVRanges = map[string]bool{
	"1M": true,
	"3M": true,
	"6M": true,
	"1Y": true,
	"5Y": true,
}

// allowedPeriodTypes lists the fundamental reporting periods the API
// accepts, per design.md 7.3 ("make period selection obvious: annual vs quarterly").
var allowedPeriodTypes = map[string]bool{
	"annual":    true,
	"quarterly": true,
}

// InstrumentHandler serves instrument search/lookup HTTP endpoints.
type InstrumentHandler struct {
	service *service.MarketService
}

// NewInstrumentHandler constructs an InstrumentHandler.
func NewInstrumentHandler(s *service.MarketService) *InstrumentHandler {
	return &InstrumentHandler{service: s}
}

// instrumentSearchResponse is the JSON contract for GET /api/v1/instruments/search.
type instrumentSearchResponse struct {
	Query   string                     `json:"query"`
	Results []market.InstrumentSummary `json:"results"`
	Message string                     `json:"message,omitempty"`
}

// Search handles GET /api/v1/instruments/search?q=<query>.
// It never fabricates instrument matches; while no instrument data source is
// configured, it honestly returns an empty result set with an explanatory message.
func (h *InstrumentHandler) Search(c *gin.Context) {
	query := strings.TrimSpace(c.Query("q"))

	if query == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "parameter query 'q' wajib diisi",
		})
		return
	}

	if len(query) > maxSearchQueryLength {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "query pencarian terlalu panjang",
		})
		return
	}

	results, err := h.service.SearchInstruments(c.Request.Context(), query)
	if err != nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{
			"error":  "gagal melakukan pencarian emiten",
			"detail": err.Error(),
		})
		return
	}

	resp := instrumentSearchResponse{
		Query:   query,
		Results: results,
	}
	if len(results) == 0 {
		resp.Message = "Belum ada data emiten yang terhubung ke NAEK. Hasil pencarian akan muncul setelah sumber data instrumen dikonfigurasi."
	}

	c.JSON(http.StatusOK, resp)
}

// normalizeTicker trims and upper-cases a ticker path parameter, and
// validates it against basic length constraints. IDX tickers are
// conventionally uppercase (e.g. BBCA), but we accept any case from the
// client and normalize rather than reject.
func normalizeTicker(raw string) (string, bool) {
	ticker := strings.ToUpper(strings.TrimSpace(raw))
	if ticker == "" || len(ticker) > maxTickerLength {
		return "", false
	}
	return ticker, true
}

// GetDetail handles GET /api/v1/instruments/:ticker.
// Returns 404 when the ticker is not a known instrument — this is distinct
// from "instrument known, price data unavailable", which uses 200 with an
// explicit freshness/message instead.
func (h *InstrumentHandler) GetDetail(c *gin.Context) {
	ticker, ok := normalizeTicker(c.Param("ticker"))
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ticker tidak valid"})
		return
	}

	detail, err := h.service.GetInstrumentDetail(c.Request.Context(), ticker)
	if err != nil {
		if errors.Is(err, market.ErrInstrumentNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"error":  "emiten tidak ditemukan",
				"detail": "Belum ada data emiten yang terhubung ke NAEK untuk ticker ini.",
			})
			return
		}
		c.JSON(http.StatusServiceUnavailable, gin.H{
			"error":  "gagal mengambil detail emiten",
			"detail": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, detail)
}

// GetOHLCV handles GET /api/v1/instruments/:ticker/ohlcv?range=<range>.
// Always returns 200 with an honest freshness status; it never fabricates
// historical price bars.
func (h *InstrumentHandler) GetOHLCV(c *gin.Context) {
	ticker, ok := normalizeTicker(c.Param("ticker"))
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ticker tidak valid"})
		return
	}

	rng := strings.ToUpper(strings.TrimSpace(c.DefaultQuery("range", "1M")))
	if !allowedOHLCVRanges[rng] {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "parameter range tidak didukung (gunakan salah satu: 1M, 3M, 6M, 1Y, 5Y)",
		})
		return
	}

	series, err := h.service.GetOHLCVSeries(c.Request.Context(), ticker, rng)
	if err != nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{
			"error":  "gagal mengambil data historis",
			"detail": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, series)
}

// GetFundamentals handles GET /api/v1/instruments/:ticker/fundamentals?period=<annual|quarterly>.
// Always returns 200 with an honest freshness status; it never fabricates
// financial figures or ratios.
func (h *InstrumentHandler) GetFundamentals(c *gin.Context) {
	ticker, ok := normalizeTicker(c.Param("ticker"))
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ticker tidak valid"})
		return
	}

	periodType := strings.ToLower(strings.TrimSpace(c.DefaultQuery("period", "annual")))
	if !allowedPeriodTypes[periodType] {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "parameter period tidak didukung (gunakan salah satu: annual, quarterly)",
		})
		return
	}

	summary, err := h.service.GetFundamentals(c.Request.Context(), ticker, periodType)
	if err != nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{
			"error":  "gagal mengambil data fundamental",
			"detail": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, summary)
}
