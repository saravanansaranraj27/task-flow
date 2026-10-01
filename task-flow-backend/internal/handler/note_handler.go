package handler

import (
	"encoding/json"
	"net/http"
	"strconv"
	"taskflow/internal/model"
	"taskflow/internal/service"
)

type NoteHandler struct {
	Service *service.NoteService
}

func (h *NoteHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	switch r.Method {
	case http.MethodGet:
		h.GetNotes(w, r)
	case http.MethodPost:
		h.CreateNote(w, r)
	case http.MethodDelete:
		h.DeleteNote(w, r)
	default:
		http.Error(w, `{"error":"Method not allowed"}`, http.StatusMethodNotAllowed)
	}
}

func (h *NoteHandler) GetNotes(w http.ResponseWriter, r *http.Request) {
	notes, err := h.Service.GetAll()
	if err != nil {
		http.Error(w, `{"error":"Failed to fetch notes"}`, http.StatusInternalServerError)
		return
	}

	if notes == nil {
		notes = []model.Note{}
	}

	json.NewEncoder(w).Encode(notes)
}

func (h *NoteHandler) CreateNote(w http.ResponseWriter, r *http.Request) {
	var note model.Note
	if err := json.NewDecoder(r.Body).Decode(&note); err != nil {
		http.Error(w, `{"error":"Invalid request body"}`, http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	if err := h.Service.Create(&note); err != nil {
		if err == service.ErrTitleRequired {
			http.Error(w, `{"error":"Title is required"}`, http.StatusBadRequest)
			return
		}
		http.Error(w, `{"error":"Failed to create note"}`, http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(note)
}

func (h *NoteHandler) DeleteNote(w http.ResponseWriter, r *http.Request) {
	idStr := r.URL.Query().Get("id")
	if idStr == "" {
		http.Error(w, `{"error":"Missing note ID"}`, http.StatusBadRequest)
		return
	}

	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		http.Error(w, `{"error":"Invalid note ID"}`, http.StatusBadRequest)
		return
	}

	if err := h.Service.Delete(id); err != nil {
		http.Error(w, `{"error":"Failed to delete note"}`, http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
