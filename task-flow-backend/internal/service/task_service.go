package service

import (
	"strings"
	"taskflow/internal/model"
	"taskflow/internal/repository"
)

type TaskService struct {
	Repo *repository.TaskRepository
}

func NewTaskService(repo *repository.TaskRepository) *TaskService {
	return &TaskService{Repo: repo}
}

func (s *TaskService) GetTasks(status string) ([]model.Task, error) {
	if status != "" {
		return s.Repo.GetByStatus(status)
	}
	return s.Repo.GetAll()
}

func (s *TaskService) Create(task *model.Task) error {
	if strings.TrimSpace(task.Title) == "" {
		return ErrTitleRequired
	}
	if task.Status == "" {
		task.Status = "pending"
	}
	return s.Repo.Create(task)
}

func (s *TaskService) Delete(id int64) error {
	return s.Repo.Delete(id)
}
