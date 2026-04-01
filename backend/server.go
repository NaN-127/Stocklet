package main

import (
	"log"
	"os"

	"stocklet-backend/config"
	"stocklet-backend/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(".env", "backend/.env"); err != nil {
		log.Println(".env file not found, using environment variables")
	}

	config.ConnectDB()

	r := gin.Default()

	frontendURL := os.Getenv("FRONTEND_URL")
	if frontendURL == "" {
		frontendURL = "http://localhost:5173"
	}

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{frontendURL, "http://127.0.0.1:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowCredentials: true,
	}))

	routes.RegisterRoutes(r)

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	log.Printf("Server running on http://localhost:%s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Server failed to start: ", err)
	}
}
