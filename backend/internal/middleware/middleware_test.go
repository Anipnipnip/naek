package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func init() {
	gin.SetMode(gin.TestMode)
}

func newRouterWithCORS(allowedOrigins string) *gin.Engine {
	r := gin.New()
	r.Use(CORS(allowedOrigins))
	r.GET("/ping", func(c *gin.Context) { c.String(http.StatusOK, "pong") })
	return r
}

func TestCORS_AllowedOrigin(t *testing.T) {
	r := newRouterWithCORS("http://localhost:5173,http://localhost:5174")

	req := httptest.NewRequest(http.MethodGet, "/ping", nil)
	req.Header.Set("Origin", "http://localhost:5173")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if got := w.Header().Get("Access-Control-Allow-Origin"); got != "http://localhost:5173" {
		t.Errorf("Access-Control-Allow-Origin = %q, want %q", got, "http://localhost:5173")
	}
	if got := w.Header().Get("Access-Control-Allow-Credentials"); got != "true" {
		t.Errorf("Access-Control-Allow-Credentials = %q, want %q", got, "true")
	}
	if w.Code != http.StatusOK {
		t.Errorf("status = %d, want %d", w.Code, http.StatusOK)
	}
}

func TestCORS_DisallowedOrigin(t *testing.T) {
	r := newRouterWithCORS("http://localhost:5173")

	req := httptest.NewRequest(http.MethodGet, "/ping", nil)
	req.Header.Set("Origin", "https://evil.example.com")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if got := w.Header().Get("Access-Control-Allow-Origin"); got != "" {
		t.Errorf("Access-Control-Allow-Origin = %q, want empty for a disallowed origin", got)
	}
	// The request still proceeds (CORS is enforced by the browser based on
	// the missing header, not by the server rejecting the request body).
	if w.Code != http.StatusOK {
		t.Errorf("status = %d, want %d", w.Code, http.StatusOK)
	}
}

func TestCORS_NoOriginHeader(t *testing.T) {
	r := newRouterWithCORS("http://localhost:5173")

	req := httptest.NewRequest(http.MethodGet, "/ping", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if got := w.Header().Get("Access-Control-Allow-Origin"); got != "" {
		t.Errorf("Access-Control-Allow-Origin = %q, want empty when no Origin header is sent", got)
	}
	if w.Code != http.StatusOK {
		t.Errorf("status = %d, want %d", w.Code, http.StatusOK)
	}
}

func TestCORS_OptionsPreflightShortCircuits(t *testing.T) {
	r := newRouterWithCORS("http://localhost:5173")

	req := httptest.NewRequest(http.MethodOptions, "/ping", nil)
	req.Header.Set("Origin", "http://localhost:5173")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusNoContent {
		t.Errorf("status = %d, want %d (OPTIONS preflight must short-circuit with 204)", w.Code, http.StatusNoContent)
	}
	if got := w.Header().Get("Access-Control-Allow-Origin"); got != "http://localhost:5173" {
		t.Errorf("Access-Control-Allow-Origin = %q, want %q even on preflight", got, "http://localhost:5173")
	}
}

func TestCORS_AlwaysSetsMethodsAndHeaders(t *testing.T) {
	r := newRouterWithCORS("http://localhost:5173")

	req := httptest.NewRequest(http.MethodGet, "/ping", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if got := w.Header().Get("Access-Control-Allow-Methods"); got == "" {
		t.Error("Access-Control-Allow-Methods header is missing")
	}
	if got := w.Header().Get("Access-Control-Allow-Headers"); got == "" {
		t.Error("Access-Control-Allow-Headers header is missing")
	}
}

func TestCORS_IgnoresWhitespaceAndEmptySegments(t *testing.T) {
	// Config values may have stray whitespace or trailing commas; the
	// middleware must not treat "" as an allowed origin.
	r := newRouterWithCORS(" http://localhost:5173 , , http://localhost:5174 ")

	req := httptest.NewRequest(http.MethodGet, "/ping", nil)
	req.Header.Set("Origin", "")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if got := w.Header().Get("Access-Control-Allow-Origin"); got != "" {
		t.Errorf("Access-Control-Allow-Origin = %q, want empty — empty string must never match as an allowed origin", got)
	}

	req2 := httptest.NewRequest(http.MethodGet, "/ping", nil)
	req2.Header.Set("Origin", "http://localhost:5174")
	w2 := httptest.NewRecorder()
	r.ServeHTTP(w2, req2)
	if got := w2.Header().Get("Access-Control-Allow-Origin"); got != "http://localhost:5174" {
		t.Errorf("Access-Control-Allow-Origin = %q, want %q (trimmed origin should still match)", got, "http://localhost:5174")
	}
}

func TestRequestID_GeneratesIDWhenAbsent(t *testing.T) {
	r := gin.New()
	r.Use(RequestID())
	r.GET("/ping", func(c *gin.Context) { c.String(http.StatusOK, "pong") })

	req := httptest.NewRequest(http.MethodGet, "/ping", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	id := w.Header().Get("X-Request-ID")
	if id == "" {
		t.Error("X-Request-ID header is empty, want a generated request ID")
	}
	if len(id) != 32 { // 16 bytes hex-encoded = 32 chars
		t.Errorf("X-Request-ID length = %d, want 32 (16-byte hex)", len(id))
	}
}

func TestRequestID_PreservesIncomingID(t *testing.T) {
	r := gin.New()
	r.Use(RequestID())
	r.GET("/ping", func(c *gin.Context) { c.String(http.StatusOK, "pong") })

	req := httptest.NewRequest(http.MethodGet, "/ping", nil)
	req.Header.Set("X-Request-ID", "client-provided-id")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if got := w.Header().Get("X-Request-ID"); got != "client-provided-id" {
		t.Errorf("X-Request-ID = %q, want %q (incoming request ID should be echoed back, not overwritten)", got, "client-provided-id")
	}
}

func TestRequestID_GeneratesUniqueIDsAcrossRequests(t *testing.T) {
	r := gin.New()
	r.Use(RequestID())
	r.GET("/ping", func(c *gin.Context) { c.String(http.StatusOK, "pong") })

	req1 := httptest.NewRequest(http.MethodGet, "/ping", nil)
	w1 := httptest.NewRecorder()
	r.ServeHTTP(w1, req1)

	req2 := httptest.NewRequest(http.MethodGet, "/ping", nil)
	w2 := httptest.NewRecorder()
	r.ServeHTTP(w2, req2)

	id1 := w1.Header().Get("X-Request-ID")
	id2 := w2.Header().Get("X-Request-ID")
	if id1 == id2 {
		t.Errorf("two separate requests got the same request ID: %q", id1)
	}
}
