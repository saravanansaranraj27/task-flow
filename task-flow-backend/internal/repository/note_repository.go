package repository

import (
	"database/sql"
	"taskflow/internal/model"
)

type NoteRepository struct {
	DB *sql.DB
}

func NewNoteRepository(db *sql.DB) *NoteRepository {
	return &NoteRepository{DB: db}
}

func (r *NoteRepository) GetAll() ([]model.Note, error) {
	rows, err := r.DB.Query(`
		SELECT id, title, content, color, created_at
		FROM notes
		ORDER BY created_at DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var notes []model.Note
	for rows.Next() {
		var note model.Note
		if err := rows.Scan(&note.ID, &note.Title, &note.Content, &note.Color, &note.CreatedAt); err != nil {
			return nil, err
		}
		notes = append(notes, note)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}
	return notes, nil
}

func (r *NoteRepository) Create(note *model.Note) error {
	result, err := r.DB.Exec(
		`INSERT INTO notes (title, content, color) VALUES (?, ?, ?)`,
		note.Title, note.Content, note.Color,
	)
	if err != nil {
		return err
	}

	note.ID, err = result.LastInsertId()
	return err
}

func (r *NoteRepository) Delete(id int64) error {
	_, err := r.DB.Exec(`DELETE FROM notes WHERE id = ?`, id)
	return err
}
