package service

import (
	"context"

	"github.com/naek/backend/internal/ai"
)

// AIService exposes NAEK AI use cases to HTTP handlers.
type AIService struct {
	provider ai.Provider
}

// NewAIService constructs an AIService backed by the given provider.
// Pass ai.NewNoopProvider() when no real AI backend is configured.
func NewAIService(provider ai.Provider) *AIService {
	return &AIService{provider: provider}
}

// Ask answers a natural-language question. Returns ai.ErrAIUnavailable if
// no provider is configured.
func (s *AIService) Ask(ctx context.Context, query ai.Query) (ai.Answer, error) {
	return s.provider.Ask(ctx, query)
}

// ProviderName exposes which AI connector is currently active, for diagnostics.
func (s *AIService) ProviderName() string {
	return s.provider.Name()
}
