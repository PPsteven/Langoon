package openai

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"github.com/sashabaranov/go-openai"
	"go-server-template/internal/model"
	"text/template"
)

var client *openai.Client

func Init() {
	client = openai.NewClient("your-api-token")
}

func GetWord(word, sentence, slc, tlc string) (w *model.Word, err error) {
	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: openai.GPT3Dot5Turbo,
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleUser,
					Content: GenWordPrompt(word, sentence),
				},
			},
		},
	)

	if err != nil {
		return nil, fmt.Errorf("openai chat completion error: %v", err)
	}

	content := resp.Choices[0].Message.Content

	err = json.Unmarshal([]byte(content), &w)
	if err != nil {
		return nil, fmt.Errorf("unmarshal error: %v, content: %s", err, content)
	}

	return w, nil
}

var WordDictionaryTmpl, _ = template.New("test").Parse(`你是一个词典，我希望你将<w>包裹的词解释为中文，根据<s>包裹的句子的作为上下文语境。
<w>{{.Word}}</w>
<s>{{.Sentence}}</s>
希望你得回答按json输出，不要有多余的文字，json的字段和其要求如下：
1.pron:音标
2.original:词原始的意思
3.meaning:词句中的意思
4.definition:英文定义
5.explain:为什么词在句子中如此反应
6.examples:造出2个例句
7.others:列表给出其余词意
8.class:词性
`)

type WordDictionaryParams struct {
	Word     string
	Sentence string
}

func GenWordPrompt(word, sentence string) string {
	buffer := &bytes.Buffer{}
	_ = WordDictionaryTmpl.Execute(buffer, WordDictionaryParams{Word: word, Sentence: sentence})
	return buffer.String()
}
