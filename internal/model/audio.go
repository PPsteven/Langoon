package model

type AudioType string

const (
	AudioTypeMP3 AudioType = "mp3"
)

type TextType string

const (
	TextTypeSRT TextType = "srt"
)

type Audio struct {
	ID        uint   `json:"id" gorm:"primaryKey" example:"1"`
	UID       string `json:"uid" gorm:"uniqueIndex" example:"c7b3b1b0-4b7b-4b7b-8b7b-7b7b7b7b7b7b"`
	Title     string `json:"title" binding:"required" example:"My Audio"`
	AudioUrl  string `json:"audio_url" binding:"required" example:"https://example.com/audio.mp3"`
	AudioType string `json:"audio_type" binding:"required,eq=mp3" example:"mp3"`
	Text      string `json:"text" binding:"required" example:"Hello, world!"`
	TextType  string `json:"text_type" binding:"required,eq=srt" example:"srt"`
	Lines     string `json:"lines" example:"[{\"start\":0,\"end\":1,\"text\":\"Hello, world!\"}]"`
	Status    int    `json:"status" example:"0"`
}
