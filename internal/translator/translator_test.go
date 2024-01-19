package translator

import (
	"github.com/stretchr/testify/assert"
	"go-server-template/internal/model"
	"go-server-template/pkg/http"
	"testing"
)

func init() {
	http.InitClient()
}

func TestTranslator(t *testing.T) {
	engine := New().SetLang(model.Ja, model.ZhCN)
	text := "自然地理的には、ユーラシア大陸の東に位置しており、環太平洋火山帯を構成する"

	t.Run("translate", func(t *testing.T) {
		trans, err := engine.Translate(text)
		assert.NoError(t, err)
		t.Logf(trans)
	})
}