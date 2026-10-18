# naek — Design System & UI Guidelines

> **Product:** Indonesian stock-market monitoring, analysis, and education platform.
> **Design direction:** Elegant, minimalist, data-first, approachable, and subtly playful.

---

## 1. Product design principles

naek helps users understand what is happening in the Indonesian stock market and why it may be happening. The interface should feel trustworthy enough for serious market research, but approachable for people who are still learning.

1. **Clarity over decoration.** Charts, numbers, and explanations are the main content. Avoid unnecessary gradients, glass effects, heavy shadows, and decorative illustrations.
2. **Evidence before conclusions.** Display data source, market period, and last-updated time wherever relevant.
3. **Beginner-friendly by default.** Explain financial jargon in context with short tooltips, definitions, and examples.
4. **Separate fact from interpretation.** Distinguish observed data, calculated metrics, AI-generated interpretation, and hypothetical scenarios.
5. **No false certainty.** Do not present AI analysis as guaranteed investment outcomes or imply that green means a stock is a good investment.
6. **Responsive and accessible.** Make core market information usable on desktop, tablet, and mobile, with keyboard navigation and readable contrast.

## 2. Brand identity

- **Product name:** naek
- **Slogan/tagline:** none. Do not display a slogan anywhere in the interface, metadata, footer, authentication pages, or documentation.
- **Logo asset:** `naek.webp`, the logo asset supplied by the project owner. In the current project folder, keep it at the root alongside `design.md` and `prd.md`. When implementing the React/Vite frontend, copy the asset into the frontend public assets at `public/brand/naek.webp` so the app can serve it at `/brand/naek.webp`.

### Logo asset usage

Use the existing `naek.webp` asset. Do not generate a temporary wordmark or icon, redraw the logo, or convert it by simply changing its file extension.

### Logo file structure

Keep the current project files arranged like this:

```text
naek/
├── design.md
├── prd.md
└── naek.webp
```

The original `naek.webp` stays in the project root alongside the documentation. When the React/Vite frontend is implemented, copy the logo into the frontend public directory using this asset path:

```text
public/
└── brand/
    └── naek.webp
```

Keep the logo file replaceable: reference the asset path rather than embedding the artwork in components. Do not invent a replacement mark. A separate favicon is optional and must not replace the supplied logo.

**Primary placement:** the top-left of the main application header, linking to the Market Overview page.

**Other placements:**
- Login, registration, and password-reset pages: above the form.
- Footer: small logo only; do not add a slogan.
- Browser tab: favicon, not the full logo.
- Open Graph/social previews: logo in a dedicated share-card layout.
- Documentation and README: use the logo near the project title.

**Do not** use the full logo as a watermark on charts, repeat it inside every card, or stretch it to fill space.

Keep the supplied `naek.webp` in the project root for now. During frontend implementation, copy it to `public/brand/naek.webp` and reference it from the UI as `/brand/naek.webp`. Do not recreate, redraw, or rename the asset to a different format. Preserve its aspect ratio and check that it remains legible against the intended background.

Example React usage:

```tsx
<a href="/" className="brand" aria-label="naek — Market Overview">
  <img
    src="/brand/naek.webp"
    alt="naek"
    className="brand__logo"
  />
</a>
```

Suggested logo sizing:
- Desktop header: height `30–36px`, width auto.
- Mobile header: height `26–30px`, width auto.
- Login page: height `42–52px`, width auto.
- Footer: height `24–30px`, width auto.

Use `object-fit: contain`; never distort the logo's aspect ratio.

## 3. Color system

Use a restrained palette. Most screens should be neutral, with green reserved for brand accents and positive market movement. Red is reserved for negative market movement, not general error decoration alone.

### Brand colors

