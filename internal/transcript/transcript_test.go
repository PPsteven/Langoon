package transcript

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestConvert(t *testing.T) {
	t.Run("test ass", func(t *testing.T) {
		items, err := Convert("../../data/1992_scent_of_woman.ass")
		assert.NoError(t, err)

		t.Logf("%v", items[30])
	})
}