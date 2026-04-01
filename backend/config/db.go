package config

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

var DB *mongo.Database

func ConnectDB() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	mongoURI := os.Getenv("MONGO_URI")
	if mongoURI == "" {
		log.Fatal("MONGO_URI is not set")
	}

	dbName := os.Getenv("MONGO_DB_NAME")
	if dbName == "" {
		dbName = "stocklet"
	}

	client, err := mongo.Connect(options.Client().ApplyURI(mongoURI))

	if err != nil {
		log.Fatal("MongoDb connection failed: ", err)
	}

	if err = client.Ping(ctx, nil); err != nil {
		log.Fatal("MongoDB ping failed: ", err)
	}

	DB = client.Database(dbName)
	log.Println(fmt.Sprintf("MongoDB connected to database %q", dbName))
}