| Token | Hex | Usage |
|---|---|---|
| `--naek-forest` | `#174F3A` | Primary brand color, headings, primary buttons |
| `--naek-green` | `#38964B` | Brand accent, selected states, positive emphasis when contextually correct |
| `--naek-sage` | `#B7C9B0` | Subtle decorative surfaces and secondary accents |
| `--naek-ivory` | `#F7F5EF` | Optional warm page background |
| `--naek-white` | `#FFFFFF` | Main content surfaces |
| `--naek-ink` | `#18231F` | Primary text |
| `--naek-muted` | `#68736D` | Secondary text and helper labels |
| `--naek-border` | `#E3E8E4` | Borders and dividers |

### Market-semantic colors

| Token | Hex | Usage |
|---|---|---|
| `--market-up` | `#16834A` | Positive price/return movement |
| `--market-down` | `#D64545` | Negative price/return movement |
| `--market-neutral` | `#69737D` | Unchanged or neutral values |
| `--market-warning` | `#A96A10` | Stale data, risk notices, caution |
| `--market-info` | `#3569A8` | Informational notices |

Do not communicate market direction through color alone. Include a `+`/`−` sign, arrow, label, or percentage.

### Surface guidance

- Default app background: `#F7F8F6` or `#F7F5EF`.
- Cards and tables: white.
- Borders: light neutral gray-green.
- Use green sparingly; a dashboard should not become a wall of green.
- Avoid using bright green for large background areas or long paragraphs.
- Support a dark theme later, but ship a polished light theme first unless the product requirements change.

## 4. Typography

Use a modern sans-serif family such as **Inter**, **Geist**, or **Plus Jakarta Sans**. Choose one primary font family and use it consistently.

- Page title: 24–30px, semibold.
- Section heading: 16–20px, semibold.
- Body: 14–16px, regular.
- Dense table content: 13–14px, with comfortable row height.
- Helper text and metadata: 12–13px.
- Market prices and key figures: tabular numerals (`font-variant-numeric: tabular-nums`).
- Avoid very light font weights for financial numbers.
- Use sentence case for headings; avoid excessive all-caps labels.

The supplied logo is separate from application typography. Do not recreate it by typing a generic font.

## 5. Layout and spacing

Use a consistent spacing scale based on 4px:

`4, 8, 12, 16, 20, 24, 32, 40, 48, 64`

- Main desktop content: max-width around `1440px`, with responsive side padding.
- Desktop page padding: `24–32px`.
- Mobile page padding: `16px`.
- Card padding: `16–24px`.
- Standard card radius: `12–16px`.
- Input/button radius: `8–10px`.
- Prefer subtle borders over large shadows.
- Use a consistent grid and align cards to a clear baseline.
- Tables may scroll horizontally on small screens, but the most important columns should remain visible where practical.

## 6. Application shell and navigation

### Desktop

Use a compact top bar with the naek logo on the left, primary navigation, and utility actions on the right.

Suggested navigation:
- **Pasar** — market overview
- **Saham** — stock explorer
- **Fundamental** — company financials
- **Rangkuman** — daily market recap
- **Belajar** — glossary and education
- **AI Analyst** — evidence-based assistant

Watchlist and settings can live in utility navigation. Do not make every feature a top-level item if it creates clutter.

### Mobile

Use a compact top bar with the logo and a menu/search control. Keep the most common destinations accessible without forcing a desktop-style horizontal navigation into a narrow viewport. Market tables should become simplified lists or horizontally scrollable tables with clear affordances.

### Navigation behavior

- Current page is visibly selected.
- Search is easy to access from every main screen.
- Preserve user filters when navigating back from a stock detail page where feasible.
- Use clear Indonesian labels; technical terms may retain their common market wording, with explanations on first use.

## 7. Core screen guidance

### 7.1 Market Overview (`/pasar`)

Purpose: help users understand the market at a glance.

Recommended order:
1. Page title, market session/date, and data freshness indicator.
2. IHSG/index summary with value, absolute change, percentage change, and previous close where available.
3. Market breadth: advancing, declining, and unchanged stocks, only when source data supports it.
4. Sector performance.
5. Top gainers and losers with price, percentage change, and volume where available.
6. Market activity highlights and links to the daily recap.
7. Small educational callouts explaining unfamiliar metrics.

