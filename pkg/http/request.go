package http

import "errors"

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


