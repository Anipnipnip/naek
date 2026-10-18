# Product Requirements Document (PRD)

## Project: naek

**Status:** Draft v0.1\
**Product type:** Open-source Indonesian stock-market analysis and
education platform\
**Primary language:** Bahasa Indonesia\
**Scope:** Market monitoring, analysis, daily recap, beginner education,
and AI research assistant. No trading or order execution.

------------------------------------------------------------------------

## 1. Product Summary

naek is an open-source web platform that helps people understand
the Indonesian stock market (BEI/IDX). It combines market monitoring,
daily market summaries, stock exploration, financial fundamentals,
contextual education, and an AI chatbot that answers questions using
available market data and cited sources.

The product is **not a broker or trading application**. Users cannot
place buy/sell orders through naek. Its purpose is to help users
observe the market, research companies, understand terminology, and
assess possible market scenarios.

### Product statement

****

### Brand identity

- **Product name:** naek
- **Slogan/tagline:** none. Remove existing slogans and do not introduce a replacement.
- **Brand personality:** approachable, clever, locally recognizable, and lightly playful; the product experience itself remains rigorous and evidence-based.
- **Logo:** the owner already has a logo asset (`naek.webp`); reserve a logo slot and use `public/brand/naek.webp` when the asset is added to the public assets folder. Do not recreate it or substitute a generic icon.
- **Primary palette:** deep forest green `#174F3A`, fresh green `#38964B`, and warm ivory `#F7F5EF`; neutral white and gray-green surfaces support dense data displays.
- **Logo placement:** reserve a replaceable logo area at the top-left of the main application header, linking to Market Overview; above authentication forms; and in the footer. Use a separate favicon asset for browser tabs.
- **Brand principle:** market data, sources, calculations, and AI explanations must remain transparent and serious.

### Core promise

-   See what is happening in the market.
-   Understand what the numbers mean.
-   Explore evidence behind an analysis.
-   Learn stock-market concepts while using real data.

## 2. Problem Statement

New and intermediate retail investors often need to switch between
several websites and applications to understand market conditions, price
movements, company financials, disclosures, and market terminology.
Beginners may see terms such as order book, bid/ask, HAKA, HAKI, serok,
bullish, bearish, and saham gorengan without understanding their meaning
or limitations.

Market dashboards can show large amounts of data without explaining how
to interpret it. Generic AI chatbots may produce confident-sounding
analysis without current data, verifiable calculations, or clear
uncertainty.

naek addresses these problems by connecting market data to
plain-language explanations, traceable sources, and carefully scoped
AI-assisted research.

## 3. Goals and Non-Goals

### Goals

1.  Provide a clear overview of Indonesian market conditions.
2.  Let users explore stock prices, trading activity, historical
    performance, and available company fundamentals.
3.  Provide a daily recap of market results.
4.  Explain stock-market terminology in context, in beginner-friendly
    Bahasa Indonesia.
5.  Provide an AI research assistant that uses retrieved data and
    deterministic calculations rather than inventing figures.
6.  Show source, timestamp, period, and data limitations for important
    figures and conclusions.
7.  Build a maintainable open-source codebase that accepts community
    contributions.

### Non-goals

-   Executing trades or connecting to a broker to place orders.
-   Providing guaranteed predictions or guaranteed multibagger
    candidates.
-   Claiming that a stock is being manipulated based only on unusual
    price or volume activity.
-   Replacing a licensed financial adviser.
-   Promising real-time data before a suitable data provider and
    redistribution rights are secured.
-   Presenting AI-generated narratives as confirmed causes of price
    movements.

## 4. Target Users

### Primary: Beginner retail investor

Needs simple explanations, clear visuals, and help understanding market
terminology without being overwhelmed.

### Secondary: Self-directed retail investor

Wants to monitor a watchlist, compare stocks, review daily market
activity, and research bullish/bearish scenarios.

### Tertiary: Developer, student, or market-data enthusiast

Wants to inspect methodology, use documented APIs where available,
contribute data connectors, or improve financial calculations.

## 5. Product Principles

1.  **Beginner-first:** use plain Indonesian by default; explain jargon
    inline.
