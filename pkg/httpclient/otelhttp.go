package httpclient

const (
	traceName = "github.com/go-eagle/eagle/pkg/net/http"
)

var (
// tracer trace.Tracer
)

// nolint
func init() {
	//tracer = otel.GetTracerProvider().Tracer(traceName, trace.WithInstrumentationVersion(contrib.SemVersion()))
}
