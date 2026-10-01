package handler

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strings"
	"taskflow/internal/service"
)

type AuthHandler struct {
	Service *service.AuthService
}

func (h *AuthHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodPost {
		http.Error(w, `{"error":"Method not allowed"}`, http.StatusMethodNotAllowed)
		return
	}

	switch r.URL.Query().Get("action") {
	case "register":
		h.Register(w, r)
	case "login":
		h.Login(w, r)
	default:
		http.Error(w, `{"error":"Invalid action. Use ?action=login or ?action=register"}`, http.StatusBadRequest)
	}
}

func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Name     string `json:"name"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"Invalid request body"}`, http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	user, err := h.Service.Register(req.Name, req.Email, req.Password)
	if err != nil {
		switch err {
		case service.ErrRegistrationFieldsRequired:
			http.Error(w, `{"error":"Name, email, and password are required"}`, http.StatusBadRequest)
		case service.ErrPasswordTooShort:
			http.Error(w, `{"error":"Password must be at least 6 characters"}`, http.StatusBadRequest)
		default:
			if strings.Contains(err.Error(), "Duplicate") {
				http.Error(w, `{"error":"Email already registered"}`, http.StatusConflict)
			} else {
				http.Error(w, `{"error":"Failed to create account"}`, http.StatusInternalServerError)
			}
		}
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(user)
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var creds struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
		http.Error(w, `{"error":"Invalid request"}`, http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	user, err := h.Service.Login(creds.Email, creds.Password)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, `{"error":"Invalid email or password"}`, http.StatusUnauthorized)
		} else {
			http.Error(w, `{"error":"Server error"}`, http.StatusInternalServerError)
		}
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(user)
}
