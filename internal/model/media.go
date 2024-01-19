package model

type MediaType string

const (
	Music    MediaType = "music"
	Podcast            = "podcast"
	Movie              = "movie"
	Text               = "text"
	Dialogue           = "dialogue"
)

type Media struct {
	MID           uint      `json:"mid" gorm:"primaryKey;column:mid"`
	Url           string    `json:"url"`
	TranscriptUrl string    `json:"transcript_url"`
	Title         string    `json:"title"`
	CoverImg      string    `json:"cover_img"`
	Des           string    `json:"des"`
	Tag           string    `json:"tag"`
	Type          MediaType `json:"type"`

	Transcript Transcript `json:"transcript" gorm:"foreignKey:MID"`
}

type Transcript struct {
	MID            uint         `json:"mid" gorm:"primaryKey;column:mid"`
	SourceLangCode LanguageCode `json:"source_lang_code"`
	TargetLangCode LanguageCode `json:"target_lang_code"`
	Content        string       `json:"content" gorm:"type:longtext"`
	Lines          []Line       `json:"lines" gorm:"-"`
}

type Line struct {
	ID          int    `json:"id"`
	Raw         string `json:"raw"`
	Translation string `json:"translation"`
	Start       int64  `json:"start"`
	End         int64  `json:"end"`
}
