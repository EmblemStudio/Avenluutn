package main

import (
	"testing"
	"fmt"
	"io/ioutil"
	"encoding/json"
	"errors"
)

func makeTestRun(path string) (Run, error) {
	var run Run
	data, err := ioutil.ReadFile(path)
	if err != nil {
		return Run{}, errors.New(fmt.Sprintf("could not read %v", path))
	}
	err = json.Unmarshal(data, &run)
	if err != nil {
		return Run{}, errors.New(fmt.Sprintf("could not unmarshal %v\n%v", path, err))
	}
	return run, nil
}

func TestMakeImageSVG(t *testing.T) {
	want := "data:image/svg+xml;base64,CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWluWU1pbiBtZWV0IiB2aWV3Qm94PSIwIDAgMzUwIDM1MCI+CiAgPHN0eWxlPgogICAgLmJhc2UgeyBmaWxsOiB3aGl0ZTsgZm9udC1mYW1pbHk6IHNhbnMtc2VyaWY7IGZvbnQtc2l6ZTogMTBweDsgfQogICAgLnRpdGxlIHsgZmlsbDogd2hpdGU7IGZvbnQtZmFtaWx5OiBzYW5zLXNlcmlmOyBmb250LXNpemU6IDEycHg7IH0KICA8L3N0eWxlPgogIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9ImJsYWNrIiAvPgogIDx0ZXh0IHg9IjEwIiB5PSI1MCIgY2xhc3M9InRpdGxlIj5tb2NrTmFtZTwvdGV4dD4KICA8dGV4dCB4PSIxMCIgeT0iODUiIGNsYXNzPSJiYXNlIj5tb2NrRGVzY3JpcHRpb248L3RleHQ+Cjwvc3ZnPgo="
	got := makeImageSVG("mockName", "mockDescription")
	if want != got {
		t.Fatalf("Want: %v\n Got: %v", want, got)
	}
}

func TestFindAdventurers(t *testing.T) {
	fiveZero := `Changpeng Cassidy the Wizard,
Serge Ford the Fighter,
and Dilibe Crassus the Bard`
	fiveOne := `Su Biddercombe the Monk,
Robert Mikulanc the Druid,
Fortinbras Nakamoto the Rogue,
Jiri Donkervoort the Barbarian,
and Ophelia Stoll the Warlock`
	fiveTwo := `Arch-ape Tyler Kiyomizu the Bard,
Rotnam Jackson the Warlock,
and Chishou Hermanns the Warlock`
	fiveThree := `Anya Bunker the Warlock,
Susan Monroe the Ranger,
Miguel Nigiri the Druid,
Bogdan Ford the Warlock,
and Dioscoro Bryant the Wizard`
	fiveFour := `Miguel Nigiri the Druid,
Anastazja Ibekwe the Monk,
and Zabbas Windward the Paladin`
	fiveFive := `Svatava Probst the Good the Wizard,
Marshal Azura state Gotou the Barbarian,
Jiri Donkervoort the Barbarian,
Ophelia Stoll the Warlock,
and Su Biddercombe the Monk`
	fiveFiveThree := `Patrick Took-Took the Barbarian,
Susan Monroe the Ranger,
Bogdan Ford the Warlock,
Dioscoro Bryant the Wizard,
and Svatava Felten the Rogue`
	testCases := []struct{
		runPath string
		story int
		want string
	}{
		{"./run_examples/5.0.json", 0, fiveZero},
		{"./run_examples/5.1.json", 2, fiveOne},
		{"./run_examples/5.2.json", 4, fiveTwo},
		{"./run_examples/5.3.json", 3, fiveThree},
		{"./run_examples/5.4.json", 3, fiveFour},
		{"./run_examples/5.5.json", 2, fiveFive},
		{"./run_examples/5.5.json", 3, fiveFiveThree},
	}

	for _, tc := range testCases {
		run, err := makeTestRun(tc.runPath)
		if err != nil {
			t.Fatalf("Make test run error: %v", err)
		}
		textParts := run.Stories[tc.story].RichText.Beginning
		got, err := findAdventurers(textParts, makeAdventurersByName(run))
		if got != tc.want || err != nil {
			t.Fatalf("Want: '%v', %v\n Got: '%v', %v", tc.want, nil, got, err)
		}
	}
}

