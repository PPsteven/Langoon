package handlers

import (
	"go-server-template/internal/server/handlers/api/nlp"
	"go-server-template/internal/server/handlers/api/translate"
	"go-server-template/internal/server/handlers/api/user"
	"go-server-template/internal/server/handlers/api/word"
	"go-server-template/internal/service"
)

func User() user.Handler {
	return user.New(service.Get())
}

func Translate() translate.Handler {
	return translate.New(service.Get())
}

func NLP() nlp.Handler {
	return nlp.New(service.Get())
}

func Word() word.Handler {
	return word.New(service.Get())
}