2.  **Evidence-first:** show the data and source behind factual claims.
3.  **Honest about uncertainty:** distinguish facts, interpretations,
    scenarios, and predictions.
4.  **No false real-time claims:** display the latest update time and
    whether data is delayed, end-of-day, or real-time.
5.  **No hidden recommendations:** do not disguise uncertain analysis as
    a guaranteed buy/sell instruction.
6.  **Privacy-conscious:** collect only the information needed for
    optional accounts, watchlists, and preferences.
7.  **Open by design:** document data schemas, formulas, limitations,
    and contribution processes.

## 6. Core User Journeys

### Journey A: Understand today's market

1.  User opens Market Overview.
2.  User sees the IHSG/index summary, market breadth, sector movement,
    top gainers/losers, and market-data timestamp.
3.  User clicks an unfamiliar term.
4.  A contextual explainer gives a plain-language definition, a small
    example, and a caveat.
5.  User opens Daily Market Recap for a longer summary.

### Journey B: Research a stock

1.  User searches for a ticker or company.
2.  User sees price and chart information, available trading activity,
    company profile, and fundamentals.
3.  User switches between intraday and historical views where data
    supports them.
4.  User sees the source and freshness of each data group.
5.  User saves the stock to an optional watchlist.

### Journey C: Ask AI about a market move

1.  User asks, "Kenapa saham XYZ turun hari ini?"
2.  The AI identifies the required data and retrieves the latest
    available price, volume, relevant disclosures/news, and
    benchmark/sector context.
3.  Deterministic services calculate returns and other metrics.
4.  The AI explains what the data shows, what might be relevant, what
    cannot be concluded, and links to sources.
5.  If data is missing or stale, the AI says so instead of guessing.

### Journey D: Explore a potential multibagger

1.  User asks for companies with long-term growth characteristics.
2.  AI clarifies or applies transparent screening criteria.
3.  The platform returns candidates that pass the criteria, with
    metrics, period, valuation context, risk factors, and source links.
4.  The interface labels the results as research candidates, not
    predictions or guarantees.
5.  The user can inspect the assumptions and compare candidates.

### Journey E: Understand unusual activity

1.  User opens a stock flagged for unusual price/volume movement.
2.  The platform shows the trigger and comparison baseline.
3.  AI explains possible interpretations and alternative explanations.
4.  The platform explicitly states that unusual activity is not proof of
    manipulation or a specific participant's intent.

## 7. Functional Requirements

### P0 --- MVP essentials

#### FR-01: Market Overview

-   Display available benchmark/index data, including IHSG where
    licensed and accessible.
-   Show market direction and change against the previous close.
-   Show market breadth: number of rising, falling, and unchanged stocks
    when data is available.
-   Show sector performance and top gainers/losers based on a clearly
    stated universe and time window.
-   Show volume/turnover only when the provider supplies reliable
    values.
-   Show data status: real-time, delayed, end-of-day, or unavailable.
-   Show the last successful update timestamp and timezone
    (Asia/Jakarta).

#### FR-02: Stock Explorer

-   Search by ticker or company name.
-   Provide a stock detail page with company identity, price summary,
    historical chart, and available trading metrics.
-   Support multiple time windows where the underlying data supports
    them.
-   Explain chart units, percentage change, volume, and other common
    terms through tooltips or inline links.
-   Display missing data clearly instead of silently substituting zeros.

#### FR-03: Daily Market Recap

-   Summarize the market close using observed data.
-   Include index movement, market breadth, notable sectors, top
    gainers/losers, and unusual activity when available.
-   Distinguish observed facts from interpretation.
-   Include the session date, data timestamp, calculation method, and
    source links.
-   Do not assert a cause for market movement without supporting
    evidence.

#### FR-04: Beginner Learning Layer

-   Provide a searchable glossary for terms such as bid, ask, spread,
    order book, lot, volume, liquidity, bullish, bearish, HAKA, HAKI,
    serok, ARA/ARB, PER, PBV, ROE, and operating cash flow.
-   Each term should include: simple definition, numerical/example
    scenario, how to interpret it, common misconception, and related
    terms.
