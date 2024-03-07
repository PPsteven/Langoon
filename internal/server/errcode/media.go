package errcode

import "net/http"

var (
	ErrMediaNotFound = NewSvrError(200301, "media not found", http.StatusNotFound)
	ErrMediaCreate   = NewSvrError(200302, "media create failed", http.StatusInternalServerError)
	ErrTranscript    = NewSvrError(200303, "transcript failed", http.StatusInternalServerError)
)
