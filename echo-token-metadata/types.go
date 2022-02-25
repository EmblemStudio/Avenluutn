package main

// TODO consider chaning display type and trait type to Enums
// TODO consider doing attribute value type checking somehow
type Attribute struct {
	DisplayType string `json:"display_type,omitempty"`
	TraitType string `json:"trait_type"`
	Value interface{} `json:"value"`
}

type StoryMeta struct {
	Name string `json:"name"`
	Description string `json:"description"`
	Image string `json:"image"`
	AnimationURL string `json:"animation_url"`
	ExternalURL string `json:"external_url"`
	Attributes []Attribute `json:"attributes"`
}

type MiddlePart struct {
	OutcomeText []OutcomePart `json:"outcomeText"`
}

type OutcomePart struct {
	ResultTexts [][]TextPart `json:"resultTexts"`
	TriggerTexts [][]TextPart `json:"resultTexts"`
}

type EndingPart struct {
	ResultTexts [][]TextPart `json:"resultTexts"`
}

type TextPart struct {
	Label string `json:"label"`
	String string `json:"string"`
}

type StoryParts struct {
	Middle MiddlePart `json:"middle"`
	Ending EndingPart `json:"ending"`
	Beginning []TextPart `json:"beginning"`
}

type Story struct {
	RichText StoryParts `json:"richText"`
}

type StoryInfo struct {
	NarratorIndex   int64
	CollectionIndex int64
	Index           int64
	Minted          bool
	NFTid           int64
}

type AdventurerName struct {
	FirstName string `json:"firstName"`
	LastName string `json:"lastName"`
	MiddleName string `json:"MiddleName"`
	Prefix string `json:"prefix"`
	Suffix string `json:"suffix"`
}

type Adventurer struct {
	Class []string `json:"class"`
	Name AdventurerName `json:"name"`
}

type Guild struct {
	Adventurers map[string]Adventurer `json:"adventurers"`
}

type NarratorState struct {
	Guilds []Guild `json:"guilds"`
}

type Run struct {
	Stories []Story `json:"stories"`
	NextState NarratorState `json:"nextState"`
	NextUpdateTime int64 `json:"nextUpdateTime"`
}

