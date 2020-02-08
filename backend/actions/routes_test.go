package actions

import (
	"backend/models"
	"encoding/json"
	"net/http"

	"github.com/pkg/errors"
)

func (as *ActionSuite) createRoute(user *models.User, route *models.Route) (*models.Route, error) {
	route.User = *user
	if err := as.DB.Create(route); err != nil {
		return nil, errors.WithStack(err)
	}

	for _, wp := range route.Waypoints {
		wp.RouteID = route.ID
		if err := as.DB.Create(&wp); err != nil {
			return nil, errors.WithStack(err)
		}
	}
	return route, nil
}

func (as *ActionSuite) Test_RouteResource_List() {

	mark, err := as.createUser("mark")
	as.NoError(err)
	peter, err := as.createUser("peter")
	as.NoError(err)

	as.createRoute(mark, &models.Route{
		Name: "marks",
	})
	as.createRoute(peter, &models.Route{
		Name: "peters",
	})

	tc := []struct {
		ExpectedRoute    string
		NotExpectedRoute string
		Status           int
		User             *models.User
		Identifier       string
	}{
		{"marks", "peters", http.StatusOK, mark, "Marks Routes"},
		{"peters", "marks", http.StatusOK, peter, "Peters Routes"},
	}

	for _, t := range tc {
		as.Run(t.Identifier, func() {
			count, err := as.DB.Count("routes")
			as.NoError(err)
			as.Equal(2, count)

			token, err := as.login(t.User)
			if err != nil {
				as.Fail("Login failed")
			}

			req := as.JSON("/v1/routes")
			req.Headers["Authorization"] = token

			res := req.Get()

			as.Equal(t.Status, res.Code)
			body := res.Body.String()

			as.Contains(body, t.ExpectedRoute)
			as.NotContains(body, t.NotExpectedRoute)
			count, err = as.DB.Where("user_id = ?", t.User.ID).Count("routes")
			as.NoError(err)
			as.Equal(1, count)
		})
	}
}

func (as *ActionSuite) Test_RouteResource_Show() {

	mark, err := as.createUser("mark")
	as.NoError(err)
	peter, err := as.createUser("peter")
	as.NoError(err)

	routeMark, _ := as.createRoute(mark, &models.Route{
		Name: "marks",
	})
	routePeter, _ := as.createRoute(peter, &models.Route{
		Name: "peters",
	})

	tc := []struct {
		Status     int
		User       *models.User
		Route      *models.Route
		Identifier string
	}{
		{http.StatusOK, mark, routeMark, "Marks Routes ok"},
		{http.StatusOK, peter, routePeter, "Peters Routes ok"},
		{http.StatusNotFound, peter, routeMark, "Peters Routes not found"},
		{http.StatusNotFound, mark, routePeter, "Peters Routes not found"},
	}

	for _, t := range tc {
		as.Run(t.Identifier, func() {
			count, err := as.DB.Count("routes")
			as.NoError(err)
			as.Equal(2, count)

			token, err := as.login(t.User)
			if err != nil {
				as.Fail("Login failed")
			}

			req := as.JSON("/v1/routes/" + t.Route.ID.String())
			req.Headers["Authorization"] = token
			res := req.Get()

			as.Equal(t.Status, res.Code)

			body := res.Body.String()
			if t.Status == http.StatusNotFound {
				as.Contains(body, "no rows in result set")
				return
			}

			as.Contains(body, t.Route.Name)
		})
	}
}

func (as *ActionSuite) Test_RouteResource_Create() {
	mark, err := as.createUser("mark")
	as.NoError(err)
	peter, err := as.createUser("peter")
	as.NoError(err)

	tc := []struct {
		Name       string
		Status     int
		User       *models.User
		Identifier string
	}{
		{"route 1", http.StatusCreated, mark, "New User"},
		{"route 2", http.StatusCreated, peter, "Invalid email"},
	}

	for _, t := range tc {
		as.Run(t.Identifier, func() {
			count, err := as.DB.Where("user_id = ?", t.User.ID).Count("routes")
			as.NoError(err)
			as.Equal(0, count)

			token, err := as.login(t.User)
			if err != nil {
				as.Fail("Login failed")
			}

			req := as.JSON("/v1/routes")
			req.Headers["Authorization"] = token

			res := req.Post(&models.Route{
				Name: t.Name,
			})

			as.Equal(t.Status, res.Code)
			body := res.Body.String()

			as.Contains(body, t.Name)
			count, err = as.DB.Where("user_id = ?", t.User.ID).Count("routes")
			as.NoError(err)
			as.Equal(1, count)

		})
	}
}

func (as *ActionSuite) Test_RouteResource_Update() {
	// as.Fail("Not Implemented!")
}

func (as *ActionSuite) Test_RouteResource_Destroy() {
	// as.Fail("Not Implemented!")
}

func (as *ActionSuite) login(user *models.User) (string, error) {
	res := as.JSON("/v1/auth/login").Post(LoginRequest{
		Email:    user.Email,
		Password: "password",
	})

	as.Equal(http.StatusOK, res.Code)

	var response map[string]string
	json.Unmarshal(res.Body.Bytes(), &response)

	as.True(len(response["token"]) > 0)
	return response["token"], nil
}
