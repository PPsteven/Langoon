package openai

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestGetWord(t *testing.T) {
	Init()

	t.Run("jp", func(t *testing.T) {
		word, err := GetWord("ない", "住んで都にするしかないさ", "", "")
		assert.NoError(t, err)

		t.Log(word)
	})
}

func TestWordDictionaryPrompt(t *testing.T) {
	t.Run("en", func(t *testing.T) {
		prompt := GenWordPrompt("shitstorm",
			"And he wanted to create the shitstorm. And he didn't want to be talked out of it. And if he told them, he'd have had all these people trying to talk him out of it.")
		t.Log(prompt)
	})
	t.Run("jp", func(t *testing.T) {
		prompt := GenWordPrompt("ない",
			"住んで都にするしかないさ")
		t.Log(prompt)
	})
}
