package server

import (
	"github.com/gin-gonic/gin"
	"go-server-template/server/handlers"
)


func Init(e *gin.Engine) {
	{
		api := e.Group("/api")
		{
			api.GET("/user/:id", handlers.GetUserByID)
			api.POST("/translate", handlers.PostTranslate)
			api.GET("/media/:id", handlers.GetMedia)
		}
	}
}
