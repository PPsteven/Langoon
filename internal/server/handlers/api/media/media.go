package media

import (
	"encoding/json"
	"github.com/gin-gonic/gin"
	"go-server-template/internal/db"
	"go-server-template/internal/model"
	"go-server-template/internal/server/errcode"
	"go-server-template/internal/server/response"
	"go-server-template/internal/service"
	"go-server-template/pkg/transcript"
	"strconv"
)

var _ Handler = (*handler)(nil)

type Handler interface {
	GetMedia(c *gin.Context)

	PostMedia(c *gin.Context)

	i()
}

type handler struct {
}

func New(s service.Service) Handler {
	return &handler{}
}

func (h *handler) GetMedia(c *gin.Context) {
	MID, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.Error(c, errcode.ErrParams.WithDetail("id must be a number"))
		return
	}
	media, err := db.GetMediaByMID(uint(MID))
	if err != nil {
		response.Error(c, errcode.ErrMediaNotFound.WithError(err))
		return
	}

	response.Success(c, media)
}

type PostMediaReq struct {
	MID           uint   `json:"mid" gorm:"primaryKey;column:mid"`
	Url           string `json:"url"`
	TranscriptUrl string `json:"transcript_url"`
	Title         string `json:"title"`
	CoverImg      string `json:"cover_img"`
	Des           string `json:"des"`
	Tag           string `json:"tag"`
	Type          string `json:"type"`
}

func (h *handler) PostMedia(c *gin.Context) {
	var req PostMediaReq
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, errcode.ErrParams.WithError(err))
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
		response.Error(c, errcode.ErrMediaCreate.WithError(err))
		return
	}

	lines, err := transcript.Convert(req.TranscriptUrl)
	if err != nil {
		response.Error(c, errcode.ErrTranscript.WithError(err))
		return
	}

	b, _ := json.Marshal(lines)
	_, err = db.CreateTranscript(&model.Transcript{
		MID:            media.MID,
		SourceLangCode: model.En,
		TargetLangCode: model.ZhCN,
		Content:        string(b),
	})

	response.Success(c, nil)
}

func (h *handler) i() {}
