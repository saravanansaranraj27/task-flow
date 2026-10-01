package model

type Note struct {
	ID        int64  `json:"id"`
	Title     string `json:"title"`
	Content   string `json:"content"`
	Color     string `json:"color"`
	CreatedAt string `json:"created_at"`
}
