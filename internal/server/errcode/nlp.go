package errcode

import "net/http"

var (
	ErrTokenize  = NewSvrError(200401, "tokenize error", http.StatusInternalServerError)
	ErrSentences = NewSvrError(200402, "sentences error", http.StatusInternalServerError)
)
