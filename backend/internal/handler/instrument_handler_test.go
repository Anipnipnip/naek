package handler

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/naek/backend/internal/market"
	"github.com/naek/backend/internal/service"
)

func init() {
	gin.SetMode(gin.TestMode)
}

func newTestInstrumentHandler() *InstrumentHandler {
	svc := service.NewMarketService(market.NewNoopProvider())
	return NewInstrumentHandler(svc)
}

func newTestRouter(h *InstrumentHandler) *gin.Engine {
	r := gin.New()
	r.GET("/api/v1/instruments/search", h.Search)
	r.GET("/api/v1/instruments/:ticker", h.GetDetail)
	r.GET("/api/v1/instruments/:ticker/ohlcv", h.GetOHLCV)
	r.GET("/api/v1/instruments/:ticker/fundamentals", h.GetFundamentals)
	return r
}

func performRequest(r http.Handler, method, path string) *httptest.ResponseRecorder {
	req := httptest.NewRequest(method, path, nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	return w
}

func TestNormalizeTicker(t *testing.T) {
	tests := []struct {
		name    string
		raw     string
		want    string
		wantOk  bool
	}{
		{"simple uppercase", "BBCA", "BBCA", true},
		{"lowercase normalized", "bbca", "BBCA", true},
		{"trims whitespace", "  bbca  ", "BBCA", true},
		{"empty string rejected", "", "", false},
		{"whitespace-only rejected", "   ", "", false},
		{"too long rejected", strings.Repeat("A", maxTickerLength+1), "", false},
		{"exactly max length accepted", strings.Repeat("A", maxTickerLength), strings.Repeat("A", maxTickerLength), true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, ok := normalizeTicker(tt.raw)
			if ok != tt.wantOk {
				t.Errorf("normalizeTicker(%q) ok = %v, want %v", tt.raw, ok, tt.wantOk)
			}
			if got != tt.want {
				t.Errorf("normalizeTicker(%q) = %q, want %q", tt.raw, got, tt.want)
			}
		})
	}
}

func TestInstrumentHandler_Search(t *testing.T) {
	h := newTestInstrumentHandler()
	r := newTestRouter(h)

	t.Run("missing query returns 400", func(t *testing.T) {
		w := performRequest(r, http.MethodGet, "/api/v1/instruments/search")
		if w.Code != http.StatusBadRequest {
			t.Fatalf("status = %d, want %d", w.Code, http.StatusBadRequest)
		}
	})

	t.Run("query too long returns 400", func(t *testing.T) {
		longQuery := strings.Repeat("a", maxSearchQueryLength+1)
		w := performRequest(r, http.MethodGet, "/api/v1/instruments/search?q="+longQuery)
		if w.Code != http.StatusBadRequest {
			t.Fatalf("status = %d, want %d", w.Code, http.StatusBadRequest)
		}
	})

	t.Run("valid query returns 200 with honest empty results", func(t *testing.T) {
		w := performRequest(r, http.MethodGet, "/api/v1/instruments/search?q=BBCA")
		if w.Code != http.StatusOK {
			t.Fatalf("status = %d, want %d", w.Code, http.StatusOK)
		}

		var resp instrumentSearchResponse
		if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
			t.Fatalf("failed to unmarshal response: %v", err)
		}
		if len(resp.Results) != 0 {
			t.Errorf("Results = %v, want empty (NoopProvider must never fabricate matches)", resp.Results)
		}
		if resp.Message == "" {
			t.Error("Message is empty, want an explanatory message when no results are found")
		}
	})
}

func TestInstrumentHandler_GetDetail(t *testing.T) {
	h := newTestInstrumentHandler()
	r := newTestRouter(h)

	t.Run("invalid ticker returns 400", func(t *testing.T) {
		w := performRequest(r, http.MethodGet, "/api/v1/instruments/"+strings.Repeat("A", maxTickerLength+1))
		if w.Code != http.StatusBadRequest {
			t.Fatalf("status = %d, want %d", w.Code, http.StatusBadRequest)
		}
	})

	t.Run("unknown ticker returns 404, not a fabricated 200", func(t *testing.T) {
		w := performRequest(r, http.MethodGet, "/api/v1/instruments/BBCA")
		if w.Code != http.StatusNotFound {
			t.Fatalf("status = %d, want %d (NoopProvider has no known instruments)", w.Code, http.StatusNotFound)
		}
	})
}

