package actions

import (
	"backend/models"
	"net/http"
)

func (as *ActionSuite) createUser() (*models.User, error) {
	u := &models.User{
		Email:                "mark@example.com",
		Password:             "password",
		PasswordConfirmation: "password",
	}

	verrs, err := u.Create(as.DB)
	as.False(verrs.HasAny())

	return u, err
}

func (as *ActionSuite) Test_Auth_Create() {
	u, err := as.createUser()
	as.NoError(err)

	tcases := []struct {
		Email      string
		Password   string
		Status     int
		Identifier string
	}{
		{u.Email, u.Password, http.StatusOK, "Valid"},
		{"noexist@example.com", "password", http.StatusUnauthorized, "Email Invalid"},
		{u.Email, "invalidPassword", http.StatusUnauthorized, "Password Invalid"},
	}

	for _, tcase := range tcases {
		as.Run(tcase.Identifier, func() {
			res := as.JSON("/v1/auth/login").Post(LoginRequest{
				Email:    tcase.Email,
				Password: tcase.Password,
			})

			as.Equal(tcase.Status, res.Code)
		})
	}
}
