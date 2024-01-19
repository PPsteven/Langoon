package handlers

import (
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	"go-server-template/internal/model"
	"go-server-template/internal/translator"
	"go-server-template/server/common"
)

type TranslateReq struct {
	SourceLangCode model.LanguageCode `json:"source_lang_code"`
	TargetLangCode model.LanguageCode `json:"target_lang_code"`
	Texts          []string           `json:"texts"`
}

type TranslateResp struct {
	Texts []string `json:"texts"`
}

func PostTranslate(c *gin.Context) {
	var req TranslateReq
	if err := c.ShouldBindJSON(&req); err != nil {
		common.ErrorResp(c, err.Error())
		return
	}
	if len(req.Texts) == 0 {
		common.ErrorResp(c, "empty text")
		return
	}
	e := translator.New().SetLang(req.SourceLangCode, req.TargetLangCode)
	var tranlates []string
	for _, text := range req.Texts {
		transText, err := e.Translate(text)
		if err != nil {
			logrus.Errorf("translate err, source lang %s, target lang %s, err %v", req.SourceLangCode, req.TargetLangCode, err)
			common.ErrorResp(c, common.InternalErr)
			return
		}
		tranlates = append(tranlates, transText)
	}
	common.SuccessResp(c, &TranslateResp{
		Texts: tranlates,
	})
}