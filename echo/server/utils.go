package server

import (
	"net/http"
	"strconv"
	"log"
	"github.com/labstack/echo/v4"
)

func echoHTTPError(status int, e error) error {
	log.Println("HTTP Error", status, e)
	return echo.NewHTTPError(status, e)
}

func badRequest(e error) error {
	return echoHTTPError(http.StatusBadRequest, e)
}

func serverError(e error) error {
	return echoHTTPError(http.StatusInternalServerError, e)
}

func getInt64Param(c echo.Context, k string) (int64, error) {
	param := c.Param(k)
	return strconv.ParseInt(param, 10, 64)
}

func getInt64FormValue(c echo.Context, k string) (int64, error) {
	value := c.FormValue(k)
	return strconv.ParseInt(value, 10, 64)
}
