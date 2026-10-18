// Package config loads application configuration from environment variables.
// No secrets are hard-coded here; see .env.example for the documented variables.
package config

import (
	"fmt"
	"os"
	"strconv"
)

// Config holds all runtime configuration for the API server.
type Config struct {
	// Server
	Port string
	Env  string // "development" | "production"

	// Database
	DatabaseURL string

	// CORS
	AllowedOrigins string

	// Market data provider
	// MarketDataProvider identifies which connector to use (e.g. "none", "idx-official").
	// When set to "none" (the default), market endpoints must report data as unavailable
	// instead of fabricating values.
	MarketDataProvider string
	MarketDataAPIKey   string

	// AI provider for NAEK AI (the research-assistant feature).
	// AIProvider identifies which LLM/connector to use (e.g. "none", "openai", "anthropic").
	// When set to "none" (the default), the AI endpoint must report that no
	// AI provider is configured instead of fabricating an answer.
	AIProvider string
	AIAPIKey   string
}

// Load reads configuration from environment variables, applying safe defaults
// for local development. It never invents a database URL or API key.
func Load() (*Config, error) {
	cfg := &Config{
		Port:               getEnv("PORT", "8080"),
		Env:                getEnv("APP_ENV", "development"),
		DatabaseURL:        getEnv("DATABASE_URL", ""),
		AllowedOrigins:     getEnv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:5174,http://localhost:5175"),
		MarketDataProvider: getEnv("MARKET_DATA_PROVIDER", "none"),
		MarketDataAPIKey:   getEnv("MARKET_DATA_API_KEY", ""),
		AIProvider:         getEnv("AI_PROVIDER", "none"),
		AIAPIKey:           getEnv("AI_API_KEY", ""),
	}

	if cfg.Port == "" {
		return nil, fmt.Errorf("PORT must not be empty")
	}

	return cfg, nil
}

// IsMarketDataConfigured reports whether a real market-data provider has been
// configured. Handlers must use this instead of assuming a provider is connected.
func (c *Config) IsMarketDataConfigured() bool {
	return c.MarketDataProvider != "" && c.MarketDataProvider != "none" && c.MarketDataAPIKey != ""
}

// IsAIConfigured reports whether a real AI provider has been configured.
// Handlers must use this instead of assuming an AI backend is connected.
func (c *Config) IsAIConfigured() bool {
	return c.AIProvider != "" && c.AIProvider != "none" && c.AIAPIKey != ""
}

func getEnv(key, fallback string) string {
	if v, ok := os.LookupEnv(key); ok && v != "" {
		return v
	}
	return fallback
}

// mustAtoi is a small helper reserved for future numeric env vars (e.g. pool sizes).
func mustAtoi(s string, fallback int) int {
	if s == "" {
		return fallback
	}
	n, err := strconv.Atoi(s)
	if err != nil {
		return fallback
	}
	return n
}
