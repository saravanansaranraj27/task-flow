package repository

import (
	"database/sql"
	"taskflow/internal/model"
)

type TaskRepository struct {
	DB *sql.DB
}

func NewTaskRepository(db *sql.DB) *TaskRepository {
	return &TaskRepository{DB: db}
}

func (r *TaskRepository) GetAll() ([]model.Task, error) {
	rows, err := r.DB.Query(`
		SELECT id, title, description, status, created_at
		FROM tasks
		ORDER BY created_at DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tasks []model.Task
	for rows.Next() {
		var task model.Task
		if err := rows.Scan(&task.ID, &task.Title, &task.Description, &task.Status, &task.CreatedAt); err != nil {
			return nil, err
		}
		tasks = append(tasks, task)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}
	return tasks, nil
}

func (r *TaskRepository) GetByStatus(status string) ([]model.Task, error) {
	rows, err := r.DB.Query(`
		SELECT id, title, description, status, created_at
		FROM tasks
		WHERE status = ?
		ORDER BY created_at DESC
	`, status)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tasks []model.Task
	for rows.Next() {
		var task model.Task
		if err := rows.Scan(&task.ID, &task.Title, &task.Description, &task.Status, &task.CreatedAt); err != nil {
			return nil, err
		}
		tasks = append(tasks, task)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}
	return tasks, nil
}

func (r *TaskRepository) Create(task *model.Task) error {
	result, err := r.DB.Exec(
		`INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)`,
		task.Title, task.Description, task.Status,
	)
	if err != nil {
		return err
	}

	task.ID, err = result.LastInsertId()
	return err
}

func (r *TaskRepository) Delete(id int64) error {
	result, err := r.DB.Exec(`DELETE FROM tasks WHERE id = ?`, id)
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
