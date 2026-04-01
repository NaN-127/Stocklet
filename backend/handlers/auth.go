package handlers

import (
	"context"
	"net/http"
	"os"
	"time"

	"stocklet-backend/config"
	"stocklet-backend/middleware"
	"stocklet-backend/model"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"golang.org/x/crypto/bcrypt"
)

func generateToken(user model.User) (string, error) {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		return "", os.ErrNotExist
	}

	claims := middleware.Claims{
		ID:   user.ID.Hex(),
		Role: user.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(10 * 24 * time.Hour)),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString([]byte(secret))
}

func Register(c *gin.Context) {

	var input model.RegisterInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	collection := config.DB.Collection("User_Collection")

	var existing model.User

	err := collection.FindOne(ctx, bson.M{"email": input.Email}).Decode(&existing)

	if err == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "User already exists",
		})
		return
	}

	if err != mongo.ErrNoDocuments {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Database error",
		})
		return
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Error hashing password",
		})
		return
	}

	newUser := model.User{
		ID:        bson.NewObjectID(),
		Name:      input.Name,
		Email:     input.Email,
		Password:  string(hashed),
		Role:      "user",
		WatchList: []string{},
		CreatedAt: time.Now().UTC(),
		UpdatedAt: time.Now().UTC(),
	}

	_, err = collection.InsertOne(ctx, newUser)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Server error: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "User created",
		"_id":     newUser.ID,
		"name":    newUser.Name,
		"email":   newUser.Email,
		"role":    newUser.Role,
	})
}

func Login(c *gin.Context) {

	var input model.LoginInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	collection := config.DB.Collection("User_Collection")

	var user model.User

	err := collection.FindOne(ctx, bson.M{"email": input.Email}).Decode(&user)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid credentials",
		})
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password))

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid credentials",
		})
		return
	}

	token, err := generateToken(user)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Error generating token",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Login successful",
		"_id":     user.ID,
		"name":    user.Name,
		"email":   user.Email,
		"role":    user.Role,
		"token":   token,
	})
}
