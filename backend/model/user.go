package model

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

type User struct {
	ID        bson.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	Name      string        `bson:"name"          json:"name"`
	Email     string        `bson:"email"         json:"email"`
	Password  string        `bson:"password"      json:"-"`
	Role      string        `bson:"role"          json:"role"`
	WatchList []string      `bson:"watchList"     json:"watchList"`
	CreatedAt time.Time     `bson:"createdAt,omitempty" json:"createdAt,omitempty"`
	UpdatedAt time.Time     `bson:"updatedAt,omitempty" json:"updatedAt,omitempty"`
}

type RegisterInput struct {
	Name     string `json:"name"     binding:"required"`
	Email    string `json:"email"    binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

type LoginInput struct {
	Email    string `json:"email"    binding:"required"`
	Password string `json:"password" binding:"required"`
}
