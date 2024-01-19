package db

import "go-server-template/internal/model"

func GetMediaByMID(mid uint) (media *model.Media, err error) {
	media = &model.Media{MID: mid}
	err = db.Debug().Preload("Transcript").First(&media).Error
	if err != nil {
		return nil, err
	}
	return media, nil
}