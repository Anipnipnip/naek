// Package market defines the data-provider interface for Indonesian stock-market data
// and a status type that every market-data response must carry.
//
// IMPORTANT: No concrete provider is implemented yet. Until a licensed data source
// is configured (see config.MarketDataProvider / MARKET_DATA_PROVIDER env var),
// handlers must use NoopProvider, which honestly reports that data is unavailable.
// Do not fabricate prices, index values, or news under any circumstances.
package market

import (
	"context"
	"errors"
)

// FreshnessStatus describes how current a piece of market data is.
// These are the only allowed values per design.md; never claim "real-time"
// unless the underlying source and redistribution rights genuinely support it.
type FreshnessStatus string

const (
	FreshnessRealtime    FreshnessStatus = "real_time"
	FreshnessDelayed     FreshnessStatus = "delayed"
	FreshnessEndOfDay    FreshnessStatus = "end_of_day"
	FreshnessUnavailable FreshnessStatus = "unavailable"
)

// IndexSummary represents a single market index (e.g. IHSG, LQ45) at a point in time.
type IndexSummary struct {
	Code          string          `json:"code"`
	Name          string          `json:"name"`
	Value         *float64        `json:"value"`
	Change        *float64        `json:"change"`
	ChangePercent *float64        `json:"change_percent"`
	PreviousClose *float64        `json:"previous_close"`
	ObservedAt    *string         `json:"observed_at,omitempty"` // RFC3339, Asia/Jakarta
	Source        string          `json:"source"`
	Freshness     FreshnessStatus `json:"freshness"`
}

// MarketOverview is the aggregate payload for the Market Overview page.
type MarketOverview struct {
	Indices   []IndexSummary  `json:"indices"`
	Freshness FreshnessStatus `json:"freshness"`
	Source    string          `json:"source"`
	UpdatedAt *string         `json:"updated_at,omitempty"`
	Message   string          `json:"message,omitempty"`
}

// InstrumentSummary is a minimal, search-result-shaped view of a listed
// instrument (ticker/company). Full detail (sector, fundamentals, etc.)
// belongs to the Stock Explorer feature, not search results.
type InstrumentSummary struct {
	Ticker      string `json:"ticker"`
	CompanyName string `json:"company_name"`
	Exchange    string `json:"exchange"`
}

// InstrumentDetail is the Stock Explorer detail-page payload: company
// identity plus the latest available price snapshot. Historical prices are
// served separately via OHLCVSeries so the detail call stays lightweight.
type InstrumentDetail struct {
	Ticker        string          `json:"ticker"`
	CompanyName   string          `json:"company_name"`
	Sector        *string         `json:"sector"`
	Exchange      string          `json:"exchange"`
	ListingStatus string          `json:"listing_status"`
	LatestPrice   *IndexSummary   `json:"latest_price"`
	Freshness     FreshnessStatus `json:"freshness"`
	Source        string          `json:"source"`
}

// OHLCVBar is a single open/high/low/close/volume observation for one interval.
type OHLCVBar struct {
	Timestamp string   `json:"timestamp"` // RFC3339, Asia/Jakarta
	Open      float64  `json:"open"`
	High      float64  `json:"high"`
	Low       float64  `json:"low"`
	Close     float64  `json:"close"`
	Volume    *float64 `json:"volume"`
}

// OHLCVSeries is the historical-chart payload for a given ticker and range.
type OHLCVSeries struct {
	Ticker    string          `json:"ticker"`
	Interval  string          `json:"interval"` // e.g. "1d"
	Range     string          `json:"range"`    // e.g. "1M", "3M", "1Y"
	Bars      []OHLCVBar      `json:"bars"`
	Freshness FreshnessStatus `json:"freshness"`
	Source    string          `json:"source"`
	Message   string          `json:"message,omitempty"`
}

// ErrInstrumentNotFound indicates the requested ticker is not a known
// instrument. Handlers should map this to HTTP 404 rather than an empty
// 200 response, since the ticker itself is invalid/unknown — distinct from
// "instrument exists but no price data is available yet".
var ErrInstrumentNotFound = errors.New("instrument not found")

// FinancialPeriod identifies a single reporting period for an instrument.
// FiscalQuarter is nil for annual periods. See PRD.md FR-09 and design.md
// section 7.3 — period context (annual vs quarterly, currency, unit) must
// always travel with the figures it describes.
type FinancialPeriod struct {
	FiscalYear    int     `json:"fiscal_year"`
	FiscalQuarter *int    `json:"fiscal_quarter"` // 1-4, nil for annual periods
	PeriodEnd     string  `json:"period_end"`     // YYYY-MM-DD
	Currency      string  `json:"currency"`       // e.g. "IDR"
	Unit          string  `json:"unit"`           // e.g. "juta", "miliar"
	SourceDoc     *string `json:"source_document,omitempty"`
}

// FinancialMetric is a single reported line item (revenue, net income, etc.)
// for a given period. Values are never fabricated — if a figure is missing
// for a period, it is simply absent from the Metrics slice rather than
// filled with zero or an estimate.
type FinancialMetric struct {
	Name       string  `json:"name"`  // e.g. "revenue", "net_income"
	Label      string  `json:"label"` // human-readable, Indonesian
	FiscalYear int     `json:"fiscal_year"`
	Quarter    *int    `json:"fiscal_quarter"`
	Value      float64 `json:"value"`
	Unit       string  `json:"unit"`
}