-   Explain informal community slang as slang, not as official exchange
    terminology.
-   Surface contextual explanations inside relevant charts, tables, and
    AI responses.

#### FR-05: AI Research Assistant

-   Accept natural-language questions in Bahasa Indonesia.
-   Answer questions about market conditions, stock moves, chart
    concepts, fundamentals, and market terminology.
-   Retrieve relevant data through explicit tools/services.
-   Use tested code for calculations such as returns, moving averages,
    volatility, ratios, and comparisons.
-   Cite sources and display data freshness for material claims.
-   Separate facts, interpretations, and hypothetical scenarios.
-   Clearly disclose when information is unavailable, stale, incomplete,
    or delayed.
-   Do not claim certainty about future prices or guarantee multibagger
    outcomes.
-   Do not label a company as manipulated or "gorengan" as a fact solely
    from price/volume patterns.
-   For "bullish/bearish" questions, present supporting evidence,
    counter-evidence, time horizon, and invalidation conditions where
    data allows.
-   For multibagger queries, explain the screening criteria and risks
    and label outputs as research candidates.
-   For anomaly queries, show the rule or threshold that triggered the
    flag.

#### FR-06: Source and Data Freshness

-   Every market-data module must expose source/provider, timestamp,
    data period, and delay/status where available.
-   Separate observation time from ingestion time.
-   Make it possible to trace important AI claims back to data or
    documents.
-   Record data corrections/revisions when feasible.

### P1 --- After initial MVP

#### FR-07: Watchlist

-   Allow users to save and remove tickers.
-   Watchlists are for monitoring only and do not execute trades.
-   Optional account support may sync watchlists across devices.

#### FR-08: Alerts

-   Notify users of configurable price/volume changes, new company
    disclosures, or newly published financial reports.
-   Each alert must explain its trigger and timestamp.
-   Avoid language implying a guaranteed trading opportunity.

#### FR-09: Fundamental Explorer

-   Show available income statement, balance sheet, and cash-flow
    metrics.
-   Compare quarter-on-quarter (QoQ) and year-on-year (YoY) periods.
-   Show formulas and units for financial ratios.
-   Account for industry differences and missing/inconsistent reporting
    periods.

#### FR-10: Unusual Activity Monitor

-   Flag configurable unusual movements in price, volume, volatility, or
    liquidity.
-   Explain the baseline and threshold.
-   Use neutral labels such as "aktivitas tidak biasa" or "perlu
    ditinjau."
-   Never infer manipulation or a specific actor's intention without
    independent evidence.

#### FR-11: Prediction and Model Evaluation

-   Store model/scenario version, creation timestamp, ticker/universe,
    forecast horizon, predicted outcome, and evaluation method.
-   Evaluate forecasts against a documented benchmark after the horizon
    ends.
-   Report calibration and errors, not just selected successful
    examples.
-   Prevent edits to past forecasts from obscuring evaluation history.

#### FR-12: Public API and Community Connectors

-   Document stable endpoints and schemas.
-   Allow connector modules for approved data sources.
-   Include tests, rate limits, attribution, and source-specific usage
    constraints.
-   Do not bundle third-party datasets unless redistribution is
    permitted.

## 8. AI Answer Format

For analytical answers, use a consistent response structure:

1.  **Ringkasan:** one or two sentences in plain Indonesian.
2.  **Data yang terlihat:** relevant figures, period, timestamp, and
    source.
3.  **Interpretasi:** what the evidence may indicate.
4.  **Skenario alternatif:** what could contradict the interpretation.
5.  **Risiko dan batasan:** missing data, uncertainty, liquidity, or
    event risks.
6.  **Apa yang perlu dipantau:** observable signals, not a mandatory
    trade instruction.
7.  **Sources:** links to underlying data, filings, or news.

For basic educational questions, a shorter format is acceptable:
definition, example, misconception, and related terms.

## 9. Data and Technical Architecture

### Selected initial stack

-   **Frontend:** React + TypeScript. The frontend is a separate web
    application and communicates with the backend through HTTP APIs.
-   **Backend API:** Go (Golang) + Gin. Use Go for API handlers,
    middleware, business logic, and orchestration of market-data services.
