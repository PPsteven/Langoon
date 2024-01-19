package transcript

import (
	"fmt"
	"github.com/asticode/go-astisub"
	"go-server-template/internal/model"
	"strings"
)

type SubConvertor struct {}

func (s *SubConvertor) Convert(filePath string) (lines []*model.Line, err error){
	sub, err := astisub.OpenFile(filePath)
	if err != nil {
		return nil, fmt.Errorf("file %s open failed", filePath)
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