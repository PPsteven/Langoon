package transcript

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestConvert(t *testing.T) {
	t.Run("local", func(t *testing.T) {
		items, err := Convert("../../data/1992_scent_of_woman.ass")
		assert.NoError(t, err)

		if len(items) > 0 {
			t.Logf("%v", items[10])
		}
	})

	t.Run("remote", func(t *testing.T) {
		items, err := Convert("http://192.168.31.96:5244/d/Space/Assets/Scent_Of_A_Women_En.ass?sign=LRRMeU2R3Ap9YrEGpVNgROrcLDLoG1-mBlsXbUw5Wjs=:1705679640")
		assert.NoError(t, err)

		if len(items) > 0 {
			t.Logf("%v", items[10])
		}
	})
}