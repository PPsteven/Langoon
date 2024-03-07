package transcript

import (
	"bytes"
	"github.com/asticode/go-astisub"
	"go-server-template/internal/model"
	"path/filepath"
	"strings"
)

type SubConvertor struct {
	ConvertorData
}

func (s *SubConvertor) Convert() (lines []*model.Line, err error) {
	var sub *astisub.Subtitles

	switch filepath.Ext(strings.ToLower(s.fileName)) {
	case ".srt":
		sub, err = astisub.ReadFromSRT(bytes.NewBuffer(s.buf))
	case ".ssa", ".ass":
		sub, err = astisub.ReadFromSSA(bytes.NewBuffer(s.buf))
	case ".stl":
		sub, err = astisub.ReadFromSTL(bytes.NewBuffer(s.buf), astisub.STLOptions{})
	case ".ts":
		sub, err = astisub.ReadFromTeletext(bytes.NewBuffer(s.buf), astisub.TeletextOptions{})
	case ".ttml":
		sub, err = astisub.ReadFromTTML(bytes.NewBuffer(s.buf))
	case ".vtt":
		sub, err = astisub.ReadFromWebVTT(bytes.NewBuffer(s.buf))
	}

	lines = make([]*model.Line, 0, len(sub.Items))
	var s1, s2 string
	for i, item := range sub.Items {
		s1, s2 = getTranslation(item.String())
		lines = append(lines, &model.Line{
			ID:          i,
			Raw:         s1,
			Translation: s2,
			Start:       int64(item.StartAt),
			End:         int64(item.EndAt),
		})
	}
	return lines, nil
}

func getTranslation(s string) (raw string, translation string) {
	defer func() {
		raw = strings.TrimSpace(raw)
		translation = strings.TrimSpace(translation)
	}()

	splits := strings.SplitN(s, "\\N", 2)
	if len(splits) == 2 {
		return splits[1], splits[0]
	} else if len(splits) == 1 {
		return splits[0], ""
	}
	return "", ""
}
