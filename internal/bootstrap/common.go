package bootstrap

import "go-server-template/pkg/http"

func Init() {
	InitDB()
	InitLog()
	http.InitClient()
}
