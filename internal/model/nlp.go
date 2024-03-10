package model

type Token struct {
	Text       string `json:"text"`
	POS        string `json:"pos"`
	Whitespace string `json:"whitespace"`
}