Use compact cards and tables, not oversized decorative KPI tiles. Avoid presenting delayed or end-of-day data as live data.

### 7.2 Stock Explorer (`/saham` and `/saham/:ticker`)

- Provide prominent search by ticker or company name.
- Show company name, ticker, sector, and data timestamp.
- Show price chart with clear range controls and an explicit label for intraday, delayed, or historical data.
- Include key trading statistics only when supplied by the data source.
- Separate price/technical information from company fundamentals.
- Add a concise “What changed?” section only when there is evidence to support it.
- Link relevant company disclosures and financial reports.

### 7.3 Fundamental Explorer (`/fundamental`)

- Present revenue, profit, cash flow, debt, and key ratios with their reporting period.
- Make period selection obvious: annual versus quarterly.
- Include a definition or tooltip for metrics such as PER, PBV, ROE, and debt ratios.
- Show the formula or methodology for derived metrics in a details view.
- Avoid labeling a stock “cheap” or “expensive” based on one ratio alone.

### 7.4 Daily Market Recap (`/rangkuman`)

- Clearly label the market date and whether the recap is preliminary or final.
- Summarize index movement, market breadth, sector performance, and notable movers.
- Separate confirmed data from possible explanations.
- Link explanations to disclosures, official releases, or other relevant sources.
- Include a concise “What this means” section written for non-experts.

### 7.5 Learn (`/belajar`)

- Use searchable glossary cards and short articles.
- Explain one concept at a time using plain Indonesian.
- Include small, clearly marked examples.
- Make it easy to return to the relevant stock or metric.
- Do not frame educational examples as recommendations to buy or sell.

### 7.6 AI Analyst (`/ai`)

The AI experience should feel like a research assistant, not a fortune teller.

- Provide suggested prompts, such as “Kenapa saham ini turun hari ini?” and “Jelaskan PER dengan contoh.”
- Show which ticker, date range, and data sources are being analyzed.
- Separate **Data yang terlihat**, **Interpretasi**, **Risiko / kontra-argumen**, and **Hal yang perlu dipantau**.
- Include source links and timestamps for factual claims.
- Label forecasts and scenarios as uncertain; never guarantee returns.
- Use compact evidence cards for computed metrics, not long unstructured blocks.
- Show a clear state when the required data is missing, stale, or unavailable.
- Do not add buy/sell execution buttons or connect the AI to order placement.

## 8. Charts, tables, and financial data

- Use charts only when they clarify a trend, comparison, or relationship.
- Label axes, units, date ranges, and data frequency.
- Tooltips should show exact values and dates.
- Do not use 3D charts or decorative chart effects.
- Keep grid lines subtle and make the plotted data visually dominant.
- Use consistent number formatting: Indonesian locale where appropriate, with clear `Rp`, `%`, and volume units.
- Use tabular numerals for aligned financial figures.
- Tables should have clear column headers, right-align numeric values, and provide visible hover/focus states.
- Avoid unnecessary decimal places; precision should match the source data.
- Display `Data diperbarui: [timestamp]` and the relevant market date/period.
- Data freshness labels must be explicit: **Real-time**, **Tertunda**, **Penutupan pasar**, or **Data tidak tersedia**. Only use “Real-time” when the source and redistribution rights genuinely support it.

## 9. Data freshness and source transparency

Every market-data screen must communicate the freshness and context of the data.

Recommended metadata:
- Source/provider.
- Timestamp of last update, in Asia/Jakarta time.
- Trading date or financial-report period.
- Whether the data is real-time, delayed, end-of-day, or historical.
- Formula/methodology for calculated metrics, when relevant.

If a provider or feed is unavailable, show a clear empty/error state rather than fabricated values. Do not silently substitute stale data for current data.

## 10. Interaction and feedback

