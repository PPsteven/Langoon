package audio

import (
	"context"
	"encoding/json"
	"errors"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	"go-server-template/internal/model"
	"go-server-template/internal/server/errcode"
	"go-server-template/internal/server/response"
	"go-server-template/internal/service"
	"net/http"
)

var _ Handler = (*handler)(nil)

type Handler interface {
	Upload(c *gin.Context)
	GetMeta(c *gin.Context)
	Generate(c *gin.Context)
	i()
}

type handler struct {
	service service.Service
}

func New(s service.Service) Handler {
	return &handler{service: s}
}

type UploadReq struct {
	Title     string          `json:"title"`
	Audio     string          `json:"audio"`
	AudioType model.AudioType `json:"audio_type"`
	Text      string          `json:"text"`
	TextType  model.TextType  `json:"text_type"`
}

type UploadResp struct {
	Uid string `json:"uid"`
}

func (h *handler) Upload(c *gin.Context) {
	var req UploadReq

	if err := c.ShouldBind(&req); err != nil {
		response.Error(c, errcode.ErrParams.WithError(err))
		return
	}

	if err := validateUploadRequest(req); err != nil {
		response.Error(c, errcode.ErrParams.WithError(err))
		return
	}

	uid, err := h.service.Audio().Create(c, req.Title, req.Audio, req.AudioType, req.Text, req.TextType)
	if err != nil {
		response.Error(c, errcode.ErrUploadAudio.WithError(err))
	}

	response.Success(c, UploadResp{
		Uid: uid,
	})
}

func validateUploadRequest(req UploadReq) error {
	if len(req.Title) == 0 {
		return errors.New("title is required")
	}

	if len(req.Audio) == 0 {
		return errors.New("audio is required")
	}

	if req.AudioType != model.AudioTypeMP3 {
		return errors.New("invalid audio type")
	}

	if len(req.Text) == 0 {
		return errors.New("text is required")
	}

	if req.TextType != "srt" {
		return errcode.ErrParams.WithDetail("Invalid text type")
	}

	return nil
}

type GetMetaResp struct {
	ID    uint          `json:"id" gorm:"primaryKey" example:"1"`
	UID   string        `json:"uid" gorm:"uniqueIndex" example:"c7b3b1b0-4b7b-4b7b-8b7b-7b7b7b7b7b7b"`
	Title string        `json:"title" binding:"required" example:"My Audio"`
	Audio string        `json:"audio" binding:"required" example:"https://example.com/audio.mp3"`
	Lines []*model.Line `json:"lines" example:"[{\"start\":0,\"end\":1,\"text\":\"Hello, world!\"}]"`
}

func (h *handler) GetMeta(c *gin.Context) {
	uid := c.Param("uid")

	audio, err := h.service.Audio().Get(c, uid)
	if err != nil {
		response.Error(c, errcode.ErrAudioNotFound.WithError(err))
		return
	}

	if audio.Status != 2 {
		response.Error(c, errcode.ErrAudioNotReady)
		return
	}

	var lines []*model.Line
	err = json.Unmarshal([]byte(audio.Lines), &lines)
	if err != nil {
		response.Error(c, errcode.ErrInternal.WithError(err))
		return
	}

	response.Success(c, &GetMetaResp{
		ID:    audio.ID,
		UID:   audio.UID,
		Title: audio.Title,
		Audio: audio.Audio,
		Lines: lines,
	})
}

type generateReq struct {
	SourceLineIdx int                `json:"source_line_idx"`
	TargerLineIdx int                `json:"target_line_idx"`
	SourceLang    model.LanguageCode `json:"source_lang"`
	TargetLang    model.LanguageCode `json:"target_lang"`
}

func (h *handler) Generate(c *gin.Context) {
	var req generateReq
	if err := c.ShouldBind(&req); err != nil {
		response.Error(c, errcode.ErrParams.WithError(err))
		return
	}

	uid := c.Param("uid")

	audio, err := h.service.Audio().Get(c, uid)
	if err != nil {
		response.Error(c, errcode.ErrAudioNotFound.WithError(err))
		return
	}

	if audio.Status != 0 {
		response.Error(c, errcode.ErrAudioStatus.WithDetail("audio status is not initial"))
		return
	}

	go func() {
		err = h.service.Audio().Generate(context.TODO(),
			req.SourceLang, req.SourceLineIdx, req.TargetLang, req.TargerLineIdx, audio)
		if err != nil {
			logrus.Error("generate audio failed, uid %s, err:%v", audio.UID, err)
		}
	}()

	response.SuccessWithHttpCode(c, nil, http.StatusAccepted)
}

func (h *handler) i() {}
