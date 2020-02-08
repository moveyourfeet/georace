package grifts

import (
	"backend/models"
	"bufio"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/markbates/grift/grift"
	"github.com/pkg/errors"
)

var _ = grift.Namespace("db", func() {

	grift.Desc("truncate", "truncates a database")
	grift.Add("truncate", func(c *grift.Context) error {
		s := read("This will truncate the database!!! Are you sure? (y/N)")

		if s == "y" || s == "yes" {
			// Add DB seeding stuff here
			if err := models.DB.TruncateAll(); err != nil {
				return errors.WithStack(err)
			}
		}
		return nil
	})

	grift.Desc("clean", "cleans a database")
	grift.Add("clean", func(c *grift.Context) error {
		s := read("This will clean the database!!! Are you sure? (y/N)")

		if s == "y" || s == "yes" {

			waypoints := &models.Waypoints{}
			if err := models.DB.All(waypoints); err != nil {
				return errors.WithStack(err)
			}
			for _, v := range *waypoints {
				models.DB.Destroy(&v)
			}

			routes := &models.Routes{}
			if err := models.DB.All(routes); err != nil {
				return errors.WithStack(err)
			}
			for _, v := range *routes {
				models.DB.Destroy(&v)

			}
		}
		return nil
	})

	grift.Desc("seed", "Seeds a database")
	grift.Add("seed", func(c *grift.Context) error {

		u1, err := createUser("1@test.com")
		if err != nil {
			return err
		}
		_ = u1
		u2, err := createUser("2@test.com")
		if err != nil {
			return err
		}
		_ = u2

		if err := createRoute(u1, p16GlRyeTilSletten); err != nil {
			return errors.WithStack(err)
		}
		if err := createRoute(u2, p16GruppernesDoegn); err != nil {
			return errors.WithStack(err)
		}

		return nil
	})

})

func createUser(email string) (*models.User, error) {
	user := &models.User{
		Email:                email,
		Password:             "password",
		PasswordConfirmation: "password",
	}
	_, err := user.Create(models.DB)
	if err != nil {
		return nil, err
	}
	models.DB.Where("email = ?", email).First(user)
	return user, nil
}

func createRoute(u *models.User, route *models.Route) error {
	route.User = *u
	route.Name = u.Email + " - " + route.Name
	log.Printf("User : %#v", u)
	if err := models.DB.Create(route); err != nil {
		return errors.WithStack(err)
	}

	for _, wp := range route.Waypoints {
		wp.RouteID = route.ID
		if err := models.DB.Create(&wp); err != nil {
			return errors.WithStack(err)
		}
	}

	return nil
}

func read(info string) string {
	reader := bufio.NewReader(os.Stdin)
	fmt.Print(info + ": ")
	text, _ := reader.ReadString('\n')
	fmt.Println(text)
	text = strings.TrimSuffix(text, "\n")
	return text
}
