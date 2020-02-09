package actions

import (
	"backend/models"
	"encoding/json"
	"net/http"
)

func (as *ActionSuite) createUser(name string) (*models.User, error) {
	u := &models.User{
		Email:                name + "@example.com",
		Password:             "password",
		PasswordConfirmation: "password",
	}

	verrs, err := u.Create(as.DB)
	as.False(verrs.HasAny())

	return u, err
}

func (as *ActionSuite) Test_Users_Create() {

	tcases := []struct {
		Email                string
		Password             string
		PasswordConfirmation string
		Status               int
		Identifier           string
	}{
		{"noexist@example.com", "password", "password", http.StatusOK, "New User"},
		{"noexist@..@", "password", "password", http.StatusBadRequest, "is not a valid email"},
		{"noexist2@example.com", "", "", http.StatusBadRequest, "Password can not be blank."},
		{"noexist3@example.com", "password", "passw0rd", http.StatusBadRequest, "Password does not match confirmation"},
	}

	for _, tcase := range tcases {
		as.Run(tcase.Identifier, func() {
			res := as.JSON("/v1/users").Post(NewUserRequest{
				Email:                tcase.Email,
				Password:             tcase.Password,
				PasswordConfirmation: tcase.PasswordConfirmation,
			})

			as.Equal(tcase.Status, res.Code)
			body := res.Body.String()

			if tcase.Status == http.StatusBadRequest {
				as.Contains(body, tcase.Identifier)

				as.Contains(body, "error")
				return
			}

			as.NotContains(body, tcase.Password)
			as.Contains(body, tcase.Email)
		})
	}
}

func (as *ActionSuite) Test_Users_Login() {
	u, err := as.createUser("mark")
	as.NoError(err)

	tcases := []struct {
		Email      string
		Password   string
		Status     int
		Body       string
		Identifier string
	}{
		{u.Email, u.Password, http.StatusOK, "token", "Valid"},
		{"noexist@example.com", "password", http.StatusUnauthorized, "Login failed", "Email Does not exist"},
		{"noexist@..@", "password", http.StatusUnauthorized, "Invalid email", "Invalid email"},
		{u.Email, "", http.StatusUnauthorized, "Invalid password", "Password Missing"},
		{u.Email, "invalidPassword", http.StatusUnauthorized, "Login failed", "Invalid password"},
	}

	for _, tcase := range tcases {
		as.Run(tcase.Identifier, func() {
			res := as.JSON("/v1/auth/login").Post(LoginRequest{
				Email:    tcase.Email,
				Password: tcase.Password,
			})

			as.Equal(tcase.Status, res.Code)

			as.Contains(res.Body.String(), tcase.Body)
		})
	}
}

func (as *ActionSuite) Test_Users_Me() {
	u, err := as.createUser("mark")
	as.NoError(err)

	// table driven tests
	var tests = []struct {
		email              string
		password           string
		expectedStatusCode int
	}{
		{u.Email, u.Password, http.StatusOK},
		{"fake-email@email.you", "bad-pwd", http.StatusUnauthorized},
	}

	for _, t := range tests {
		res := as.JSON("/v1/auth/login").Post(LoginRequest{
			Email:    t.email,
			Password: t.password,
		})

		as.Equal(t.expectedStatusCode, res.Code)

		if t.expectedStatusCode == http.StatusUnauthorized {
			return
		}

		var response map[string]string
		json.Unmarshal(res.Body.Bytes(), &response)

		as.True(len(response["token"]) > 0)

		req := as.JSON("/v1/users/me")
		req.Headers["Authorization"] = response["token"]
		res = req.Get()

		as.Equal(http.StatusOK, res.Code)

		body := res.Body.String()
		as.Contains(body, t.email)
		as.NotContains(body, t.password)
	}

}
