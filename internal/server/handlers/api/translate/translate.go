package translate

import (
	"github.com/gin-gonic/gin"
	"go-server-template/internal/model"
	"go-server-template/internal/server/errcode"
	"go-server-template/internal/server/response"
	"go-server-template/internal/service"
	"go-server-template/internal/translator"
)

var _ Handler = (*handler)(nil)

type Handler interface {
	Translate(c *gin.Context)

	i()
}

type handler struct {
}

func New(s service.Service) Handler {
	return &handler{}
}

type TranslateReq struct {
	SourceLangCode model.LanguageCode `json:"source_lang_code"`
	TargetLangCode model.LanguageCode `json:"target_lang_code"`
	Texts          []string           `json:"texts"`
}

type TranslateResp struct {
	Texts []string `json:"texts"`
}

func (h *handler) Translate(c *gin.Context) {
	var req TranslateReq
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, errcode.ErrParams)
		return
	}

	if len(req.Texts) == 0 {
		response.Error(c, errcode.ErrParams.WithDetail("empty text"))
		return
	}

	e := translator.New().SetLang(req.SourceLangCode, req.TargetLangCode)
	var tranlates []string
	for _, text := range req.Texts {
		transText, err := e.Translate(text)
		if err != nil {
			response.Error(c, errcode.ErrTranslateFailed.WithDetail("source lang %s, target lang %s, err %v", req.SourceLangCode, req.TargetLangCode, err))
			return
		}
		tranlates = append(tranlates, transText)
	}

	response.Success(c, &TranslateResp{Texts: tranlates})
}

func (h *handler) i() {}
