package handlers

import (
	"go-server-template/internal/server/handlers/api/translate"
	"go-server-template/internal/server/handlers/api/user"
	"go-server-template/internal/service"
)

func User() user.Handler {
	return user.New(service.Get())
}

func Translate() translate.Handler {
	return translate.New(service.Get())
}
