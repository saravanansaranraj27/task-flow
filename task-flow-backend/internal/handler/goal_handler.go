package handler

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
	"taskflow/internal/model"
	"taskflow/internal/service"
)

type GoalHandler struct {
	Service *service.GoalService
}

func (h *GoalHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	switch r.Method {
	case http.MethodGet:
		h.GetGoals(w, r)
	case http.MethodPost:
		h.CreateGoal(w, r)
	case http.MethodPut:
		h.UpdateGoal(w, r)
	case http.MethodDelete:
		h.DeleteGoal(w, r)
	default:
		http.Error(w, `{"error":"Method not allowed"}`, http.StatusMethodNotAllowed)
	}
}

func (h *GoalHandler) GetGoals(w http.ResponseWriter, r *http.Request) {
	goals, err := h.Service.GetAll()
	if err != nil {
		http.Error(w, `{"error":"Failed to fetch goals"}`, http.StatusInternalServerError)
		return
	}

	if goals == nil {
		goals = []model.Goal{}
	}

	json.NewEncoder(w).Encode(goals)
}

func (h *GoalHandler) CreateGoal(w http.ResponseWriter, r *http.Request) {
	var goal model.Goal
	if err := json.NewDecoder(r.Body).Decode(&goal); err != nil {
		http.Error(w, `{"error":"Invalid request body"}`, http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	if err := h.Service.Create(&goal); err != nil {
		if err == service.ErrTitleRequired {
			http.Error(w, `{"error":"Title is required"}`, http.StatusBadRequest)
			return
		}
		http.Error(w, `{"error":"Failed to create goal"}`, http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(goal)
}

func (h *GoalHandler) UpdateGoal(w http.ResponseWriter, r *http.Request) {
	var req struct {
		ID         int64  `json:"id"`
		Title      string `json:"title"`
		TargetDate string `json:"target_date"`
		Progress   int    `json:"progress"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"Invalid request body"}`, http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	if req.ID <= 0 {
		http.Error(w, `{"error":"Invalid goal ID"}`, http.StatusBadRequest)
		return
	}

	if strings.TrimSpace(req.Title) == "" && req.TargetDate == "" {
		if err := h.Service.UpdateProgress(req.ID, req.Progress); err != nil {
			h.writeGoalUpdateError(w, err)
			return
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"status": "updated",
			"id":     req.ID,
		})
		return
	}

	req.Title = strings.TrimSpace(req.Title)
	if req.Title == "" {
		http.Error(w, `{"error":"Title is required"}`, http.StatusBadRequest)
		return
	}

	if err := h.Service.Update(req.ID, req.Title, req.TargetDate, req.Progress); err != nil {
		h.writeGoalUpdateError(w, err)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status": "updated",
		"id":     req.ID,
	})
}

func (h *GoalHandler) writeGoalUpdateError(w http.ResponseWriter, err error) {
	if err == sql.ErrNoRows {
		http.Error(w, `{"error":"Goal not found"}`, http.StatusNotFound)
		return
	}
	if err == service.ErrTitleRequired {
		http.Error(w, `{"error":"Title is required"}`, http.StatusBadRequest)
		return
	}
	http.Error(w, `{"error":"Failed to update goal"}`, http.StatusInternalServerError)
}

func (h *GoalHandler) DeleteGoal(w http.ResponseWriter, r *http.Request) {
	idStr := r.URL.Query().Get("id")
	if idStr == "" {
		http.Error(w, `{"error":"Missing goal ID"}`, http.StatusBadRequest)
		return
	}

	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil || id <= 0 {
		http.Error(w, `{"error":"Invalid goal ID"}`, http.StatusBadRequest)
		return
	}

	if err := h.Service.Delete(id); err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, `{"error":"Goal not found"}`, http.StatusNotFound)
			return
		}
		http.Error(w, `{"error":"Failed to delete goal"}`, http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
