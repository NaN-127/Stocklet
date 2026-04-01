package middleware

import (
	"context"
	"net/http"
	"os"
	"stocklet-backend/config"
	"stocklet-backend/model"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/v2/bson"
)

type Claims struct {
	ID   string `json:"id"`
	Role string `json:"role"`
	jwt.RegisteredClaims
}

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		secret := os.Getenv("JWT_SECRET")

		if secret == "" {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "JWT secret is not configured"})
			c.Abort()
			return
		}

		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
			c.Abort()
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		claims := &Claims{}

		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return []byte(secret), nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"message": "Token invalid"})
			c.Abort()
			return
		}
		userID, err := bson.ObjectIDFromHex(claims.ID)

		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"message": "Invalid Token",
			})

			c.Abort()
			return

		}

		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		var user model.User

		collection := config.DB.Collection("User_Collection")

		if err := collection.FindOne(ctx, bson.M{"_id": userID}).Decode(&user); err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"message": "User not found"})
			c.Abort()
			return
		}

		c.Set("user", user)
		c.Next()

	}

}