func TestFindGuildname(t *testing.T) {
	testCases := []struct{
		runPath string
		story int
		want string
	}{
		{"./run_examples/5.0.json", 0, "Platinum Branch Club"},
		{"./run_examples/5.1.json", 2, "Cherished Heart Temple"},
		{"./run_examples/5.2.json", 4, "Union of Scientists"},
		{"./run_examples/5.3.json", 3, "Zoanthropic Lodge"},
		{"./run_examples/5.4.json", 3, "Zoanthropic Lodge"},
		{"./run_examples/5.5.json", 2, "Cherished Heart Temple"},
		{"./run_examples/5.5.json", 3, "Zoanthropic Lodge"},
	}

	for _, tc := range testCases {
		run, err := makeTestRun(tc.runPath)
		if err != nil {
			t.Fatalf("Make test run error: %v", err)
		}
		textParts := run.Stories[tc.story].RichText.Beginning
		got, err := findGuildName(textParts)
		if got != tc.want || err != nil {
			t.Fatalf("Want: '%v', %v\n Got: '%v', %v", tc.want, nil, got, err)
		}
	}
}

func TestMakeQuestText(t *testing.T) {
	testCases := []struct{
		runPath string
		story int
		want string
	}{
		{
			"./run_examples/5.0.json",
			0,
			"defend the nocturnal, jovial outskirts \"Vivisected Ellishment\"",
		},
		{
			"./run_examples/5.1.json",
			2,
			"explore the entrancing maze",
		},
		{
			"./run_examples/5.2.json",
			4,
			"befriend the sharp, ferocious priest \"Blistered Hunter\"",
		},
		{
			"./run_examples/5.3.json",
			3,
			"befriend the voracious, irresistible fiend",
		},
		{
			"./run_examples/5.4.json",
			3,
			"befriend the entrancing, grotesque fiend",
		},
		{
			"./run_examples/5.5.json",
			2,
			"defeat the voracious, ancient swarm \"Blistered Butcher\"",
		},
		{
			"./run_examples/5.5.json",
			3,
			"befriend the violent, reknowned priest",
		},
	}

	for _, tc := range testCases {
		run, err := makeTestRun(tc.runPath)
		if err != nil {
			t.Fatalf("Make test run error: %v", err)
		}
		textParts := run.Stories[tc.story].RichText.Beginning
		got, err := makeQuestText(textParts)
		if got != tc.want || err != nil {
			t.Fatalf("Want: '%v', %v\n Got: '%v', %v", tc.want, nil, got, err)
		}
	}
}

func TestFindQuestConjunctive(t *testing.T) {
		testCases := []struct{
		runPath string
		story int
		want string
	}{
		{"./run_examples/5.0.json", 0, "the"},
		{"./run_examples/5.1.json", 2, "the"},
		{"./run_examples/5.2.json", 4, "the"},
		{"./run_examples/5.3.json", 3, "the"},
		{"./run_examples/5.4.json", 3, "the"},
		{"./run_examples/5.5.json", 2, "the"},
		{"./run_examples/5.5.json", 3, "the"},
	}

	for _, tc := range testCases {
		run, err := makeTestRun(tc.runPath)
		if err != nil {
			t.Fatalf("Make test run error: %v", err)
		}
		textParts := run.Stories[tc.story].RichText.Beginning
		got, err := findQuestConjunctive(textParts)
		if got != tc.want || err != nil {
			t.Fatalf("Want: '%v', %v\n Got: '%v', %v", tc.want, nil, got, err)
		}
	}
}

func TestFindQuestObjective(t *testing.T) {
		testCases := []struct{
		runPath string
		story int
		want string
	}{
		{"./run_examples/5.0.json", 0, "outskirts"},
		{"./run_examples/5.1.json", 2, "maze"},
		{"./run_examples/5.2.json", 4, "priest"},
		{"./run_examples/5.3.json", 3, "fiend"},
		{"./run_examples/5.4.json", 3, "fiend"},
		{"./run_examples/5.5.json", 2, "swarm"},
		{"./run_examples/5.5.json", 3, "priest"},
	}

	for _, tc := range testCases {
		run, err := makeTestRun(tc.runPath)
		if err != nil {
			t.Fatalf("Make test run error: %v", err)
		}
		textParts := run.Stories[tc.story].RichText.Beginning
		got, err := findQuestObjective(textParts)
		if got != tc.want || err != nil {
			t.Fatalf("Want: '%v', %v\n Got: '%v', %v", tc.want, nil, got, err)
		}
	}
}
