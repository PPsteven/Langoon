package textconvertor

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
	ext string
}

type Convertor interface {
	Convert() ([]*model.Line, error)
}

func FromFile(filePath string) ([]*model.Line, error) {
	var (
		err      error
		cdata    ConvertorData
		filename string
	)

	// Open the file on the server
	if strings.HasPrefix(strings.TrimSpace(filePath), "http") {
		cdata.buf, filename, err = http.Download(filePath)
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
		filename = filepath.Base(filePath)
	}

	cdata.ext = filepath.Ext(strings.ToLower(filename))

	return Convert(cdata)
}

func FromText(text string, ext model.TextType) ([]*model.Line, error) {
	cdata := ConvertorData{
		buf: []byte(text),
		ext: "." + string(ext),
	}

	return Convert(cdata)
}

func Convert(cdata ConvertorData) ([]*model.Line, error) {
	var c Convertor

	switch cdata.ext {
	case ".srt", ".ssa", ".ass", ".stl", ".ttml", ".vtt":
		c = &SubConvertor{cdata}
	case ".lrc":
	default:
		return nil, fmt.Errorf("%s not supported", cdata.ext)
	}
	return c.Convert()
}
