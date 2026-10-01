package model

type Goal struct {
	ID         int64  `json:"id"`
	Title      string `json:"title"`
	TargetDate string `json:"target_date"`
	Progress   int    `json:"progress"`
	CreatedAt  string `json:"created_at"`
}
