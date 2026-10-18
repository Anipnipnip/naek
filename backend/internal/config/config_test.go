package config

import "testing"

func TestLoad_Defaults(t *testing.T) {
	cfg, err := Load()
	if err != nil {
		t.Fatalf("Load() returned unexpected error: %v", err)
	}

	if cfg.Port != "8080" {
		t.Errorf("Port = %q, want %q", cfg.Port, "8080")
	}
	if cfg.Env != "development" {
		t.Errorf("Env = %q, want %q", cfg.Env, "development")
	}
	if cfg.DatabaseURL != "" {
		t.Errorf("DatabaseURL = %q, want empty (must never invent a database URL)", cfg.DatabaseURL)
	}
	if cfg.MarketDataProvider != "none" {
		t.Errorf("MarketDataProvider = %q, want %q", cfg.MarketDataProvider, "none")
	}
	if cfg.MarketDataAPIKey != "" {
		t.Errorf("MarketDataAPIKey = %q, want empty", cfg.MarketDataAPIKey)
	}
	if cfg.AIProvider != "none" {
		t.Errorf("AIProvider = %q, want %q", cfg.AIProvider, "none")
	}
	if cfg.AIAPIKey != "" {
		t.Errorf("AIAPIKey = %q, want empty", cfg.AIAPIKey)
	}
}

func TestLoad_ReadsEnvironmentOverrides(t *testing.T) {
	t.Setenv("PORT", "9090")
	t.Setenv("APP_ENV", "production")
	t.Setenv("DATABASE_URL", "postgres://example")
	t.Setenv("MARKET_DATA_PROVIDER", "idx-official")
	t.Setenv("MARKET_DATA_API_KEY", "test-key")

	cfg, err := Load()
	if err != nil {
		t.Fatalf("Load() returned unexpected error: %v", err)
	}

	if cfg.Port != "9090" {
		t.Errorf("Port = %q, want %q", cfg.Port, "9090")
	}
	if cfg.Env != "production" {
		t.Errorf("Env = %q, want %q", cfg.Env, "production")
	}
	if cfg.DatabaseURL != "postgres://example" {
		t.Errorf("DatabaseURL = %q, want %q", cfg.DatabaseURL, "postgres://example")
	}
	if cfg.MarketDataProvider != "idx-official" {
		t.Errorf("MarketDataProvider = %q, want %q", cfg.MarketDataProvider, "idx-official")
	}
}

func TestIsMarketDataConfigured(t *testing.T) {
	tests := []struct {
		name     string
		provider string
		apiKey   string
		want     bool
	}{
		{"default none/empty", "none", "", false},
		{"empty provider", "", "some-key", false},
		{"provider set but no key", "idx-official", "", false},
		{"explicitly none even with key", "none", "some-key", false},
		{"fully configured", "idx-official", "some-key", true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			cfg := &Config{MarketDataProvider: tt.provider, MarketDataAPIKey: tt.apiKey}
			if got := cfg.IsMarketDataConfigured(); got != tt.want {
				t.Errorf("IsMarketDataConfigured() = %v, want %v (provider=%q, key=%q)", got, tt.want, tt.provider, tt.apiKey)
			}
		})
	}
}

func TestIsAIConfigured(t *testing.T) {
	tests := []struct {
		name     string
		provider string
		apiKey   string
		want     bool
	}{
		{"default none/empty", "none", "", false},
		{"empty provider", "", "some-key", false},
		{"provider set but no key", "openai", "", false},
		{"explicitly none even with key", "none", "some-key", false},
		{"fully configured", "openai", "some-key", true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			cfg := &Config{AIProvider: tt.provider, AIAPIKey: tt.apiKey}
			if got := cfg.IsAIConfigured(); got != tt.want {
				t.Errorf("IsAIConfigured() = %v, want %v (provider=%q, key=%q)", got, tt.want, tt.provider, tt.apiKey)
			}
		})
	}
}
