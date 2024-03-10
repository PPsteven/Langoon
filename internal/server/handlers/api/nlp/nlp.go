package nlp

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"go-server-template/internal/model"
	"go-server-template/internal/nlp"
	"go-server-template/internal/server/errcode"
	"go-server-template/internal/server/response"
	"go-server-template/internal/service"
)

var _ Handler = (*handler)(nil)

type Handler interface {
	GetSentences(c *gin.Context)

	Tokenize(c *gin.Context)

	i()
}

type handler struct{}

func New(s service.Service) Handler { return &handler{} }

type GetSentencesReq struct {
	SourceLangCode model.LanguageCode `json:"source_lang_code"`
	Text           string             `json:"text"`
}

type TokenizeReq struct {
	SourceLangCode model.LanguageCode `json:"source_lang_code"`
	Text           []string           `json:"text"`
}

func (h *handler) GetSentences(c *gin.Context) {
	var req GetSentencesReq
	if err := c.ShouldBindJSON(&req); err != nil {
		fmt.Println(err)
		response.Error(c, errcode.ErrParams)
		return
	}

	sents, err := nlp.Sentences(req.SourceLangCode, req.Text)
	if err != nil {
		response.Error(c, errcode.ErrSentences.WithError(err))
		return
	}

	response.Success(c, sents)
}

func (h *handler) Tokenize(c *gin.Context) {
	var req TokenizeReq
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, errcode.ErrParams)
		return
	}

	tokens, err := nlp.Tokenize(req.SourceLangCode, req.Text)
	if err != nil {
		response.Error(c, errcode.ErrTokenize.WithError(err))
		return
	}

	response.Success(c, tokens)
}

func (h *handler) i() {}
