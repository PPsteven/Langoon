package openai

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestGetWord(t *testing.T) {
	Init()

	t.Run("first case", func(t *testing.T) {
		word, err := GetWord("shitstorm", "And he wanted to create the shitstorm. And he didn't want to be talked out of it. And if he told them, he'd have had all these people trying to talk him out of it.", "", "")
		assert.NoError(t, err)

		t.Log(word)
	})
}

func TestWordDictionaryPrompt(t *testing.T) {
	t.Run("", func(t *testing.T) {
		prompt := GenWordPrompt("shitstorm",
			"And he wanted to create the shitstorm. And he didn't want to be talked out of it. And if he told them, he'd have had all these people trying to talk him out of it.")
		t.Log(prompt)
	})
}
