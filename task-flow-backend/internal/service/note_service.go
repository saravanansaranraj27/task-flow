package service

import (
	"strings"
	"taskflow/internal/model"
	"taskflow/internal/repository"
)

type NoteService struct {
	Repo *repository.NoteRepository
}

func NewNoteService(repo *repository.NoteRepository) *NoteService {
	return &NoteService{Repo: repo}
}

func (s *NoteService) GetAll() ([]model.Note, error) {
	return s.Repo.GetAll()
}

func (s *NoteService) Create(note *model.Note) error {
	if strings.TrimSpace(note.Title) == "" {
		return ErrTitleRequired
	}
	return s.Repo.Create(note)
}

func (s *NoteService) Delete(id int64) error {
	return s.Repo.Delete(id)
}
