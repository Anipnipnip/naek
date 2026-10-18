// Command api runs the NAEK backend HTTP server.
package main

import (
	"context"
	"log"
	"net/http"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/naek/backend/internal/ai"
	"github.com/naek/backend/internal/config"
	"github.com/naek/backend/internal/handler"
	"github.com/naek/backend/internal/market"
	"github.com/naek/backend/internal/middleware"
	"github.com/naek/backend/internal/service"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("failed to load config: %v", err)
	}

	if cfg.Env == "development" {
		gin.SetMode(gin.DebugMode)
	} else {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.New()
	router.Use(gin.Recovery())
	router.Use(middleware.RequestID())
	router.Use(middleware.Logger())
	router.Use(middleware.CORS(cfg.AllowedOrigins))

	// Market-data provider: only a Noop provider is wired today. Real connectors
	// (e.g. a licensed IDX feed) must be added as implementations of market.Provider
	// and selected here based on cfg.MarketDataProvider once they exist.
	var provider market.Provider
	if cfg.IsMarketDataConfigured() {
		log.Printf("warning: MARKET_DATA_PROVIDER=%q is set but no connector is implemented yet; falling back to noop provider", cfg.MarketDataProvider)
	}
	provider = market.NewNoopProvider()

	marketService := service.NewMarketService(provider)
	marketHandler := handler.NewMarketHandler(marketService)
	instrumentHandler := handler.NewInstrumentHandler(marketService)
	healthHandler := handler.NewHealthHandler("")

	// AI provider: only a Noop provider is wired today. A real connector
	// (e.g. OpenAI/Anthropic with retrieval tools) must implement ai.Provider
	// and be selected here based on cfg.AIProvider once one exists.
	var aiProvider ai.Provider
	if cfg.IsAIConfigured() {
		log.Printf("warning: AI_PROVIDER=%q is set but no connector is implemented yet; falling back to noop provider", cfg.AIProvider)
	}
	aiProvider = ai.NewNoopProvider()
	aiService := service.NewAIService(aiProvider)
	aiHandler := handler.NewAIHandler(aiService)

	router.GET("/healthz", healthHandler.Check)

	v1 := router.Group("/api/v1")
	{
		v1.GET("/market/overview", marketHandler.GetOverview)
		v1.GET("/instruments/search", instrumentHandler.Search)
		v1.GET("/instruments/:ticker", instrumentHandler.GetDetail)
		v1.GET("/instruments/:ticker/ohlcv", instrumentHandler.GetOHLCV)
		v1.GET("/instruments/:ticker/fundamentals", instrumentHandler.GetFundamentals)
		v1.POST("/ai/ask", aiHandler.Ask)
	}

	srv := &http.Server{
		Addr:    ":" + cfg.Port,
		Handler: router,
	}

	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	go func() {
		log.Printf("naek backend listening on :%s (env=%s, market_data_provider=%s)", cfg.Port, cfg.Env, provider.Name())
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("server error: %v", err)
		}
	}()

	<-ctx.Done()
	log.Println("shutting down gracefully...")

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := srv.Shutdown(shutdownCtx); err != nil {
		log.Fatalf("forced shutdown: %v", err)
	}
	log.Println("server stopped")
}
