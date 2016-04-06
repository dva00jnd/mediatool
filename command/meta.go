package command

import (
	"github.com/media-tool/mediatool/mediatool"
	"github.com/mitchellh/cli"
	"github.com/mitchellh/colorstring"
)

// Meta are the meta-options that are available on all or most commands.
type Meta struct {
	Color       bool
	ContextOpts *mediatool.ContextOpts
	UI          cli.Ui

	dataDir string

	color bool
	oldUI cli.Ui

	parallelism int
}

// Colorize returns the colorization structure for a command.
func (m *Meta) Colorize() *colorstring.Colorize {
	return &colorstring.Colorize{
		Colors:  colorstring.DefaultColors,
		Disable: !m.color,
		Reset:   true,
	}
}

// process will process the meta-parameters out of the arguments. This
// will potentially modify the args in-place. It will return the result.
func (m *Meta) process(args []string) []string {
	// We do this so that we retain the ability to technically call
	// process multiple times, even if we have no plans to do so
	if m.oldUI != nil {
		m.UI = m.oldUI
	}

	// Set colorization
	m.color = m.Color
	for i, v := range args {
		if v == "-no-color" {
			m.color = false
			m.Color = false
			args = append(args[:i], args[i+1:]...)
			break
		}
	}

	// Set the UI
	m.oldUI = m.UI
	m.UI = &cli.ConcurrentUi{
		Ui: &ColorizeUI{
			Colorize:   m.Colorize(),
			ErrorColor: "[red]",
			WarnColor:  "[yellow]",
			UI:         m.oldUI,
		},
	}

	return args
}
