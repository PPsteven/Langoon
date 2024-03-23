package errcode

import "net/http"

var (
	ErrGetWordDict = NewSvrError(200501, "get word dict error", http.StatusInternalServerError)
)
