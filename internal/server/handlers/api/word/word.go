package word

import (
	"github.com/gin-gonic/gin"
	"go-server-template/internal/model"
	"go-server-template/internal/openai"
	"go-server-template/internal/server/errcode"
	"go-server-template/internal/server/response"
	"go-server-template/internal/service"
)

var _ Handler = (*handler)(nil)

type Handler interface {
	GetWord(c *gin.Context)

	i()
}

type handler struct {
}

func New(s service.Service) Handler {
	return &handler{}
}

type WordReq struct {
	SourceLangCode model.LanguageCode `json:"source_lang_code"`
	TargetLangCode model.LanguageCode `json:"target_lang_code"`
	Sentence       string             `json:"sentence"`
}

func (h *handler) GetWord(c *gin.Context) {
	word := c.Param("word")
	if word == "" {
		response.Error(c, errcode.ErrParams.WithDetail("empty word"))
	}

	var req WordReq
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, errcode.ErrParams.WithError(err))
		return
	}

	w, err := openai.GetWord(word, req.Sentence, string(req.SourceLangCode), string(req.TargetLangCode))
	if err != nil {
		response.Error(c, errcode.ErrGetWordDict.WithError(err))
		return
	}

	response.Success(c, w)
}

func (h *handler) i() {}
