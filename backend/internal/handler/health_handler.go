package handler

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// HealthHandler serves liveness/readiness information for the API.
type HealthHandler struct {
	version string
}

// NewHealthHandler constructs a HealthHandler. version is a build identifier
// (e.g. git short SHA) and may be empty in local development.
func NewHealthHandler(version string) *HealthHandler {
	return &HealthHandler{version: version}
}

// HealthResponse is the JSON body returned by GET /healthz.
type HealthResponse struct {
	Status    string `json:"status"`
	Timestamp string `json:"timestamp"`
	Version   string `json:"version,omitempty"`
}

// Check handles GET /healthz.
func (h *HealthHandler) Check(c *gin.Context) {
	c.JSON(http.StatusOK, HealthResponse{
		Status:    "ok",
		Timestamp: time.Now().UTC().Format(time.RFC3339),
		Version:   h.version,
	})
}
