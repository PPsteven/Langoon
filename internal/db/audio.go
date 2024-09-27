package db

import (
	"context"
	"encoding/json"
	"fmt"
	"go-server-template/internal/model"
	"gorm.io/gorm"
)

func CreateAudio(ctx context.Context, audio *model.Audio) (err error) {
	return db.WithContext(ctx).Create(&audio).Error
}

func GetAudio(ctx context.Context, uid string) (audio *model.Audio, err error) {
	audio = &model.Audio{}
	err = db.WithContext(ctx).First(audio, "uid = ?", uid).Error
	return
}

func LockAudio(ctx context.Context, tx *gorm.DB, id uint) (err error) {
	tx = tx.Model(&model.Audio{}).
		Where("status = 0 AND id = ?", id).
		Update("status", 1)
	affected, err := tx.RowsAffected, tx.Error
	if err != nil || affected == 0 {
		return fmt.Errorf("id: %d, lock failed: %w", id, err)
	}
	return nil
}

func UnLockAudio(ctx context.Context, tx *gorm.DB, audioLines []*model.Line, id uint) (err error) {
	audioLinesBytes, _ := json.Marshal(audioLines)

	return tx.Model(&model.Audio{}).
		Where("id = ?", id).
		Update("status", 2).
		Update("lines", string(audioLinesBytes)).
		Error
}
