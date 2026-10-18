package handler

import (
	"errors"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/naek/backend/internal/ai"
	"github.com/naek/backend/internal/service"
)

const maxAIQuestionLength = 500

// AIHandler serves the NAEK AI research-assistant endpoint.
type AIHandler struct {
	service *service.AIService
}

// NewAIHandler constructs an AIHandler.
func NewAIHandler(s *service.AIService) *AIHandler {
	return &AIHandler{service: s}
}

// askRequest is the JSON body for POST /api/v1/ai/ask.
type askRequest struct {
	Question string `json:"question"`
	Ticker   string `json:"ticker,omitempty"`
}

// askResponse wraps ai.Answer with an explicit availability flag, so the
// frontend can render an honest "assistant not available" state without
// having to infer it from an empty body.
type askResponse struct {
	Available bool       `json:"available"`
	Answer    *ai.Answer `json:"answer,omitempty"`
	Message   string     `json:"message,omitempty"`
}

// Ask handles POST /api/v1/ai/ask.
// It never fabricates an answer. While no AI provider is configured, it
// returns HTTP 200 with available=false and an explanatory message —
// consistent with how NoopProvider reports market-data unavailability.
func (h *AIHandler) Ask(c *gin.Context) {
	var req askRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "body permintaan tidak valid"})
		return
	}

	question := strings.TrimSpace(req.Question)
	if question == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "parameter 'question' wajib diisi"})
		return
	}
	if len(question) > maxAIQuestionLength {
		c.JSON(http.StatusBadRequest, gin.H{"error": "pertanyaan terlalu panjang"})
		return
	}

	ticker, ok := normalizeTicker(req.Ticker)
	if req.Ticker != "" && !ok {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ticker tidak valid"})
		return
	}

	answer, err := h.service.Ask(c.Request.Context(), ai.Query{Question: question, Ticker: ticker})
	if err != nil {
		if errors.Is(err, ai.ErrAIUnavailable) {
			c.JSON(http.StatusOK, askResponse{
				Available: false,
				Message:   "NAEK AI belum tersedia. Konfigurasikan AI_PROVIDER dan AI_API_KEY untuk mengaktifkan asisten riset ini.",
			})
			return
		}
		c.JSON(http.StatusServiceUnavailable, gin.H{
			"error":  "gagal memproses permintaan AI",
			"detail": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, askResponse{Available: true, Answer: &answer})
}
