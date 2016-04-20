package config

import (
	"encoding/json"
	"fmt"
	"io/ioutil"

	"github.com/ghodss/yaml"
)

type Config struct {
	LibraryConfigs map[string]*LibraryConfig `yaml:"libraries"`
}

func NewConfigFromFile(path string) (error, *Config) {
	data, err := ioutil.ReadFile(path)
	if err != nil {
		return err, nil
	}

	var config Config
	err = yaml.Unmarshal(data, &config)
	if err != nil {
		return err, nil
	}

	return nil, &config
}

func (c *Config) UnmarshalJSON(b []byte) error {
	err := json.Unmarshal(b, c)
	if err != nil {
		return err
	}

	for id, library := range c.LibraryConfigs {
		fmt.Println(id)
		library.ID = id
	}

	return nil
}
