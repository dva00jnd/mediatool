package config

type LibraryConfig struct {
	ID   string `yaml:"-"`
	Root string `yaml:"root"`
}
