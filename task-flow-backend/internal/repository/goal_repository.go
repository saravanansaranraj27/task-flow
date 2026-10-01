package repository

import (
	"database/sql"
	"taskflow/internal/model"
)

type GoalRepository struct {
	DB *sql.DB
}

func NewGoalRepository(db *sql.DB) *GoalRepository {
	return &GoalRepository{DB: db}
}

func (r *GoalRepository) GetAll() ([]model.Goal, error) {
	rows, err := r.DB.Query(`
		SELECT id, title, target_date, progress, created_at
		FROM goals
		ORDER BY target_date ASC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var goals []model.Goal
	for rows.Next() {
		var goal model.Goal
		if err := rows.Scan(&goal.ID, &goal.Title, &goal.TargetDate, &goal.Progress, &goal.CreatedAt); err != nil {
			return nil, err
		}
		goals = append(goals, goal)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}
	return goals, nil
}

func (r *GoalRepository) Create(goal *model.Goal) error {
	result, err := r.DB.Exec(`
		INSERT INTO goals (title, target_date, progress)
		VALUES (?, ?, ?)
	`, goal.Title, goal.TargetDate, goal.Progress)
	if err != nil {
		return err
	}

	goal.ID, err = result.LastInsertId()
	return err
}

func (r *GoalRepository) Update(id int64, title, targetDate string, progress int) error {
	result, err := r.DB.Exec(`
		UPDATE goals
		SET title = ?, target_date = ?, progress = ?
		WHERE id = ?
	`, title, targetDate, progress, id)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rowsAffected == 0 {
		return sql.ErrNoRows
	}
	return nil
}

func (r *GoalRepository) UpdateProgress(id int64, progress int) error {
	result, err := r.DB.Exec(`
		UPDATE goals
		SET progress = ?
		WHERE id = ?
	`, progress, id)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rowsAffected == 0 {
		return sql.ErrNoRows
	}
	return nil
}

func (r *GoalRepository) Delete(id int64) error {
	result, err := r.DB.Exec(`DELETE FROM goals WHERE id = ?`, id)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rowsAffected == 0 {
		return sql.ErrNoRows
	}
	return nil
}
