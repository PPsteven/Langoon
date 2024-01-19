package http

import (
	"errors"
	"fmt"
	"io"
	"net/http"
	"regexp"
)

type ErrResp struct {
	Message     string `json:"message"`
	Description string `json:"description"`
	Error       string `json:"error"`
}

func Request(url string, method string, callback ReqCallback, resp interface{}) ([]byte, error) {
	req := RestyClient.R()
	if callback != nil {
		callback(req)
	}
	if resp != nil {
		req.SetResult(resp)
	}
	var e ErrResp
	req.SetError(&e)
	res, err := req.Execute(method, url)
	if err != nil {
		return nil, err
	}
	if e.Error != "" {
		return nil, errors.New(e.Description)
	}
	return res.Body(), nil
}

func Download(url string) ([]byte, string, error) {
	resp, err := http.Get(url)
	if err != nil {
		return nil, "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, "", fmt.Errorf("status error: %d", resp.StatusCode)
	}

	contentDisposition := resp.Header.Get("Content-Disposition")
	fileName := extractFilename(contentDisposition)

	fileBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, "", fmt.Errorf("download error: %s", err.Error())
	}

	return fileBytes, fileName, nil
}

func extractFilename(fn string) string {
	re := regexp.MustCompile(`filename="(.+)"`)
	matches := re.FindStringSubmatch(fn)
	if len(matches) > 1 {
		return matches[1]
	}
	fmt.Println(fn)
	fmt.Println(matches)
	return ""
}