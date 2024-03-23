package model

type Word struct {
	Pron       string   `json:"pron"`
	Original   string   `json:"original"`
	Meaning    string   `json:"meaning"`
	Definition string   `json:"definition"`
	Explain    string   `json:"explain"`
	Examples   []string `json:"examples"`
	Others     []string `json:"others"`
	Class      string   `json:"class"`
}
