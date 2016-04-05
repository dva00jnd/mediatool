package main

import "github.com/mitchellh/cli"

// Commands is the mapping of all available commands
var Commands map[string]cli.CommandFactory

// ErrorPrefix and OutputPrefix control the destination of log message
const (
	ErrorPrefix  = "e:"
	OutputPrefix = "o:"
)
