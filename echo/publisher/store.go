package publisher

import (
	"time"
	"encoding/json"
	"os"
	"fmt"
	"errors"
	"path"
)

type PublisherStore interface {
	Now() time.Time

	Set(key string, value ScriptResult) error
	Get(key string) (ScriptResult, error)

	LatestBlockTimeAsOf(t time.Time) (time.Time, error)
	NextBlockTimeAsOf(t time.Time) (time.Time, error)
}

type EthLocalStore struct {
	path string
	ethProvider string
}

func NewEthLocalStore(path string, ethProvider string) EthLocalStore {
	return EthLocalStore{path, ethProvider}
}

func (els *EthLocalStore) Now() time.Time {
	return time.Now()
}

func (els *EthLocalStore) getKeyPath(key string) string {
	fileName := fmt.Sprintf("%v.json", key)
	return path.Join(els.path, fileName)
}

func (els *EthLocalStore) Set(key string, value ScriptResult) error {
	data, err := json.Marshal(value); if err != nil {
		return err
	}
	return os.WriteFile(els.getKeyPath(key), data, 0644)
}

func (els *EthLocalStore) Get(key string) (ScriptResult, error) {
	data, err := os.ReadFile(els.getKeyPath(key)); if err != nil {
		return ScriptResult{}, err
	}
	var result ScriptResult
	if err := json.Unmarshal(data, &result); err != nil {
		return ScriptResult{}, err
	}
	return result, nil
}

func (els *EthLocalStore) LatestBlockTimeAsOf(t time.Time) (time.Time, error) {
	return time.Now().Add(-100), nil
}

func (els *EthLocalStore) NextBlockTimeAsOf(t time.Time) (time.Time, error) {
	return time.Now().Add(100), nil
}

type MockStore struct {
	mockNow time.Time
	state map[string]ScriptResult
	pub *Publisher
}

func (ms *MockStore) Publisher() *Publisher {
	return ms.pub
}

func (ms *MockStore) Now() time.Time {
	return ms.mockNow
}

func (ms *MockStore) setTime(t time.Time) {
	ms.mockNow = t
}

func (ms *MockStore) Set(key string, value ScriptResult) error {
	ms.state[key] = value
	return nil
}

func (ms *MockStore) Get(key string) (ScriptResult, error) {
	if val, ok := ms.state[key]; ok {
		return val, nil
	}
	return ScriptResult{}, errors.New("Key not found")
}

func (ms *MockStore) NextBlockTimeAsOf(t time.Time) (time.Time, error) {
	// There is a block at 0, 10, 20, 40, 40, 50, 60, 70, 80, and 90
	switch {
	case t.After(time.Unix(90, 0)):
		return time.Time{}, errors.New("No next block yet")
	case t.After(time.Unix(80, 0)):
		return time.Unix(90, 0), nil
	case t.After(time.Unix(70, 0)):
		return time.Unix(80, 0), nil
	case t.After(time.Unix(60, 0)):
		return time.Unix(70, 0), nil
	case t.After(time.Unix(50, 0)):
		return time.Unix(60, 0), nil
	case t.After(time.Unix(40, 0)):
		return time.Unix(50, 0), nil
	case t.After(time.Unix(30, 0)):
		return time.Unix(40, 0), nil
	case t.After(time.Unix(20, 0)):
		return time.Unix(30, 0), nil
	case t.After(time.Unix(10, 0)):
		return time.Unix(20, 0), nil
	case t.After(time.Unix(0, 0)):
		return time.Unix(10, 0), nil
	default:
		return time.Unix(0, 0), nil
	}
}

func (ms *MockStore) LatestBlockTimeAsOf(t time.Time) (time.Time, error) {
	// There is a block at 0, 10, 20, 40, 40, 50, 60, 70, 80, and 90
	switch {
	case t.Before(time.Unix(0, 0)):
		return time.Time{}, errors.New("No previous blocks")
	case t.Before(time.Unix(10, 0)):
		return time.Unix(0, 0), nil
	case t.Before(time.Unix(20, 0)):
		return time.Unix(10, 0), nil
	case t.Before(time.Unix(30, 0)):
		return time.Unix(20, 0), nil
	case t.Before(time.Unix(40, 0)):
		return time.Unix(30, 0), nil
	case t.Before(time.Unix(50, 0)):
		return time.Unix(40, 0), nil
	case t.Before(time.Unix(60, 0)):
		return time.Unix(50, 0), nil
	case t.Before(time.Unix(70, 0)):
		return time.Unix(60, 0), nil
	case t.Before(time.Unix(80, 0)):
		return time.Unix(70, 0), nil
	case t.Before(time.Unix(90, 0)):
		return time.Unix(80, 0), nil
	default:
		return time.Unix(90, 0), nil
	}
}

func (ms *MockStore) GetFullStateForTest() map[string]ScriptResult {
	return ms.state
}

