package models

import (
	"encoding/json"
	"time"

	"github.com/gobuffalo/nulls"
	"github.com/gobuffalo/pop"
	"github.com/gobuffalo/validate"
	"github.com/gobuffalo/validate/validators"
	"github.com/gofrs/uuid"
)

// Route is used by pop to map your .model.Name.Proper.Pluralize.Underscore database table to your go code.
type Route struct {
	ID            uuid.UUID    `json:"id" db:"id"`
	UserID        uuid.UUID    `json:"-" db:"user_id"`
	User          User         `json:"-" belongs_to:"user"`
	Waypoints     Waypoints    `has_many:"waypoints" order_by:"sequence asc" json:"waypoints"`
	Name          string       `json:"name" db:"name"`
	Public        bool         `json:"public" db:"public"`
	FinishMessage nulls.String `json:"finish_message" db:"finish_message"`
	CreatedAt     time.Time    `json:"created_at" db:"created_at"`
	UpdatedAt     time.Time    `json:"updated_at" db:"updated_at"`
}

// String is not required by pop and may be deleted
func (r Route) String() string {
	jr, _ := json.Marshal(r)
	return string(jr)
}

// Routes is not required by pop and may be deleted
type Routes []Route

// String is not required by pop and may be deleted
func (r Routes) String() string {
	jr, _ := json.Marshal(r)
	return string(jr)
}

// Validate gets run every time you call a "pop.Validate*" (pop.ValidateAndSave, pop.ValidateAndCreate, pop.ValidateAndUpdate) method.
// This method is not required and may be deleted.
func (r *Route) Validate(tx *pop.Connection) (*validate.Errors, error) {
	return validate.Validate(
		&validators.StringIsPresent{Field: r.Name, Name: "Name"},
	), nil
}

// ValidateCreate gets run every time you call "pop.ValidateAndCreate" method.
// This method is not required and may be deleted.
func (r *Route) ValidateCreate(tx *pop.Connection) (*validate.Errors, error) {
	return validate.NewErrors(), nil
}

// ValidateUpdate gets run every time you call "pop.ValidateAndUpdate" method.
// This method is not required and may be deleted.
func (r *Route) ValidateUpdate(tx *pop.Connection) (*validate.Errors, error) {
	return validate.NewErrors(), nil
}
