package handlers

import (
	"context"
	"net/http"
	"time"

	"stocklet-backend/config"
	"stocklet-backend/model"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

func GetAllUsers(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	collection := config.DB.Collection("User_Collection")
	opts := options.Find().
		SetProjection(bson.M{"password": 0}).
		SetSort(bson.D{{Key: "createdAt", Value: -1}})

	cursor, err := collection.Find(ctx, bson.M{}, opts)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to fetch users"})
		return
	}
	defer cursor.Close(ctx)

	var users []model.User
	if err := cursor.All(ctx, &users); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error reading users"})
		return
	}
	if users == nil {
		users = []model.User{}
	}

	c.JSON(http.StatusOK, gin.H{"users": users})
}

func DeleteUser(c *gin.Context) {
	id, err := bson.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid user ID"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	collection := config.DB.Collection("User_Collection")

	var user model.User
	if err := collection.FindOne(ctx, bson.M{"_id": id}).Decode(&user); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "User not found"})
		return
	}
	if user.Role == "admin" {
		c.JSON(http.StatusForbidden, gin.H{"message": "Cannot delete admin"})
		return
	}

	if _, err := collection.DeleteOne(ctx, bson.M{"_id": id}); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to delete"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User deleted"})
}
