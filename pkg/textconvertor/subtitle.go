package textconvertor

import (
	"bytes"
	"strings"

	"github.com/asticode/go-astisub"

	"go-server-template/internal/model"
)

type SubConvertor struct {
	ConvertorData
}

func (s *SubConvertor) Convert() (lines []*model.Line, err error) {
	var sub *astisub.Subtitles

	switch s.ext {
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
	for _, item := range sub.Items {
		lines = append(lines, &model.Line{
			ID:    item.Index,
			Lines: getSplitLines(item.Lines),
			Start: int64(item.StartAt),
			End:   int64(item.EndAt),
		})
	}
	return lines, nil
}

func getSplitLines(lines []astisub.Line) (splitLines []string) {
	splitLines = make([]string, 0)
	for _, line := range lines {
		if len(line.Items) > 0 {
			splitLines = append(splitLines, strings.TrimSpace(line.Items[0].Text))
		}
	}

	if len(splitLines) == 0 || len(splitLines) >= 2 {
		return
	}

	// 字幕格式不标准，尝试用字符串切分
	var sep string
	seps := []string{"\\N", "\n"}

	for _, sep = range seps {
		if strings.Contains(splitLines[0], sep) {
			break
		}
	}

	return strings.SplitN(splitLines[0], sep, 2)
}
