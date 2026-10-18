package market

import (
	"context"
	"errors"
	"testing"
)

// These tests encode the product's core honesty contract: NoopProvider must
// never fabricate market data. Every method must report "unavailable" (or,
// for GetInstrumentDetail, ErrInstrumentNotFound) rather than inventing
// plausible-looking values. See PRD.md section 12 and design.md section 9.

func TestNoopProvider_Name(t *testing.T) {
	p := NewNoopProvider()
	if got := p.Name(); got != "none" {
		t.Errorf("Name() = %q, want %q", got, "none")
	}
}

func TestNoopProvider_GetMarketOverview(t *testing.T) {
	p := NewNoopProvider()
	overview, err := p.GetMarketOverview(context.Background())
	if err != nil {
		t.Fatalf("GetMarketOverview() returned unexpected error: %v", err)
	}

	if overview.Freshness != FreshnessUnavailable {
		t.Errorf("Freshness = %q, want %q", overview.Freshness, FreshnessUnavailable)
	}
	if len(overview.Indices) != 0 {
		t.Errorf("Indices = %v, want empty slice (never fabricate index values)", overview.Indices)
	}
	if overview.Indices == nil {
		t.Error("Indices is nil, want non-nil empty slice so JSON serializes as [] not null")
	}
	if overview.Message == "" {
		t.Error("Message is empty, want an explanatory message")
	}
	if overview.Source != "none" {
		t.Errorf("Source = %q, want %q", overview.Source, "none")
	}
}

func TestNoopProvider_SearchInstruments(t *testing.T) {
	p := NewNoopProvider()
	results, err := p.SearchInstruments(context.Background(), "BBCA")
	if err != nil {
		t.Fatalf("SearchInstruments() returned unexpected error: %v", err)
	}
	if len(results) != 0 {
		t.Errorf("results = %v, want empty slice (never fabricate instrument matches)", results)
	}
	if results == nil {
		t.Error("results is nil, want non-nil empty slice so JSON serializes as [] not null")
	}
}

func TestNoopProvider_GetInstrumentDetail(t *testing.T) {
	p := NewNoopProvider()
	detail, err := p.GetInstrumentDetail(context.Background(), "BBCA")

	if !errors.Is(err, ErrInstrumentNotFound) {
		t.Errorf("err = %v, want ErrInstrumentNotFound (every ticker is genuinely unknown without a data source)", err)
	}
	if detail != (InstrumentDetail{}) {
		t.Errorf("detail = %+v, want zero value when err != nil", detail)
	}
}

func TestNoopProvider_GetOHLCVSeries(t *testing.T) {
	p := NewNoopProvider()
	series, err := p.GetOHLCVSeries(context.Background(), "BBCA", "1M")
	if err != nil {
		t.Fatalf("GetOHLCVSeries() returned unexpected error: %v", err)
	}

	if series.Ticker != "BBCA" {
		t.Errorf("Ticker = %q, want %q", series.Ticker, "BBCA")
	}
	if series.Range != "1M" {
		t.Errorf("Range = %q, want %q", series.Range, "1M")
	}
	if len(series.Bars) != 0 {
		t.Errorf("Bars = %v, want empty slice (never fabricate OHLCV bars)", series.Bars)
	}
	if series.Bars == nil {
		t.Error("Bars is nil, want non-nil empty slice so JSON serializes as [] not null")
	}
	if series.Freshness != FreshnessUnavailable {
		t.Errorf("Freshness = %q, want %q", series.Freshness, FreshnessUnavailable)
	}
}

func TestNoopProvider_GetFundamentals(t *testing.T) {
	p := NewNoopProvider()
	summary, err := p.GetFundamentals(context.Background(), "BBCA", "quarterly")
	if err != nil {
		t.Fatalf("GetFundamentals() returned unexpected error: %v", err)
	}

	if summary.Ticker != "BBCA" {
		t.Errorf("Ticker = %q, want %q", summary.Ticker, "BBCA")
	}
	if summary.PeriodType != "quarterly" {
		t.Errorf("PeriodType = %q, want %q", summary.PeriodType, "quarterly")
	}
	if len(summary.Periods) != 0 || len(summary.Metrics) != 0 || len(summary.Ratios) != 0 {
		t.Error("expected all slices empty (never fabricate financial figures or ratios)")
	}
	if summary.Periods == nil || summary.Metrics == nil || summary.Ratios == nil {
		t.Error("expected non-nil empty slices so JSON serializes as [] not null")
	}
	if summary.Freshness != FreshnessUnavailable {
		t.Errorf("Freshness = %q, want %q", summary.Freshness, FreshnessUnavailable)
	}
}

// Compile-time check: NoopProvider must satisfy the Provider interface.
var _ Provider = (*NoopProvider)(nil)
