package textconvertor

import "go-server-template/internal/model"

type LrcConvertor struct {
	ConvertorData
}

func (l *LrcConvertor) Convert() (lines []*model.Line, err error) {
	return
}
