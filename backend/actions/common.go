package actions

import (
	"backend/models"
	"errors"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop/v5"
)

func scope(c buffalo.Context) *pop.Query {
	tx, ok := c.Value("tx").(*pop.Connection)
	if !ok {
		c.Error(500, errors.New("no transaction found"))
	}
	user, ok := c.Value("user").(*models.User)
	if !ok {
		c.Error(500, errors.New("no user found"))
	}

	return tx.Where("user_id = ?", user.ID)
}

func currentUser(c buffalo.Context) *models.User {
	user, ok := c.Value("user").(*models.User)
	if !ok {
		c.Error(500, errors.New("no user found"))
	}
	return user
}
