package middleware

import (
	"net/http"

	"stocklet-backend/model"

	"github.com/gin-gonic/gin"
)

func AdminMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		userval, exist := c.Get("user")
		if !exist {
			c.JSON(401, gin.H{"message": "user not found"})
			c.Abort()
			return
		}

		user, ok := userval.(model.User)

		if !ok || user.Role != "admin" {
			c.JSON(http.StatusForbidden, gin.H{"message": "Admin only"})
			c.Abort()
			return
		}

		c.Next()

	}
}
