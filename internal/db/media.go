package db

import (
	"encoding/json"
	"go-server-template/internal/model"
)

func GetMediaByMID(mid uint) (media *model.Media, err error) {
	media = &model.Media{MID: mid}
	err = db.Debug().Preload("Transcript").First(&media).Error
	if err != nil {
		return nil, err
	}
	_ = json.Unmarshal([]byte(media.Transcript.Content), &media.Transcript.Lines)
	return media, nil
}

func CreateMedia(media *model.Media) (*model.Media, error) {
	err := db.Debug().Create(&media).Error
	return media, err
}

func CreateTranscript(data *model.Transcript) (*model.Transcript, error) {
	err := db.Debug().Create(&data).Error
	return data, err
}