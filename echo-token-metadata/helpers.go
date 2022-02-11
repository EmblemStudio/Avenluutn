package main

import (
	"fmt"
	"strings"
	"encoding/base64"
	"errors"
)

func makeImageSVG(name string, summary string) string {

	lines := strings.Split(summary, "\n")

	lineTmpl := `  <text x="10" y="%v" class="base">%v</text>`
	var textElems []string

	for i, l := range(lines) {
		elem := fmt.Sprintf(lineTmpl, i * 12 + 85, l)
		textElems = append(textElems, elem)
	}

	svg := fmt.Sprintf(`
<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">
  <style>
    .base { fill: white; font-family: sans-serif; font-size: 10px; }
    .title { fill: white; font-family: sans-serif; font-size: 12px; }
  </style>
  <rect width="100%%" height="100%%" fill="black" />
  <text x="10" y="50" class="title">%v</text>
%v
</svg>
`, name, strings.Join(textElems, "\n"))

	b64SVG := base64.StdEncoding.EncodeToString([]byte(svg))
	return fmt.Sprintf("data:image/svg+xml;base64,%v", b64SVG)
}

func countAdventurers(textParts []TextPart) int {
	count := 0
	for _, t := range(textParts) {
		if t.Label == "adventurerName" {
			count += 1
		}
	}
	return count
}

func findGuildName(textParts []TextPart) (string, error) {
	for _, t := range(textParts) {
		if t.Label == "guildName" {
			return strings.TrimSpace(t.String), nil
		}
	}
	return "", errors.New(
		fmt.Sprintf("No guild name found\nTextParts: %v", textParts),
	)
}

func makeQuestText(textParts []TextPart) (string, error) {
	foundQuestType := false
	questText := ""
	for _, t := range(textParts) {
		if t.Label == "questType" {
			foundQuestType = true
		}
		if foundQuestType == true {
			questText += t.String
		}
	}
	if foundQuestType == true {
		return strings.TrimSpace(questText), nil
	}
	return "", errors.New(
		fmt.Sprintf("No quest text found\ntextParts%v", textParts),
	)
}

// findQuestConjunctive finds the word to use when refering to the quest
func findQuestConjunctive(textParts []TextPart) (string, error) {
	for i, t := range(textParts) {
		if t.Label == "questType" {
			return strings.TrimSpace(textParts[i + 1].String), nil
		}
	}
	return "", errors.New(
		fmt.Sprintf("Could not find quest conjunctive\ntextParts%v", textParts),
	)
}

func findQuestObjective(textParts []TextPart) (string, error) {
	for i, t := range(textParts) {
		if t.Label == "questObjective" {
			return strings.TrimSpace(textParts[i].String), nil
		}
	}
	return "", errors.New(
		fmt.Sprintf("Could not find quest objective\ntextParts%v", textParts),
	)
}



