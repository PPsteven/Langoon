package transcript

import (
	"fmt"
	"go-server-template/internal/model"
	"go-server-template/pkg/http"
	"io"
	"os"
	"path/filepath"
	"strings"
)

type ConvertorData struct {
	buf []byte
	filePath string
	fileName string
}

type Convertor interface {
	Convert() ([]*model.Line, error)
}

func Convert(filePath string) ([]*model.Line, error){
	var c Convertor
	var err error

	cdata := ConvertorData{filePath: filePath}

	// Open the file on the server
	if strings.HasPrefix(strings.TrimSpace(filePath), "http") {
		cdata.buf, cdata.fileName, err = http.Download(filePath)
		if err != nil {
			return nil, err
		}
	} else {
		// Open the file
		var f *os.File
		if f, err = os.Open(filePath); err != nil {
			return nil, fmt.Errorf("opening %s failed: %w", filePath, err)
		}
		cdata.buf, err = io.ReadAll(f)
		cdata.fileName = filepath.Base(filePath)
	}

	switch filepath.Ext(strings.ToLower(cdata.fileName)) {
	case ".srt", ".ssa", ".ass", ".stl", ".ttml", ".vtt" :
		c = &SubConvertor{cdata}
	case ".lrc" :
	default:
		return nil, fmt.Errorf("%s not supported", cdata.fileName)
	}
	return c.Convert()
}