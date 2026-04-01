package handlers

import (
	"context"
	"net/http"
	"strings"
	"time"

	"stocklet-backend/config"
	"stocklet-backend/model"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/bson"
)

func getUserFromContext(c *gin.Context) (model.User, bool) {
	userVal, ok := c.Get("user")
	if !ok {
		return model.User{}, false
	}
	user, ok := userVal.(model.User)
	return user, ok
}

func CreateTransaction(c *gin.Context) {
	user, ok := getUserFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}

	var input model.CreateTransactionInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	tx := model.Transaction{
		ID:        bson.NewObjectID(),
		User:      user.ID,
		Symbol:    strings.ToUpper(input.Symbol),
		Type:      input.Type,
		Quantity:  input.Quantity,
		Price:     input.Price,
		Status:    "PENDING",
		CreatedAt: time.Now().UTC(),
		UpdatedAt: time.Now().UTC(),
	}

	collection := config.DB.Collection("transactions")
	_, err := collection.InsertOne(ctx, tx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Server error: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Transaction created", "transaction": tx})
}

func GetMyTransactions(c *gin.Context) {
	user, ok := getUserFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	collection := config.DB.Collection("transactions")
	cursor, err := collection.Find(ctx, bson.M{"user": user.ID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Server error"})
		return
	}
	defer cursor.Close(ctx)

	var transactions []model.Transaction
	if err = cursor.All(ctx, &transactions); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error reading data"})
		return
	}
	if transactions == nil {
		transactions = []model.Transaction{}
	}

	c.JSON(http.StatusOK, gin.H{"transactions": transactions})
}

func GetAllTransactions(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	collection := config.DB.Collection("transactions")
	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Server error"})
		return
	}
	defer cursor.Close(ctx)

	var transactions []model.Transaction
	if err = cursor.All(ctx, &transactions); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error reading data"})
		return
	}
	if transactions == nil {
		transactions = []model.Transaction{}
	}

	c.JSON(http.StatusOK, gin.H{"transactions": transactions})
}

func ApproveTransaction(c *gin.Context) {
	id, err := bson.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid ID"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	collection := config.DB.Collection("transactions")
	res, err := collection.UpdateOne(ctx, bson.M{"_id": id}, bson.M{"$set": bson.M{"status": "COMPLETED", "updatedAt": time.Now().UTC()}})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Server error"})
		return
	}
	if res.MatchedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "Transaction not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Transaction approved"})
}

func RejectTransaction(c *gin.Context) {
	id, err := bson.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid ID"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	collection := config.DB.Collection("transactions")
	res, err := collection.UpdateOne(ctx, bson.M{"_id": id}, bson.M{"$set": bson.M{"status": "CANCELLED", "updatedAt": time.Now().UTC()}})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Server error"})
		return
	}
	if res.MatchedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "Transaction not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Transaction rejected"})
}
