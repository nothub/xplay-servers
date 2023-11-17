package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
)

type server struct {
	ID               int     `json:"ID"`
	NameSite         int     `json:"NameSite"`
	CurrentMap       string  `json:"CurrentMap"`
	Online           int     `json:"Online"`
	TotalSlots       int     `json:"TotalSlots"`
	GameModeID       int     `json:"GameModeID"`
	CountryCode      string  `json:"CountryCode"`
	XCountryKey      int     `json:"XCountryKey"`
	SvRegion         int     `json:"SvRegion"`
	IP               string  `json:"IP"`
	Port             int     `json:"Port"`
	ReservedSlots    int     `json:"ReservedSlots,omitempty"`
	TickRate         int     `json:"TickRate"`
	IsCS2            bool    `json:"IsCS2"`
	AverageFaceItLvl float64 `json:"AverageFaceItLvl"`
	SpecialFlags     int     `json:"SpecialFlags"`
	Region           int     `json:"Region"`
}

type mode string

const (
	awpDm        mode = "4"
	hsDm         mode = "2"
	dm           mode = "1"
	retake       mode = "7"
	pistolRetake mode = "9"
	surf         mode = "10"
	awp          mode = "13"
	bhop         mode = "5"
)

func main() {
	res, err := http.DefaultClient.Post("https://xplay.gg/api/play/getServers", "application/json", strings.NewReader(fmt.Sprintf("{\"modeID\":%s,\"showFullServers\":false}", retake)))
	if err != nil {
		log.Fatalln(err.Error())
	}

	b, err := io.ReadAll(res.Body)
	if err != nil {
		log.Fatalln(err)
	}

	var servers []server
	err = json.Unmarshal(b, &servers)
	if err != nil {
		log.Fatalln(err)
	}

	for _, s := range servers {
		log.Printf("%++v\n", s)
	}

}
