package errcode

import "net/http"

var (
	ErrTranslateFailed = NewSvrError(200201, "translate failed", http.StatusInternalServerError)
)
