package routes

import (
	"stocklet-backend/handlers"
	"stocklet-backend/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine) {
	api := r.Group("/api")

	auth := api.Group("/auth")
	{
		auth.POST("/register", handlers.Register)
		auth.POST("/login", handlers.Login)
	}

	stocks := api.Group("/stocks")
	{
		stocks.GET("/:symbol", handlers.GetStockBySymbol)
		stocks.GET("/:symbol/history", handlers.GetHistoricalData)
		stocks.GET("/history/:symbol", handlers.GetHistoricalData)
	}

	transactions := api.Group("/transactions")
	transactions.Use(middleware.AuthMiddleware())
	{
		transactions.POST("", handlers.CreateTransaction)
		transactions.POST("/", handlers.CreateTransaction)
		transactions.GET("/my-transactions", handlers.GetMyTransactions)

		adminTx := transactions.Group("")
		adminTx.Use(middleware.AdminMiddleware())
		{
			adminTx.GET("", handlers.GetAllTransactions)
			adminTx.GET("/", handlers.GetAllTransactions)
			adminTx.PUT("/:id/approve", handlers.ApproveTransaction)
			adminTx.PUT("/:id/reject", handlers.RejectTransaction)
		}
	}

	watchlist := api.Group("/watchlist")
	watchlist.Use(middleware.AuthMiddleware())
	{
		watchlist.POST("", handlers.AddToWatchList)
		watchlist.POST("/", handlers.AddToWatchList)
		watchlist.GET("", handlers.GetWatchList)
		watchlist.GET("/", handlers.GetWatchList)
		watchlist.DELETE("/:symbol", handlers.RemoveFromWatchList)
	}

	users := api.Group("/users")
	users.Use(middleware.AuthMiddleware(), middleware.AdminMiddleware())
	{
		users.GET("", handlers.GetAllUsers)
		users.GET("/", handlers.GetAllUsers)
		users.DELETE("/:id", handlers.DeleteUser)
	}
}
