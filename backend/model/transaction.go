package model

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

type Transaction struct {
	ID        bson.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	User      bson.ObjectID `bson:"user"          json:"user"`
	Symbol    string        `bson:"symbol"        json:"symbol"`
	Type      string        `bson:"type"          json:"type"`
	Quantity  float64       `bson:"quantity"      json:"quantity"`
	Price     float64       `bson:"price"         json:"price"`
	Status    string        `bson:"status"        json:"status"`
	CreatedAt time.Time     `bson:"createdAt,omitempty" json:"createdAt,omitempty"`
	UpdatedAt time.Time     `bson:"updatedAt,omitempty" json:"updatedAt,omitempty"`
}

type CreateTransactionInput struct {
	Symbol   string  `json:"symbol"   binding:"required"`
	Type     string  `json:"type"     binding:"required,oneof=BUY SELL"`
	Quantity float64 `json:"quantity" binding:"required,gt=0"`
	Price    float64 `json:"price"    binding:"required,gt=0"`
}
