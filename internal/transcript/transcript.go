package transcript

import (
	"errors"
	"go-server-template/internal/model"
	"path/filepath"
	"strings"
)

type Convertor interface {
	Convert(string)	([]*model.Line, error)
}

func Convert(filePath string) ([]*model.Line, error){
	var c Convertor
	switch filepath.Ext(strings.ToLower(filePath)) {
	case ".srt", ".ssa", ".ass", ".stl", ".ttml", ".vtt" :
		c = &SubConvertor{}
	case ".lrc" :
	default:
		return nil, errors.New("%s not supported")
	}
	return c.Convert(filePath)
}