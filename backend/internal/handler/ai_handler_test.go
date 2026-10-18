package handler

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/naek/backend/internal/ai"
	"github.com/naek/backend/internal/service"
)

func newTestAIHandler() *AIHandler {
	svc := service.NewAIService(ai.NewNoopProvider())
	return NewAIHandler(svc)
}

func newTestAIRouter(h *AIHandler) *gin.Engine {
	r := gin.New()
	r.POST("/api/v1/ai/ask", h.Ask)
	return r
}

func performJSONRequest(r http.Handler, method, path, body string) *httptest.ResponseRecorder {
	req := httptest.NewRequest(method, path, strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	return w
}

func TestAIHandler_Ask(t *testing.T) {
	h := newTestAIHandler()
	r := newTestAIRouter(h)

	t.Run("empty question returns 400", func(t *testing.T) {
		w := performJSONRequest(r, http.MethodPost, "/api/v1/ai/ask", `{"question":""}`)
		if w.Code != http.StatusBadRequest {
			t.Fatalf("status = %d, want %d", w.Code, http.StatusBadRequest)
		}
	})

	t.Run("whitespace-only question returns 400", func(t *testing.T) {
		w := performJSONRequest(r, http.MethodPost, "/api/v1/ai/ask", `{"question":"   "}`)
		if w.Code != http.StatusBadRequest {
			t.Fatalf("status = %d, want %d", w.Code, http.StatusBadRequest)
		}
	})

	t.Run("question too long returns 400", func(t *testing.T) {
		longQuestion := strings.Repeat("a", maxAIQuestionLength+1)
		body, _ := json.Marshal(map[string]string{"question": longQuestion})
		w := performJSONRequest(r, http.MethodPost, "/api/v1/ai/ask", string(body))
		if w.Code != http.StatusBadRequest {
			t.Fatalf("status = %d, want %d", w.Code, http.StatusBadRequest)
		}
	})

	t.Run("invalid ticker returns 400", func(t *testing.T) {
		longTicker := strings.Repeat("A", maxTickerLength+1)
		body, _ := json.Marshal(map[string]string{"question": "Kenapa saham ini turun?", "ticker": longTicker})
		w := performJSONRequest(r, http.MethodPost, "/api/v1/ai/ask", string(body))
		if w.Code != http.StatusBadRequest {
			t.Fatalf("status = %d, want %d", w.Code, http.StatusBadRequest)
		}
	})

	t.Run("malformed JSON body returns 400", func(t *testing.T) {
		w := performJSONRequest(r, http.MethodPost, "/api/v1/ai/ask", `{not valid json`)
		if w.Code != http.StatusBadRequest {
			t.Fatalf("status = %d, want %d", w.Code, http.StatusBadRequest)
		}
	})

	t.Run("valid question with no AI provider returns 200 available=false, not a fabricated answer", func(t *testing.T) {
		body, _ := json.Marshal(map[string]string{"question": "Jelaskan PER dengan contoh.", "ticker": "BBCA"})
		w := performJSONRequest(r, http.MethodPost, "/api/v1/ai/ask", string(body))
		if w.Code != http.StatusOK {
			t.Fatalf("status = %d, want %d", w.Code, http.StatusOK)
		}

		var resp askResponse
		if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
			t.Fatalf("failed to unmarshal response: %v", err)
		}
		if resp.Available {
			t.Error("Available = true, want false (NoopProvider must never fabricate an answer)")
		}
		if resp.Answer != nil {
			t.Error("Answer is non-nil, want nil when unavailable")
		}
		if resp.Message == "" {
			t.Error("Message is empty, want an explanatory message when AI is unavailable")
		}
	})

	t.Run("valid question without ticker is accepted", func(t *testing.T) {
		body, _ := json.Marshal(map[string]string{"question": "Apa itu market breadth?"})
		w := performJSONRequest(r, http.MethodPost, "/api/v1/ai/ask", string(body))
		if w.Code != http.StatusOK {
			t.Fatalf("status = %d, want %d", w.Code, http.StatusOK)
		}
	})
}
