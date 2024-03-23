package bootstrap

import (
	"go-server-template/internal/db"
	"go-server-template/internal/openai"
	"go-server-template/internal/service"
	"go-server-template/pkg/http"
)

func Init() {
	InitLog()
	InitDB()

	http.InitClient()
	service.Init(db.GetDB())
	openai.Init()
}