-   **Database:** PostgreSQL for instruments, market snapshots, OHLCV,
    financial periods, disclosures, recaps, and optional user data.
-   **Database access:** `pgx` for PostgreSQL connectivity and `sqlc` to
    generate type-safe Go code from SQL queries. Use migrations to manage
    schema changes.
-   **Background work:** start with Go-based scheduled jobs or worker
    processes for ingestion, normalization, recap generation, and other
    periodic tasks. Add Redis only when a real queue, caching, or
    coordination need is identified; BullMQ is not part of the Go stack.
-   **Cache:** Redis is an optional later component for frequently read
    market summaries, rate limiting, or coordinating workers. PostgreSQL
    remains the source of truth.
-   **Charts:** TradingView Lightweight Charts or Apache ECharts, subject
    to library licensing and usage requirements.
-   **Realtime delivery:** Server-Sent Events (SSE) for one-way updates;
    use WebSocket only if bidirectional communication is required.
-   **Deployment:** Docker and Docker Compose for reproducible local
    development and deployment to a VPS or another suitable environment.
-   **Data processing:** implement ingestion, validation, and financial
    calculations in Go initially. Python is not a required runtime
    dependency; it may be added later for a specific statistical or
    machine-learning workload that benefits from it.

### Suggested repository structure

```text
naek/
├── frontend/                 # React + TypeScript
├── backend/
│   ├── cmd/api/              # Go API entry point
│   ├── internal/
│   │   ├── config/           # Environment and application config
│   │   ├── handler/          # HTTP handlers
│   │   ├── middleware/       # Request IDs, logging, CORS, rate limits, etc.
│   │   ├── service/          # Application and domain logic
│   │   ├── repository/       # Database access
│   │   └── market/           # Market-data ingestion and calculations
│   ├── db/
│   │   ├── migrations/       # Database schema migrations
│   │   └── queries/          # SQL queries consumed by sqlc
│   ├── sqlc.yaml
│   └── go.mod
├── design.md
├── prd.md
├── naek.webp
└── docker-compose.yml
```

This is a proposed starting layout, not a requirement to create every
package immediately. Keep the first implementation small and split
modules when the responsibilities become clear.

### High-level pipeline

1.  Approved source/provider connector.
2.  Ingestion and normalization.
3.  Validation, deduplication, and timestamping.
4.  Database and cache.
5.  Deterministic calculation/analytics services.
6.  API and realtime delivery.
7.  Web UI and AI orchestration layer.

### Important data distinction

-   End-of-day data is appropriate for daily recaps and historical
    exploration.
-   Intraday prices require an appropriate intraday feed.
-   Full order-book depth and trade-by-trade replay require more
    granular data than ordinary daily OHLCV.
-   A dashboard must not describe delayed or periodically polled data as
    real-time.
-   Public accessibility does not automatically grant redistribution
    rights. Verify provider terms, exchange licensing, attribution, and
    storage rules before publishing data.

## 10. Suggested Data Model (initial)

-   `instruments`: ticker, company name, sector, listing status,
    exchange identifiers.
-   `market_snapshots`: instrument/index, price, change, volume,
    turnover, observed_at, ingested_at, source, freshness status.
-   `ohlcv_bars`: instrument, interval, open, high, low, close, volume,
    timestamp, source.
-   `financial_periods`: instrument, reporting period, publication date,
    currency, unit, source document.
-   `financial_metrics`: period, metric name, value, unit, calculation
    method, source location.
-   `disclosures`: instrument, publication time, title, URL, source.
-   `daily_recaps`: session date, summary facts, metric references,
    generated_at, version.
-   `glossary_terms`: term, category, plain-language definition,
    example, caveats, related terms.
-   `watchlists` and `watchlist_items`: optional user-owned monitoring
    lists.
-   `ai_sessions` and `ai_messages`: optional chat history, with privacy
    and retention controls.
-   `ai_claim_sources`: links claims or answer sections to underlying
    data/document identifiers.
-   `model_forecasts`: model/version, forecast timestamp, horizon,
    outcome definition, forecast, evaluation status.

Store source and timestamps with data rather than only on the page that
displays it. Financial data should also retain units and
reporting-period context.

