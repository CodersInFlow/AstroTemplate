package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/coders-website/backend/internal/database"
	"github.com/coders-website/backend/internal/handlers"
	"github.com/coders-website/backend/internal/middleware"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

func main() {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Connect to MongoDB
	if err := database.Connect(); err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer database.Disconnect()

	// Initialize router
	router := mux.NewRouter()

	// API routes
	api := router.PathPrefix("/api").Subrouter()

	// Public routes
	api.HandleFunc("/version", handlers.GetVersion).Methods("GET")
	api.HandleFunc("/health", handlers.HealthCheck).Methods("GET")
	api.HandleFunc("/auth/login", handlers.Login).Methods("POST")
	api.HandleFunc("/auth/register", handlers.Register).Methods("POST")
	api.HandleFunc("/posts", handlers.GetPosts).Methods("GET")
	api.HandleFunc("/posts/{slug}", handlers.GetPostBySlug).Methods("GET")
	api.HandleFunc("/categories", handlers.GetCategories).Methods("GET")
	
	// Temporarily public for testing
	api.HandleFunc("/social/test", handlers.TestSocialConnectionSimple).Methods("POST")

	// Protected routes
	protected := api.PathPrefix("").Subrouter()
	protected.Use(middleware.AuthMiddleware)

	// Auth routes
	protected.HandleFunc("/auth/logout", handlers.Logout).Methods("POST")
	protected.HandleFunc("/auth/me", handlers.GetMe).Methods("GET")
	protected.HandleFunc("/auth/change-password", handlers.ChangePassword).Methods("POST")

	// Admin routes
	protected.HandleFunc("/posts", handlers.CreatePost).Methods("POST")
	protected.HandleFunc("/posts/id/{id}", handlers.GetPostByID).Methods("GET")
	protected.HandleFunc("/posts/{id}", handlers.UpdatePost).Methods("PUT")
	protected.HandleFunc("/posts/{id}", handlers.DeletePost).Methods("DELETE")
	protected.HandleFunc("/categories", handlers.CreateCategory).Methods("POST")
	protected.HandleFunc("/categories/{id}", handlers.UpdateCategory).Methods("PUT")
	protected.HandleFunc("/categories/{id}", handlers.DeleteCategory).Methods("DELETE")
	protected.HandleFunc("/upload", handlers.UploadFile).Methods("POST")

	// User management
	protected.HandleFunc("/users/{id}", handlers.UpdateUser).Methods("PUT") // Users can update their own profile
	
	// Admin only user management
	admin := protected.PathPrefix("/admin").Subrouter()
	admin.Use(middleware.AdminMiddleware)
	admin.HandleFunc("/users", handlers.GetUsers).Methods("GET")
	admin.HandleFunc("/users/{id}", handlers.GetUserByID).Methods("GET")
	admin.HandleFunc("/users", handlers.CreateUser).Methods("POST")
	admin.HandleFunc("/users/{id}/approve", handlers.ApproveUser).Methods("PUT")
	admin.HandleFunc("/users/{id}/role", handlers.UpdateUserRole).Methods("PUT")
	admin.HandleFunc("/users/{id}", handlers.DeleteUser).Methods("DELETE")

	// Social media routes (temporarily disabled for protected routes)
	// protected.HandleFunc("/social/test", handlers.TestSocialConnection).Methods("POST")
	protected.HandleFunc("/social/credentials", handlers.SaveSocialCredentials).Methods("POST")
	protected.HandleFunc("/social/publish", handlers.PublishToSocialMedia).Methods("POST")

	// Serve uploaded files
	router.PathPrefix("/uploads/").Handler(http.StripPrefix("/uploads/", http.FileServer(http.Dir("./uploads"))))

	// CORS configuration
	corsOrigin := os.Getenv("CORS_ORIGIN")
	if corsOrigin == "" {
		corsOrigin = "http://127.0.0.1:4321"
	}
	log.Printf("CORS Origin: %s", corsOrigin)
	
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{corsOrigin, "http://127.0.0.1:4321", "http://localhost:4321"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization", "Cookie"},
		AllowCredentials: true,
		MaxAge:           300,
	})

	handler := c.Handler(router)

	// Server configuration
	port := os.Getenv("PORT")
	if port == "" {
		port = "8749"
	}
	
	srv := &http.Server{
		Handler:      handler,
		Addr:         ":" + port,
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	log.Printf("Server starting on port %s...", port)
	log.Fatal(srv.ListenAndServe())
}