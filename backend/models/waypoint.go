package models

import (
	"encoding/json"
	"github.com/gobuffalo/nulls"
	"github.com/gobuffalo/pop"
	"github.com/gobuffalo/validate"
	"github.com/gofrs/uuid"
	"time"
	"github.com/gobuffalo/validate/validators"
)
// Waypoint is used by pop to map your .model.Name.Proper.Pluralize.Underscore database table to your go code.
type Waypoint struct {
    ID uuid.UUID `json:"id" db:"id"`
    Name string `json:"name" db:"name"`
    Question nulls.String `json:"question" db:"question"`
    Answer nulls.String `json:"answer" db:"answer"`
    Point nulls.Int `json:"point" db:"point"`
    Zoom nulls.Float64 `json:"zoom" db:"zoom"`
    Maptype nulls.String `json:"maptype" db:"maptype"`
    CreatedAt time.Time `json:"created_at" db:"created_at"`
    UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}

// String is not required by pop and may be deleted
func (w Waypoint) String() string {
	jw, _ := json.Marshal(w)
	return string(jw)
}

// Waypoints is not required by pop and may be deleted
type Waypoints []Waypoint

// String is not required by pop and may be deleted
func (w Waypoints) String() string {
	jw, _ := json.Marshal(w)
	return string(jw)
}

// Validate gets run every time you call a "pop.Validate*" (pop.ValidateAndSave, pop.ValidateAndCreate, pop.ValidateAndUpdate) method.
// This method is not required and may be deleted.
func (w *Waypoint) Validate(tx *pop.Connection) (*validate.Errors, error) {
	return validate.Validate(
		&validators.StringIsPresent{Field: w.Name, Name: "Name"},
	), nil
}

// ValidateCreate gets run every time you call "pop.ValidateAndCreate" method.
// This method is not required and may be deleted.
func (w *Waypoint) ValidateCreate(tx *pop.Connection) (*validate.Errors, error) {
	return validate.NewErrors(), nil
}

// ValidateUpdate gets run every time you call "pop.ValidateAndUpdate" method.
// This method is not required and may be deleted.
func (w *Waypoint) ValidateUpdate(tx *pop.Connection) (*validate.Errors, error) {
	return validate.NewErrors(), nil
}
