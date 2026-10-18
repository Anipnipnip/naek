package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/naek/backend/internal/service"
)

// MarketHandler serves market-data HTTP endpoints.
type MarketHandler struct {
	service *service.MarketService
}

// NewMarketHandler constructs a MarketHandler.
func NewMarketHandler(s *service.MarketService) *MarketHandler {
	return &MarketHandler{service: s}
}

// GetOverview handles GET /api/v1/market/overview.
// It always returns the real provider status; it never fabricates market values.
// When no provider is configured, the response reports freshness "unavailable"
// with an explanatory message, using HTTP 200 (the request succeeded; the data
// is honestly reported as not present) so the frontend can render an empty state.
func (h *MarketHandler) GetOverview(c *gin.Context) {
	overview, err := h.service.GetOverview(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{
			"error": "gagal mengambil data pasar",
			"detail": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, overview)
}
