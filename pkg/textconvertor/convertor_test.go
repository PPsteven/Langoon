package textconvertor

import (
	"github.com/stretchr/testify/assert"
	"io"
	"os"
	"testing"
)

func TestConvert(t *testing.T) {
	t.Run("local", func(t *testing.T) {
		items, err := FromFile("../../assets/demo.srt")
		assert.NoError(t, err)

		if len(items) > 0 {
			t.Logf("%#v", items[1])
		}
	})

	t.Run("from_text", func(t *testing.T) {
		f, _ := os.Open("../../assets/demo.srt")
		b, _ := io.ReadAll(f)
		items, err := FromText(string(b), ".srt")
		assert.NoError(t, err)

		if len(items) > 0 {
			t.Logf("%#v", items[2])
		}
	})

	t.Run("remote", func(t *testing.T) {
		items, err := FromFile("http://192.168.31.96:5244/d/Space/Assets/Scent_Of_A_Women_En.ass?sign=LRRMeU2R3Ap9YrEGpVNgROrcLDLoG1-mBlsXbUw5Wjs=:1705679640")
		assert.NoError(t, err)

		if len(items) > 0 {
			t.Logf("%v", items[10])
		}
	})
}
