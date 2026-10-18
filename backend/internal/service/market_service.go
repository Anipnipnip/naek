// Package service contains application/domain logic that orchestrates
// repositories and market-data providers. Handlers should stay thin and
// delegate business logic here.
package service

import (
	"context"

	"github.com/naek/backend/internal/market"
)

// MarketService exposes market-data use cases to HTTP handlers.
type MarketService struct {
	provider market.Provider
}

// NewMarketService constructs a MarketService backed by the given provider.
// Pass market.NewNoopProvider() when no real data source is configured.
func NewMarketService(provider market.Provider) *MarketService {
	return &MarketService{provider: provider}
}

// GetOverview returns the current market overview as reported by the configured provider.
func (s *MarketService) GetOverview(ctx context.Context) (market.MarketOverview, error) {
	return s.provider.GetMarketOverview(ctx)
}

// ProviderName exposes which connector is currently active, for diagnostics.
func (s *MarketService) ProviderName() string {
	return s.provider.Name()
}

// SearchInstruments looks up instruments by ticker or company name substring.
// Returns an empty, non-nil slice (not an error) when no results are found
// or no instrument data source is configured yet.
func (s *MarketService) SearchInstruments(ctx context.Context, query string) ([]market.InstrumentSummary, error) {
	return s.provider.SearchInstruments(ctx, query)
}

// GetInstrumentDetail returns the Stock Explorer detail payload for a ticker.
// Returns market.ErrInstrumentNotFound if the ticker is unknown.
func (s *MarketService) GetInstrumentDetail(ctx context.Context, ticker string) (market.InstrumentDetail, error) {
	return s.provider.GetInstrumentDetail(ctx, ticker)
}

// GetOHLCVSeries returns historical price bars for a ticker and range.
func (s *MarketService) GetOHLCVSeries(ctx context.Context, ticker string, rng string) (market.OHLCVSeries, error) {
	return s.provider.GetOHLCVSeries(ctx, ticker, rng)
}

// GetFundamentals returns financial periods/metrics/ratios for a ticker.
func (s *MarketService) GetFundamentals(ctx context.Context, ticker string, periodType string) (market.FundamentalSummary, error) {
	return s.provider.GetFundamentals(ctx, ticker, periodType)
}
