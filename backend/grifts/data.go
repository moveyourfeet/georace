package grifts

import (
	"backend/models"

	"github.com/gobuffalo/nulls"
)

var p16GlRyeTilSletten = &models.Route{
	Name: "P16 - Gruppernes døgn hjem Gl. Rye til Sletten",
	Waypoints: models.Waypoints{
		models.Waypoint{
			Name:      "Start",
			Latitude:  56.0644421565535,
			Longitude: 9.698996543884277,
			Sequence:  1,
		},
		models.Waypoint{
			Name:      "Levende post 1",
			Latitude:  56.072898974725234,
			Longitude: 9.69843864440918,
			Sequence:  2,
		},
		models.Waypoint{
			Name:      "Død post 1",
			Latitude:  56.08118690447029,
			Longitude: 9.700241088867188,
			Sequence:  3,
		},
		models.Waypoint{
			Name:      "Levende post 2",
			Latitude:  56.09495666016405,
			Longitude: 9.683504104614258,
			Sequence:  4,
		},
		models.Waypoint{
			Name:      "Død post 2",
			Latitude:  56.10721025879223,
			Longitude: 9.66820478439331,
			Sequence:  5,
		},
		models.Waypoint{
			Name:      "Slut",
			Latitude:  56.1141228061977,
			Longitude: 9.665007591247559,
			Sequence:  6,
		},
	},
}

var p16GruppernesDoegn = &models.Route{
	Name: "P16 - Gruppernesdøgn",
	Waypoints: models.Waypoints{
		models.Waypoint{
			Maptype:   nulls.NewString("mapbox.outdoors"),
			Name:      "Start",
			Latitude:  56.11379919173178,
			Longitude: 9.664106369018555,
			Sequence:  1,
		},
		models.Waypoint{
			Maptype:   nulls.NewString("mapbox.outdoors"),
			Name:      "Stafet-mad-løb",
			Latitude:  56.10524425129115,
			Longitude: 9.684898853302002,
			Sequence:  2,
		},
		models.Waypoint{
			Maptype:   nulls.NewString("mapbox.outdoors"),
			Name:      "Holdinddelingspost",
			Latitude:  56.08856442919592,
			Longitude: 9.750280380249023,
			Sequence:  3,
		},
		models.Waypoint{
			Maptype:   nulls.NewString("mapbox.outdoors"),
			Name:      "Snapchat spor",
			Latitude:  56.0916720961376,
			Longitude: 9.759807586669922,
			Sequence:  4,
		},
		models.Waypoint{
			Maptype:   nulls.NewString("mapbox.outdoors"),
			Name:      "Aftensmad",
			Latitude:  56.0670528829621,
			Longitude: 9.741783142089844,
			Sequence:  5,
		},
		models.Waypoint{
			Maptype:   nulls.NewString("mapbox.outdoors"),
			Name:      "Kallehave",
			Latitude:  56.06147066039463,
			Longitude: 9.697226285934448,
			Sequence:  6,
		},
		models.Waypoint{
			Maptype:   nulls.NewString("mapbox.outdoors"),
			Name:      "Flyveplads",
			Latitude:  56.06489675545834,
			Longitude: 9.698857069015503,
			Sequence:  7,
		},
		models.Waypoint{
			Maptype:   nulls.NewString("mapbox.outdoors"),
			Name:      "Gl. Ry kreds",
			Latitude:  56.06447749443971,
			Longitude: 9.698739051818848,
			Sequence:  8,
		},
	},
}
