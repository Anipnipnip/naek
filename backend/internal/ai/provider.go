// Package ai defines the AI-assistant provider interface for NAEK AI
// (the research-assistant feature described in PRD.md FR-05).
//
// IMPORTANT: No concrete AI provider is implemented yet. Until a real LLM
// provider and API key are configured (see config.AIProvider / AI_PROVIDER
// and AI_API_KEY env vars), handlers must use NoopProvider, which honestly
// reports that the assistant is unavailable. Do not fabricate answers,
// sources, or confidence under any circumstances — this is a hard product
// requirement (see PRD.md section 12, "Safety, Trust, and Compliance Guardrails").
package ai

import (
	"context"
	"errors"
)

// ErrAIUnavailable indicates no AI provider is configured. Handlers should
// map this to a clear "unavailable" response, not a generic 500.
var ErrAIUnavailable = errors.New("ai provider not configured")

// SourceCitation links a claim in the answer back to underlying data or a
// document, per PRD.md FR-06 ("make it possible to trace important AI
// claims back to data or documents").
type SourceCitation struct {
	Label string `json:"label"`
	URL   string `json:"url,omitempty"`
}

// Answer is the structured NAEK AI response format defined in PRD.md
// section 8 ("AI Answer Format"). Each field is a distinct section so the
// UI can visually separate facts, interpretation, and uncertainty rather
// than rendering one undifferentiated block of text.
type Answer struct {
	// Ringkasan: one or two plain-language sentences.
	Summary string `json:"summary"`
	// DataObserved: relevant figures, period, timestamp, and source —
	// "Data yang terlihat".
	DataObserved string `json:"data_observed"`
	// Interpretation: what the evidence may indicate — "Interpretasi".
	Interpretation string `json:"interpretation"`
	// AlternativeScenarios: what could contradict the interpretation —
	// "Skenario alternatif".
	AlternativeScenarios string `json:"alternative_scenarios"`
	// RisksAndLimitations: missing data, uncertainty, liquidity/event risk —
	// "Risiko dan batasan".
	RisksAndLimitations string `json:"risks_and_limitations"`
	// WhatToWatch: observable signals to monitor, never a trade instruction —
	// "Apa yang perlu dipantau".
	WhatToWatch string `json:"what_to_watch"`
	// Sources: links to underlying data, filings, or news used in the answer.
	Sources []SourceCitation `json:"sources"`
}

// Query is a NAEK AI request. Ticker is optional context (set when the
// question originates from a stock detail page).
type Query struct {
	Question string
	Ticker   string
}

// Provider is implemented by every AI connector (e.g. an OpenAI or
// Anthropic-backed assistant with retrieval tools). Community contributors
// should implement this interface for new providers rather than modifying
// handler code directly.
type Provider interface {
	// Name identifies the provider for attribution and logging purposes.
	Name() string
	// Ask answers a natural-language question. Returns ErrAIUnavailable if
	// no provider is configured — never a fabricated Answer.
	Ask(ctx context.Context, query Query) (Answer, error)
}

// NoopProvider is the default provider used when no real AI backend has
// been configured. It never returns a fabricated answer.
type NoopProvider struct{}

// NewNoopProvider constructs the default, honest "not connected" provider.
func NewNoopProvider() *NoopProvider {
	return &NoopProvider{}
}

func (p *NoopProvider) Name() string {
	return "none"
}

func (p *NoopProvider) Ask(_ context.Context, _ Query) (Answer, error) {
	return Answer{}, ErrAIUnavailable
}
