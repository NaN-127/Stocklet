package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"math"
	"math/rand"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

type stockQuoteResponse struct {
	C  float64 `json:"c"`
	H  float64 `json:"h"`
	L  float64 `json:"l"`
	PC float64 `json:"pc"`
	DP float64 `json:"dp"`
}

func GetStockBySymbol(c *gin.Context) {
	symbol := strings.ToUpper(c.Param("symbol"))
	url := fmt.Sprintf("https://finnhub.io/api/v1/quote?symbol=%s&token=%s", symbol, os.Getenv("STOCK_API_KEY"))

	resp, err := http.Get(url)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "API error"})
		return
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error reading response"})
		return
	}

	var data stockQuoteResponse
	if err := json.Unmarshal(body, &data); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error parsing data"})
		return
	}

	if data.C == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "Stock not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"symbol":        symbol,
		"price":         data.C,
		"high":          data.H,
		"low":           data.L,
		"previousClose": data.PC,
		"changePercent": data.DP,
	})
}

func GetHistoricalData(c *gin.Context) {
	symbol := strings.ToUpper(c.Param("symbol"))
	days, err := strconv.Atoi(c.DefaultQuery("days", "30"))
	if err != nil || days <= 0 {
		days = 30
	}

	url := fmt.Sprintf("https://finnhub.io/api/v1/quote?symbol=%s&token=%s", symbol, os.Getenv("STOCK_API_KEY"))
	resp, err := http.Get(url)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "API error"})
		return
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	var quote stockQuoteResponse
	_ = json.Unmarshal(body, &quote)

	current := quote.C
	if current == 0 {
		current = 150
	}

	type historyPoint struct {
		Date  string  `json:"date"`
		Price float64 `json:"price"`
	}

	rng := rand.New(rand.NewSource(time.Now().UnixNano()))
	history := make([]historyPoint, 0, days+1)
	virtual := current * (1 - (rng.Float64()*0.1 - 0.05))

	for i := days; i >= 0; i-- {
		date := time.Now().AddDate(0, 0, -i).Format("2006-01-02")

		if i == 0 {
			virtual = current
		} else {
			virtual += virtual * (rng.Float64()*0.04 - 0.02)
		}

		history = append(history, historyPoint{Date: date, Price: math.Round(virtual*100) / 100})
	}

	c.JSON(http.StatusOK, gin.H{"symbol": symbol, "history": history})
}
