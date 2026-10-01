package handler

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"
	"taskflow/internal/model"
	"taskflow/internal/service"
)

type TaskHandler struct {
	Service *service.TaskService
}

func (h *TaskHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	switch r.Method {
	case http.MethodGet:
		h.GetTasks(w, r)
	case http.MethodPost:
		h.CreateTask(w, r)
	case http.MethodDelete:
		h.DeleteTask(w, r)
	case http.MethodOptions:
		w.WriteHeader(http.StatusOK)
	default:
		http.Error(w, `{"error":"Method not allowed"}`, http.StatusMethodNotAllowed)
	}
}

func (h *TaskHandler) GetTasks(w http.ResponseWriter, r *http.Request) {
	tasks, err := h.Service.GetTasks(r.URL.Query().Get("status"))
	if err != nil {
		http.Error(w, `{"error":"Failed to fetch tasks"}`, http.StatusInternalServerError)
		return
	}

	if tasks == nil {
		tasks = []model.Task{}
	}

	json.NewEncoder(w).Encode(tasks)
}

func (h *TaskHandler) CreateTask(w http.ResponseWriter, r *http.Request) {
	var task model.Task
	if err := json.NewDecoder(r.Body).Decode(&task); err != nil {
		http.Error(w, `{"error":"Invalid request body"}`, http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	if err := h.Service.Create(&task); err != nil {
		if err == service.ErrTitleRequired {
			http.Error(w, `{"error":"Title is required"}`, http.StatusBadRequest)
			return
		}
		http.Error(w, `{"error":"Failed to create task"}`, http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(task)
}

func (h *TaskHandler) DeleteTask(w http.ResponseWriter, r *http.Request) {
	idStr := r.URL.Query().Get("id")
	if idStr == "" {
		http.Error(w, `{"error":"Missing task ID"}`, http.StatusBadRequest)
		return
	}

	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		http.Error(w, `{"error":"Invalid task ID"}`, http.StatusBadRequest)
		return
	}

	if err := h.Service.Delete(id); err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, `{"error":"Task not found"}`, http.StatusNotFound)
			return
		}
		http.Error(w, `{"error":"Failed to delete task"}`, http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