func TestInstrumentHandler_GetOHLCV(t *testing.T) {
	h := newTestInstrumentHandler()
	r := newTestRouter(h)

	t.Run("invalid range returns 400", func(t *testing.T) {
		w := performRequest(r, http.MethodGet, "/api/v1/instruments/BBCA/ohlcv?range=99X")
		if w.Code != http.StatusBadRequest {
			t.Fatalf("status = %d, want %d", w.Code, http.StatusBadRequest)
		}
	})

	t.Run("valid range returns 200 with honest empty bars", func(t *testing.T) {
		w := performRequest(r, http.MethodGet, "/api/v1/instruments/BBCA/ohlcv?range=1M")
		if w.Code != http.StatusOK {
			t.Fatalf("status = %d, want %d", w.Code, http.StatusOK)
		}

		var series market.OHLCVSeries
		if err := json.Unmarshal(w.Body.Bytes(), &series); err != nil {
			t.Fatalf("failed to unmarshal response: %v", err)
		}
		if len(series.Bars) != 0 {
			t.Errorf("Bars = %v, want empty (NoopProvider must never fabricate price bars)", series.Bars)
		}
		if series.Freshness != market.FreshnessUnavailable {
			t.Errorf("Freshness = %q, want %q", series.Freshness, market.FreshnessUnavailable)
		}
	})

	t.Run("default range is 1M when omitted", func(t *testing.T) {
		w := performRequest(r, http.MethodGet, "/api/v1/instruments/BBCA/ohlcv")
		if w.Code != http.StatusOK {
			t.Fatalf("status = %d, want %d", w.Code, http.StatusOK)
		}
		var series market.OHLCVSeries
		if err := json.Unmarshal(w.Body.Bytes(), &series); err != nil {
			t.Fatalf("failed to unmarshal response: %v", err)
		}
		if series.Range != "1M" {
			t.Errorf("Range = %q, want %q", series.Range, "1M")
		}
	})
}

func TestInstrumentHandler_GetFundamentals(t *testing.T) {
	h := newTestInstrumentHandler()
	r := newTestRouter(h)

	t.Run("invalid period returns 400", func(t *testing.T) {
		w := performRequest(r, http.MethodGet, "/api/v1/instruments/BBCA/fundamentals?period=monthly")
		if w.Code != http.StatusBadRequest {
			t.Fatalf("status = %d, want %d", w.Code, http.StatusBadRequest)
		}
	})

	t.Run("valid period returns 200 with honest empty data", func(t *testing.T) {
		w := performRequest(r, http.MethodGet, "/api/v1/instruments/BBCA/fundamentals?period=quarterly")
		if w.Code != http.StatusOK {
			t.Fatalf("status = %d, want %d", w.Code, http.StatusOK)
		}

		var summary market.FundamentalSummary
		if err := json.Unmarshal(w.Body.Bytes(), &summary); err != nil {
			t.Fatalf("failed to unmarshal response: %v", err)
		}
		if len(summary.Metrics) != 0 || len(summary.Ratios) != 0 || len(summary.Periods) != 0 {
			t.Error("expected all slices empty from NoopProvider; fabricated data detected")
		}
		if summary.PeriodType != "quarterly" {
			t.Errorf("PeriodType = %q, want %q", summary.PeriodType, "quarterly")
		}
	})

	t.Run("default period is annual when omitted", func(t *testing.T) {
		w := performRequest(r, http.MethodGet, "/api/v1/instruments/BBCA/fundamentals")
		if w.Code != http.StatusOK {
			t.Fatalf("status = %d, want %d", w.Code, http.StatusOK)
		}
		var summary market.FundamentalSummary
		if err := json.Unmarshal(w.Body.Bytes(), &summary); err != nil {
			t.Fatalf("failed to unmarshal response: %v", err)
		}
		if summary.PeriodType != "annual" {
			t.Errorf("PeriodType = %q, want %q", summary.PeriodType, "annual")
		}
	})
}
