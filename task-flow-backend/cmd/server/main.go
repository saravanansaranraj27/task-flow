package main

import (
	"log"
	"net/http"
	"os"
	"taskflow/internal/config"
	"taskflow/internal/handler"
	"taskflow/internal/middleware"
	"taskflow/internal/repository"
	"taskflow/internal/service"
)

func main() {
	db := config.ConnectDB()
	defer db.Close()

	taskService := service.NewTaskService(repository.NewTaskRepository(db))
	noteService := service.NewNoteService(repository.NewNoteRepository(db))
	goalService := service.NewGoalService(repository.NewGoalRepository(db))
	authService := service.NewAuthService(repository.NewUserRepository(db))

	mux := http.NewServeMux()

	mux.Handle("/api/tasks", middleware.CORS(&handler.TaskHandler{Service: taskService}))
	mux.Handle("/api/notes", middleware.CORS(&handler.NoteHandler{Service: noteService}))
	mux.Handle("/api/goals", middleware.CORS(&handler.GoalHandler{Service: goalService}))
	mux.Handle("/api/auth", middleware.CORS(&handler.AuthHandler{Service: authService}))

	port := os.Getenv("SERVER_PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🚀 TaskFlow API running on http://localhost:%s", port)
	log.Fatal(http.ListenAndServe(":"+port, mux))
}
