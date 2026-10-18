-- Instruments: listed companies/securities tracked by NAEK.
-- See PRD.md section 10 "Suggested Data Model (initial)".
CREATE TABLE IF NOT EXISTS instruments (
    id              BIGSERIAL PRIMARY KEY,
    ticker          VARCHAR(16) NOT NULL,
    company_name    TEXT NOT NULL,
    sector          TEXT,
    exchange        VARCHAR(16) NOT NULL DEFAULT 'IDX',
    listing_status  VARCHAR(16) NOT NULL DEFAULT 'active', -- active | suspended | delisted
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT instruments_ticker_exchange_unique UNIQUE (ticker, exchange)
);

CREATE INDEX IF NOT EXISTS idx_instruments_ticker ON instruments (ticker);
CREATE INDEX IF NOT EXISTS idx_instruments_sector ON instruments (sector);