## 11. Non-Functional Requirements

### Reliability

-   Display data freshness and source status.
-   Handle missing, delayed, and contradictory sources gracefully.
-   Retry ingestion safely and avoid duplicate records.

### Performance

-   Cache market overview and frequently requested instrument data.
-   Use pagination for large lists.
-   Stream updates only when the source actually provides new data.
-   Set measurable targets after a provider and deployment environment
    are selected.

### Security and privacy

-   Validate input and rate-limit APIs.
-   Protect optional accounts and saved user preferences.
-   Avoid sending unnecessary personal data to external AI providers.
-   Document chat-history retention and allow users to clear it.
-   Keep provider keys and secrets out of the frontend and public
    repository.

### Accessibility and beginner usability

-   Mobile-responsive layouts.
-   Clear labels and consistent number/date formatting.
-   Do not rely on red/green color alone; add signs, labels, and
    accessible contrast.
-   Explain jargon progressively without overwhelming the main
    dashboard.
-   Use empty states and explicit error messages.

### Open-source maintainability

-   Public README, contribution guide, code of conduct, issue templates,
    and tests.
-   Document metric formulas, provider setup, and data limitations.
-   Use a license compatible with the project's intended distribution.
-   Keep data-provider terms separate from the code license.

## 12. Safety, Trust, and Compliance Guardrails

-   Do not promise returns or guaranteed outcomes.
-   Do not present AI output as certainty or personalized financial
    advice.
-   Label research candidates and scenarios clearly.
-   Provide uncertainty and counter-evidence alongside directional
    analysis.
-   Treat "gorengan" as informal terminology, not a definitive legal or
    factual classification.
-   Do not accuse a company or market participant of manipulation based
    solely on statistical anomalies.
-   Provide correction/reporting paths for inaccurate data or
    explanations.
-   Review Indonesian legal, exchange, data-provider, and
    financial-content obligations before public launch.

## 13. Success Metrics

Initial product metrics: - Percentage of market-data modules with
visible freshness and source attribution. - Percentage of AI factual
claims with traceable supporting sources. - AI answer usefulness rating
from users. - Beginner glossary completion and helpfulness feedback. -
Data ingestion success rate and duplicate/error rate. - Daily recap
generation success rate. - Forecast evaluation coverage and
out-of-sample performance once forecasting exists. - Open-source
contributor activity, issue response time, and test coverage.

Do not optimize only for engagement or number of AI predictions.
Trustworthiness and usefulness are more important.

## 14. MVP Acceptance Criteria

The first public MVP is ready when: - A user can view a market overview
using an explicitly identified data source and freshness status. - A
user can search for and open supported listed instruments. - A user can
view historical prices for supported instruments. - A daily recap can be
generated from verifiable data and separates facts from
interpretation. - Glossary explanations are accessible from relevant UI
components. - The AI can answer supported questions using retrieved data
and tested calculations. - The AI displays sources and acknowledges
unavailable or stale data. - No trading, order-placement, or
broker-execution flow exists. - Provider licensing and redistribution
permissions have been reviewed for every published data feed. - The
project has setup instructions, tests for key calculations, contribution
documentation, and an explicit license.

## 15. Open Decisions

1.  Which market-data provider can support the intended update frequency
    and public display rights?
2.  Is the first release historical/end-of-day only, or does a licensed
    intraday feed exist?
3.  Which initial set of stocks and financial metrics will be supported?
4.  Which AI model/provider will be used, and what is the per-user cost
    budget?
5.  Will chat history and watchlists work without an account, with local
    storage, or with optional accounts?
6.  Which license best fits code contributions and the intended
    community?
7.  What disclaimer and compliance review is required before public
    launch?

## 16. Recommended Initial Release

Start with: - Market overview based on licensed historical/end-of-day
data. - Stock Explorer with historical charts. - Daily Market Recap. -
Contextual beginner glossary. - AI chatbot for explanations and
evidence-based summaries. - A small, documented set of financial
metrics.

Then add intraday updates, order-book analysis, unusual-activity
detection, and evaluated forecasting only when data access and testing
are ready.
