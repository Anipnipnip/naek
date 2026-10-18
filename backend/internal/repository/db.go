// Package repository provides database access using pgx.
// Concrete queries will be added as features that need persistence are built
// (e.g. instruments, market_snapshots). For now this exposes connection setup only.
package repository

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
)

// NewPool creates a PostgreSQL connection pool from a DATABASE_URL.
// Returns an error if databaseURL is empty rather than silently proceeding,
// so callers can decide whether the database is required for the current operation.
func NewPool(ctx context.Context, databaseURL string) (*pgxpool.Pool, error) {
	if databaseURL == "" {
		return nil, fmt.Errorf("DATABASE_URL is not configured")
	}

	pool, err := pgxpool.New(ctx, databaseURL)
	if err != nil {
		return nil, fmt.Errorf("failed to create connection pool: %w", err)
	}

	if err := pool.Ping(ctx); err != nil {
		pool.Close()
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	return pool, nil
}
