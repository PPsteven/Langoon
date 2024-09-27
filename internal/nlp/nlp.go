package nlp

import (
	"context"
	"encoding/json"
	"fmt"
	"go-server-template/internal/model"
	client "go-server-template/pkg/httpclient"
	"time"
)

const (
	pathNLPtokenize  = "http://127.0.0.1:8180/tokenize"
	pathNLPsentences = "http://127.0.0.1:8180/sentences"
)

func Tokenize(slc model.LanguageCode, text []string) (tokens [][]*model.Token, err error) {
	path := fmt.Sprint(pathNLPtokenize)

	body, _ := json.Marshal(map[string]interface{}{
		"lang": slc,
		"text": text,
	})

	respBody, err := client.PostJSON(context.Background(), path, body, client.WithTimeout(5*time.Second))
	if err != nil {
		return nil, err
	}

	err = json.Unmarshal(respBody, &tokens)
	if err != nil {
		return nil, err
	}

	return tokens, nil
}

func Sentences(slc model.LanguageCode, text string) ([]string, error) {
	path := fmt.Sprint(pathNLPsentences)

	body, _ := json.Marshal(map[string]interface{}{
		"lang": slc,
		"text": text,
	})

	respBody, err := client.PostJSON(context.Background(), path, body, client.WithTimeout(5*time.Second))
	if err != nil {
		return nil, err
	}

	var texts []string
	err = json.Unmarshal(respBody, &texts)
	if err != nil {
		return nil, err
	}

	return texts, nil
}
