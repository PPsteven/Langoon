package handlers

import (
	"encoding/json"
	"github.com/gin-gonic/gin"
	"go-server-template/internal/db"
	"go-server-template/internal/model"
	"go-server-template/internal/transcript"
	"go-server-template/server/common"
	"strconv"
)

type GetMediaResp struct {

}

func GetMedia(c *gin.Context) {
	MID, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		common.ErrorResp(c, err.Error())
		return
	}
	media, err := db.GetMediaByMID(uint(MID))
	if err != nil {
		common.ErrorResp(c, err.Error())
		return
	}

	common.SuccessResp(c, media)
}

type PostMediaReq struct {
	MID           uint      `json:"mid" gorm:"primaryKey;column:mid"`
	Url           string    `json:"url"`
	TranscriptUrl string    `json:"transcript_url"`
	Title         string    `json:"title"`
	CoverImg      string    `json:"cover_img"`
	Des           string    `json:"des"`
	Tag           string    `json:"tag"`
	Type          string    `json:"type"`
}

func PostMedia(c *gin.Context) {
	var req PostMediaReq
	if err := c.ShouldBindJSON(&req); err != nil {
		common.ErrorResp(c, err.Error())
		return
	}
	media, err := db.CreateMedia(&model.Media{
		MID:           req.MID,
		Url:           req.Url,
		TranscriptUrl: req.TranscriptUrl,
		Title:         req.Title,
		CoverImg:      req.CoverImg,
		Des:           req.Des,
		Tag:           req.Tag,
		Type:          model.MediaType(req.Type),
	})
	if err != nil {
		common.ErrorResp(c, err.Error())
		return
	}

	lines, err := transcript.Convert(req.TranscriptUrl)
	if err != nil {
		common.ErrorResp(c, err.Error())
		return
	}

	b, _ := json.Marshal(lines)
	_, err = db.CreateTranscript(&model.Transcript{
		MID:            media.MID,
		SourceLangCode: model.En,
		TargetLangCode: model.ZhCN,
		Content:        string(b),
	})

	common.SuccessResp(c, nil)
}