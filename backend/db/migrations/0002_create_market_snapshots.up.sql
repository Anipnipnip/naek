-- Market snapshots: point-in-time price/volume observations for an instrument
-- or index. Every row must retain its source and freshness status so the API
-- never has to guess or fabricate how current the data is.
-- See PRD.md FR-06 "Source and Data Freshness".
CREATE TABLE IF NOT EXISTS market_snapshots (
    id                BIGSERIAL PRIMARY KEY,
    instrument_id     BIGINT REFERENCES instruments (id) ON DELETE CASCADE,
    -- instrument_code allows snapshots for benchmark indices (e.g. "IHSG")
    -- that are not rows in `instruments`.
    instrument_code   VARCHAR(16) NOT NULL,

    price             NUMERIC(18, 4),
    change_abs        NUMERIC(18, 4),
    change_percent    NUMERIC(9, 4),
    previous_close    NUMERIC(18, 4),
    volume            BIGINT,
    turnover          NUMERIC(20, 2),

    -- Freshness/provenance — required on every row, never nullable.
    source            TEXT NOT NULL,
    freshness_status  VARCHAR(16) NOT NULL, -- real_time | delayed | end_of_day | unavailable
    observed_at       TIMESTAMPTZ NOT NULL, -- when the market data point actually occurred
    ingested_at       TIMESTAMPTZ NOT NULL DEFAULT now(), -- when NAEK recorded it

    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT market_snapshots_freshness_check
        CHECK (freshness_status IN ('real_time', 'delayed', 'end_of_day', 'unavailable'))
);

CREATE INDEX IF NOT EXISTS idx_market_snapshots_instrument_code_observed_at
    ON market_snapshots (instrument_code, observed_at DESC);
CREATE INDEX IF NOT EXISTS idx_market_snapshots_instrument_id
    ON market_snapshots (instrument_id);
