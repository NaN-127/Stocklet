package handlers

import (
	"context"
	"net/http"
	"strings"
	"time"

	"stocklet-backend/config"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/bson"
)

func AddToWatchList(c *gin.Context) {
	user, ok := getUserFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}

	var input struct {
		Symbol string `json:"symbol" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	symbol := strings.ToUpper(input.Symbol)
	for _, s := range user.WatchList {
		if s == symbol {
			c.JSON(http.StatusBadRequest, gin.H{"message": "Already in watchlist"})
			return
		}
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	collection := config.DB.Collection("User_Collection")
	_, err := collection.UpdateOne(ctx, bson.M{"_id": user.ID}, bson.M{"$push": bson.M{"watchList": symbol}, "$set": bson.M{"updatedAt": time.Now().UTC()}})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Server error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Added", "watchList": append(user.WatchList, symbol)})
}

func RemoveFromWatchList(c *gin.Context) {
	user, ok := getUserFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}

	symbol := strings.ToUpper(c.Param("symbol"))

	found := false
	for _, s := range user.WatchList {
		if s == symbol {
			found = true
			break
		}
	}
	if !found {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Not in watchlist"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	collection := config.DB.Collection("User_Collection")
	_, err := collection.UpdateOne(ctx, bson.M{"_id": user.ID}, bson.M{"$pull": bson.M{"watchList": symbol}, "$set": bson.M{"updatedAt": time.Now().UTC()}})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Server error"})
		return
	}

	updated := make([]string, 0, len(user.WatchList))
	for _, s := range user.WatchList {
		if s != symbol {
			updated = append(updated, s)
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "Removed", "watchList": updated})
}

func GetWatchList(c *gin.Context) {
	user, ok := getUserFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}

	list := user.WatchList
	if list == nil {
		list = []string{}
	}

	c.JSON(http.StatusOK, gin.H{"watchList": list})
}
