package repository

import (
	"database/sql"
	"taskflow/internal/model"
)

type UserRepository struct {
	DB *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{DB: db}
}

func (r *UserRepository) Create(name, email, password string) (*model.User, error) {
	result, err := r.DB.Exec(
		`INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
		name, email, password,
	)
	if err != nil {
		return nil, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return nil, err
	}

	return &model.User{ID: id, Name: name, Email: email}, nil
}

func (r *UserRepository) Validate(email, password string) (*model.User, error) {
	var user model.User
	err := r.DB.QueryRow(
		`SELECT id, email, name FROM users WHERE email = ? AND password = ?`,
		email, password,
	).Scan(&user.ID, &user.Email, &user.Name)
	if err != nil {
		return nil, err
	}
	return &user, nil
}
