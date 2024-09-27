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
	Content        string       `json:"-" gorm:"type:longtext"`
	Lines          []*Line      `json:"lines" gorm:"-"`
}

type Line struct {
	ID     int      `json:"id"`
	Lines  []string `json:"lines"`
	Source string   `json:"source"`
	Target string   `json:"targer"`
	Start  int64    `json:"start"`
	End    int64    `json:"end"`
	Tokens []*Token `json:"tokens"`
}
