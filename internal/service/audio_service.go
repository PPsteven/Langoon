package service

import (
	"context"
	"encoding/json"
	"github.com/google/uuid"
	"go-server-template/internal/db"
	"go-server-template/internal/model"
	"go-server-template/internal/nlp"
	"go-server-template/pkg/textconvertor"
	"gorm.io/gorm"
)

type AudioService interface {
	Create(ctx context.Context, title, audio string, audioType model.AudioType, text string,
		textType model.TextType) (uid string, err error)

	Get(ctx context.Context, uid string) (audio *model.Audio, err error)

	Generate(ctx context.Context, sourceLang model.LanguageCode, sourceLangIdx int,
		targerLang model.LanguageCode, targerLangIdx int, audio *model.Audio) (err error)

	i()
}

type audioService struct {
	db *gorm.DB
}

func newAudio(s *service) AudioService {
	return &audioService{
		db: s.db,
	}
}

func (s *audioService) Create(ctx context.Context, title, audio string, audioType model.AudioType, text string,
	textType model.TextType) (uid string, err error) {
	lines, err := textconvertor.FromText(text, textType)
	if err != nil {
		return "", err
	}

	linesByte, err := json.Marshal(lines)

	uid = uuid.New().String()
	return uid, db.CreateAudio(ctx, &model.Audio{UID: uid, Title: title, Audio: audio, AudioType: string(audioType), Text: text,
		TextType: string(textType), Lines: string(linesByte)})
}

func (s *audioService) Get(ctx context.Context, uid string) (audio *model.Audio, err error) {
	return db.GetAudio(ctx, uid)
}

func (s *audioService) Generate(ctx context.Context, sourceLang model.LanguageCode, sourceLangIdx int,
	targerLang model.LanguageCode, targerLangIdx int, audio *model.Audio) (err error) {

	tx := s.db.WithContext(ctx).Begin()
	defer tx.Rollback()

	err = db.LockAudio(ctx, tx, audio.ID)
	if err != nil {
		return err
	}

	err = s.audioGenerate(ctx, tx, sourceLang, sourceLangIdx, targerLang, targerLangIdx, audio)
	if err != nil {
		return err
	}

	tx.Commit()
	return nil
}

func (s *audioService) audioGenerate(ctx context.Context, tx *gorm.DB, sourceLang model.LanguageCode, sourceLangIdx int,
	targerLang model.LanguageCode, targerLangIdx int, audio *model.Audio) (err error) {
	maxIdx := targerLangIdx
	if sourceLangIdx > targerLangIdx {
		maxIdx = sourceLangIdx
	}

	// 1. 解析文本
	var audioLines []*model.Line
	err = json.Unmarshal([]byte(audio.Lines), &audioLines)
	if err != nil {
		return err
	}

	var source, target string
	for i, line := range audioLines {
		if maxIdx > len(line.Lines)-1 {
			source = line.Lines[0]
			target = ""
		} else {
			source = line.Lines[sourceLangIdx]
			target = line.Lines[targerLangIdx]
		}

		audioLines[i].Source = source
		audioLines[i].Target = target
	}

	// 2. 分词
	for i, line := range audioLines {
		tokens, err := nlp.Tokenize(sourceLang, []string{line.Source})
		if err != nil || len(tokens) == 0 {
			return err
		}
		audioLines[i].Tokens = tokens[0]
	}

	// 3. 更新数据库
	return db.UnLockAudio(ctx, tx, audioLines, audio.ID)
}

func (s *audioService) i() {}