// FinancialRatio is a derived metric (PER, PBV, ROE, etc.) with its formula
// and calculation method shown explicitly, per design.md's requirement to
// never label a stock "cheap"/"expensive" from a single opaque number.
type FinancialRatio struct {
	Name       string  `json:"name"`  // e.g. "per", "pbv", "roe"
	Label      string  `json:"label"` // e.g. "Price to Earnings Ratio (PER)"
	FiscalYear int     `json:"fiscal_year"`
	Quarter    *int    `json:"fiscal_quarter"`
	Value      float64 `json:"value"`
	Formula    string  `json:"formula"` // e.g. "Harga Saham / Laba per Saham (EPS)"
}

// FundamentalSummary is the Fundamental Explorer payload for a ticker.
// PeriodType is either "annual" or "quarterly".
type FundamentalSummary struct {
	Ticker     string            `json:"ticker"`
	PeriodType string            `json:"period_type"`
	Periods    []FinancialPeriod `json:"periods"`
	Metrics    []FinancialMetric `json:"metrics"`
	Ratios     []FinancialRatio  `json:"ratios"`
	Freshness  FreshnessStatus   `json:"freshness"`
	Source     string            `json:"source"`
	Message    string            `json:"message,omitempty"`
}

// Provider is implemented by every market-data connector (e.g. a licensed IDX feed).
// Community contributors should implement this interface for new data sources
// rather than modifying handler code directly.
type Provider interface {
	// Name identifies the provider for attribution and logging purposes.
	Name() string
	// GetMarketOverview returns the current overview, or an error if the
	// provider cannot fulfill the request.
	GetMarketOverview(ctx context.Context) (MarketOverview, error)
	// SearchInstruments returns instruments matching the given query (ticker
	// or company name substring). Returns an empty slice, not an error, when
	// no instrument data source is configured yet.
	SearchInstruments(ctx context.Context, query string) ([]InstrumentSummary, error)
	// GetInstrumentDetail returns the Stock Explorer detail payload for a
	// ticker. Returns ErrInstrumentNotFound if the ticker is not a known
	// instrument (distinct from "known instrument, but no price data yet").
	GetInstrumentDetail(ctx context.Context, ticker string) (InstrumentDetail, error)
	// GetOHLCVSeries returns historical price bars for a ticker and range.
	// Returns an empty bar slice, not an error, when no historical data
	// source is configured yet — mirrors GetMarketOverview's honesty rule.
	GetOHLCVSeries(ctx context.Context, ticker string, rng string) (OHLCVSeries, error)
	// GetFundamentals returns financial periods/metrics/ratios for a ticker.
	// periodType is "annual" or "quarterly". Returns empty slices, not an
	// error, when no fundamental data source is configured yet.
	GetFundamentals(ctx context.Context, ticker string, periodType string) (FundamentalSummary, error)
}

// NoopProvider is the default provider used when no real market-data source
// has been configured. It never returns fabricated values; it always reports
// an "unavailable" freshness status with an explanatory message.
type NoopProvider struct{}

// NewNoopProvider constructs the default, honest "not connected" provider.
func NewNoopProvider() *NoopProvider {
	return &NoopProvider{}
}

func (p *NoopProvider) Name() string {
	return "none"
}

func (p *NoopProvider) GetMarketOverview(_ context.Context) (MarketOverview, error) {
	return MarketOverview{
		Indices:   []IndexSummary{},
		Freshness: FreshnessUnavailable,
		Source:    "none",
		Message:   "Belum ada sumber data pasar yang terhubung. Konfigurasikan MARKET_DATA_PROVIDER dan MARKET_DATA_API_KEY untuk mengaktifkan data pasar.",
	}, nil
}

func (p *NoopProvider) SearchInstruments(_ context.Context, _ string) ([]InstrumentSummary, error) {
	return []InstrumentSummary{}, nil
}

func (p *NoopProvider) GetInstrumentDetail(_ context.Context, _ string) (InstrumentDetail, error) {
	// No instrument data source is configured, so every ticker is genuinely
	// unknown to NAEK right now. Returning ErrInstrumentNotFound here is the
	// honest answer, not a fabricated "found but empty" response.
	return InstrumentDetail{}, ErrInstrumentNotFound
}

func (p *NoopProvider) GetOHLCVSeries(_ context.Context, ticker string, rng string) (OHLCVSeries, error) {
	return OHLCVSeries{
		Ticker:    ticker,
		Interval:  "1d",
		Range:     rng,
		Bars:      []OHLCVBar{},
		Freshness: FreshnessUnavailable,
		Source:    "none",
		Message:   "Belum ada data historis yang terhubung ke NAEK. Grafik akan muncul setelah sumber data historis dikonfigurasi.",
	}, nil
}

func (p *NoopProvider) GetFundamentals(_ context.Context, ticker string, periodType string) (FundamentalSummary, error) {
	return FundamentalSummary{
		Ticker:     ticker,
		PeriodType: periodType,
		Periods:    []FinancialPeriod{},
		Metrics:    []FinancialMetric{},
		Ratios:     []FinancialRatio{},
		Freshness:  FreshnessUnavailable,
		Source:     "none",
		Message:    "Belum ada data fundamental yang terhubung ke NAEK. Laporan keuangan akan muncul setelah sumber data fundamental dikonfigurasi.",
	}, nil
}
