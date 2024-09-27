package errcode

import (
	"net/http"
)

// Business Code 命名规则
// AABBCC
// A: 通用模块 01-通用模块 02-业务模块
// B: 业务模块号 01-用户模块
// C: 具体错误
var (
	// 通用错误
	ErrParams               = NewSvrError(10001, "params error", http.StatusBadRequest)
	ErrInternal             = NewSvrError(10002, "internal error", http.StatusInternalServerError)
	ErrInvalidAuthorization = NewSvrError(10003, "empty or invalid authorization", http.StatusUnauthorized)

	// 业务错误
	// 200100 User
	ErrUserNotFound = NewSvrError(200101, "user not found", http.StatusNotFound)

	// 200200 Translate
	ErrTranslateFailed = NewSvrError(200201, "translate failed", http.StatusInternalServerError)

	// 200300 Media
	ErrMediaNotFound = NewSvrError(200301, "media not found", http.StatusNotFound)
	ErrMediaCreate   = NewSvrError(200302, "media create failed", http.StatusInternalServerError)
	ErrTranscript    = NewSvrError(200303, "transcript failed", http.StatusInternalServerError)

	// 200400 NLP
	ErrTokenize  = NewSvrError(200401, "tokenize error", http.StatusInternalServerError)
	ErrSentences = NewSvrError(200402, "sentences error", http.StatusInternalServerError)

	// 200500 Word
	ErrGetWordDict = NewSvrError(200501, "get word dict error", http.StatusInternalServerError)

	// 200600 audio
	ErrUploadAudio   = NewSvrError(200601, "upload audio error", http.StatusInternalServerError)
	ErrAudioNotFound = NewSvrError(200602, "audio not found", http.StatusNotFound)
	ErrAudioNotReady = NewSvrError(200603, "audio not ready", http.StatusForbidden)
	ErrAudioStatus   = NewSvrError(200604, "audio status error", http.StatusForbidden)
	ErrGenerateAudio = NewSvrError(200605, "generate audio error", http.StatusInternalServerError)
)
