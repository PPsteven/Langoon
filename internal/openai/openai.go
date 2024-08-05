package openai

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"github.com/sashabaranov/go-openai"
	"go-server-template/internal/model"
	"strings"
	"text/template"
)

var client *openai.Client

func Init() {
	client = openai.NewClient("xxx")
}

func GetWord(word, sentence, slc, tlc string) (w *model.Word, err error) {
	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: openai.GPT4o,
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
	content = strings.TrimPrefix(content, "```json")
	content = strings.TrimSuffix(content, "```")

	err = json.Unmarshal([]byte(content), &w)
	if err != nil {
		return nil, fmt.Errorf("unmarshal error: %v, content: %s", err, content)
	}

	return w, nil
}

var WordDictionaryTmpl, _ = template.New("test").Parse(`你是一个词典，我希望你将<w>包裹的词解释为中文，根据<s>包裹的句子的作为上下文语境。
<w>{{.Word}}</w>
<s>{{.Sentence}}</s>
希望你得回答直接输出为json字符串，不是md格式，json的字段和其要求如下：
1.pron string:音标，如果是日文，则使用假名拼音给出
2.original string:词原始的意思
3.meaning string:词句中的意思
4.definition string:英文/日文定义
5.explain string:为什么词在句子中如此反应
6.examples string[]:造出2个例句
7.others string[]:列表给出其余词意
8.class string:词性
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
