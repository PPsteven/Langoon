package handlers

import (
	"github.com/gin-gonic/gin"
	"go-server-template/internal/db"
	"go-server-template/server/common"
	"strconv"
)

type GetMediaResp struct {

}

func GetMedia(c *gin.Context) {
	MID, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		common.ErrorResp(c, err.Error())
		return
	}
	media, err := db.GetMediaByMID(uint(MID))
	if err != nil {
		common.ErrorResp(c, err.Error())
		return
	}

	common.SuccessResp(c, media)
}