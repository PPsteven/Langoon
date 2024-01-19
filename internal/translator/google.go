package translator

import (
	"bytes"
	"fmt"
	"github.com/PuerkitoBio/goquery"
	"go-server-template/internal/model"
	"go-server-template/pkg/http"

	netHttp "net/http"
	"net/url"
)

type LanguageCode = model.LanguageCode

const pathGoogleTrans = "https://translate.google.com/m?tl=%s&sl=%s&q=%s"

type GoogleTranslator struct {}

func (t *GoogleTranslator) Translate(sourceLang, targetLang LanguageCode, text string) (string, error) {
	path := fmt.Sprintf(pathGoogleTrans, targetLang, sourceLang, url.QueryEscape(text))
	htmlByte, err := http.Request(path, netHttp.MethodGet, nil, nil)
	if err != nil {
		return "", err
	}

	html, err := goquery.NewDocumentFromReader(bytes.NewReader(htmlByte))
	transText := html.Find(".result-container").Text()
	return transText, nil
}