- Buttons use clear verbs: “Lihat detail”, “Bandingkan”, “Simpan ke watchlist”.
- Primary buttons use forest green with accessible contrast.
- Secondary actions use neutral outlines or text buttons.
- Loading states should preserve layout to reduce visual jumping.
- Empty states should explain why there is no data and what the user can do next.
- Error messages should be actionable and non-technical where possible.
- Confirm destructive actions.
- Use tooltips for extra explanations, but never hide essential financial context inside hover-only UI.
- Avoid excessive toasts; use inline feedback for persistent or important states.

## 11. Accessibility and responsive behavior

- Aim for WCAG AA contrast for text and controls.
- Every interactive element must be keyboard accessible and show a visible focus state.
- Provide meaningful alt text for the logo (`naek`) and informative images.
- Use semantic headings and labels.
- Do not rely on red/green alone to convey gains and losses.
- Support browser zoom and narrow screens.
- Respect reduced-motion preferences.
- Use touch targets around 44px where practical on mobile.

## 12. Suggested CSS tokens

```css
:root {
  --naek-forest: #174F3A;
  --naek-green: #38964B;
  --naek-sage: #B7C9B0;
  --naek-ivory: #F7F5EF;

  --background: #F7F8F6;
  --surface: #FFFFFF;
  --foreground: #18231F;
  --muted: #68736D;
  --border: #E3E8E4;

  --market-up: #16834A;
  --market-down: #D64545;
  --market-neutral: #69737D;
  --market-warning: #A96A10;
  --market-info: #3569A8;

  --radius-card: 14px;
  --radius-control: 9px;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
}
```

## 13. Microcopy examples

Prefer:
- “Data penutupan — 16.00 WIB”
- “Harga tertunda 15 menit” (only if that delay is verified)
- “Belum ada data untuk periode ini.”
- “Angka ini menunjukkan perubahan harga, bukan jaminan arah berikutnya.”
- “Penjelasan AI berdasarkan data yang tersedia per [waktu].”
- “Lihat sumber data”
- “Pelajari arti PER”

Avoid:
- “Pasti cuan!”
- “Saham ini dijamin naik.”
- “AI tahu saham yang akan meledak.”
- “Real-time” when data is delayed or end-of-day.

## 14. Suggested component inventory

- `AppHeader`
- `BrandLogo`
- `PrimaryNavigation`
- `GlobalSearch`
- `MarketStatusBadge`
- `DataFreshnessLabel`
- `IndexSummaryCard`
- `MarketBreadthPanel`
- `SectorPerformanceTable`
- `MoversTable`
- `StockPriceChart`
- `MetricInfoTooltip`
- `SourceCitation`
- `PeriodSelector`
- `EmptyState`
- `LoadingSkeleton`
- `AIAnalysisPanel`
- `EvidenceCard`
- `GlossaryTerm`
- `WatchlistButton`

Keep components consistent across pages; avoid building a unique card style for every metric.

## 15. Definition of done for UI implementation

- [ ] The supplied `naek.webp` is preserved in the project root; during frontend implementation, it is copied to `public/brand/naek.webp` and used in the header and authentication screens.
- [ ] The logo keeps its original aspect ratio and has sufficient contrast on its background.
- [ ] Core colors and spacing use shared design tokens.
- [ ] Market movement uses accessible color plus text/sign indicators.
- [ ] Every displayed market value includes the relevant period and freshness context.
- [ ] No fake market values or unsupported real-time claims are shown.
- [ ] Desktop and mobile layouts are tested.
- [ ] Loading, empty, error, and stale-data states are implemented.
- [ ] Charts and tables remain readable at narrow widths.
- [ ] AI responses distinguish facts, interpretation, and uncertainty.
- [ ] No trading execution or broker order placement is included.

---

## Final design direction

Build naek as a **calm, modern market-research dashboard**: neutral surfaces, restrained brand accents, precise financial tables, readable charts, and helpful explanations. The naek brand should stay clean and approachable; the data presentation must remain disciplined and transparent.
