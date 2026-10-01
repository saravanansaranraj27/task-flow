package service

import (
	"strings"
	"taskflow/internal/model"
	"taskflow/internal/repository"
)

type GoalService struct {
	Repo *repository.GoalRepository
}

func NewGoalService(repo *repository.GoalRepository) *GoalService {
	return &GoalService{Repo: repo}
}

func (s *GoalService) GetAll() ([]model.Goal, error) {
	return s.Repo.GetAll()
}

func (s *GoalService) Create(goal *model.Goal) error {
	goal.Title = strings.TrimSpace(goal.Title)
	if goal.Title == "" {
		return ErrTitleRequired
	}
	normalizeProgress(&goal.Progress)
	return s.Repo.Create(goal)
}

func (s *GoalService) Update(id int64, title, targetDate string, progress int) error {
	title = strings.TrimSpace(title)
	if title == "" {
		return ErrTitleRequired
	}
	normalizeProgress(&progress)
	return s.Repo.Update(id, title, targetDate, progress)
}

func (s *GoalService) UpdateProgress(id int64, progress int) error {
	normalizeProgress(&progress)
	return s.Repo.UpdateProgress(id, progress)
}

func (s *GoalService) Delete(id int64) error {
	return s.Repo.Delete(id)
}

func normalizeProgress(progress *int) {
	if *progress < 0 {
		*progress = 0
	}
	if *progress > 100 {
		*progress = 100
	}
}
