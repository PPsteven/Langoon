package translator

import (
	"errors"
	"go-server-template/internal/model"
)

type Translator interface {
	Translate(sourceLang, targetLang LanguageCode, text string) (string, error)
}

type Engine struct {
	Translator

	SourceLang model.LanguageCode
	TargetLang model.LanguageCode
}

var DefaultTranslator = &GoogleTranslator{}

func New() *Engine {
	return &Engine{
		Translator: DefaultTranslator,
	}
}

func (e *Engine) SetLang(sl, tl LanguageCode) *Engine {
	e.SourceLang, e.TargetLang = sl, tl
	return e
}

func (e *Engine) Translate(text string) (string, error) {
	if e.SourceLang == "" || e.TargetLang == "" {
		return "", errors.New("sourcelang or targertlang not setted")
	}
	return e.Translator.Translate(e.SourceLang, e.TargetLang, text)
}