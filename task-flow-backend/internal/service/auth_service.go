package service

import (
	"strings"
	"taskflow/internal/model"
	"taskflow/internal/repository"
)

type AuthService struct {
	Repo *repository.UserRepository
}

func NewAuthService(repo *repository.UserRepository) *AuthService {
	return &AuthService{Repo: repo}
}

func (s *AuthService) Register(name, email, password string) (*model.User, error) {
	name = strings.TrimSpace(name)
	email = strings.TrimSpace(email)
	password = strings.TrimSpace(password)

	if name == "" || email == "" || password == "" {
		return nil, ErrRegistrationFieldsRequired
	}
	if len(password) < 6 {
		return nil, ErrPasswordTooShort
	}

	return s.Repo.Create(name, email, password)
}

func (s *AuthService) Login(email, password string) (*model.User, error) {
	return s.Repo.Validate(email, password)
}
