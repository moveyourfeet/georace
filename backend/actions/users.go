package actions

import (
	"backend/models"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
	"time"

	"github.com/pkg/errors"

	"golang.org/x/crypto/bcrypt"

	"github.com/badoux/checkmail"
	jwt "github.com/dgrijalva/jwt-go"
	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/envy"
	"github.com/gobuffalo/pop"
	"github.com/sirupsen/logrus"
)

// UsersCreate registers a new user with the application.
func UsersCreate(c buffalo.Context) error {
	u := &LoginRequest{}
	if err := c.Bind(u); err != nil {
		return errors.WithStack(err)
	}

	c.Logger().Infof("User pass: %v", u.Password)

	user := &models.User{
		Email:                u.Email,
		Password:             u.Password,
		PasswordConfirmation: u.Password,
	}

	tx := c.Value("tx").(*pop.Connection)
	verrs, err := user.Create(tx)
	if err != nil {
		return errors.WithStack(err)
	}

	if verrs.HasAny() {
		c.Set("user", user)
		c.Set("errors", verrs)
		return c.Render(400, r.JSON(verrs))
	}

	c.Session().Set("current_user_id", user.ID)

	// newUser, err := getUser(c, user.Email)
	// if err != nil {
	// 	return c.Error(404, err)
	// }

	return c.Render(200, r.JSON(user))
}

// LoginRequest represents a login form.
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// UsersLogin perform a login with the given credentials.
func UsersLogin(c buffalo.Context) error {

	var req LoginRequest
	err := c.Bind(&req)

	if err != nil {
		return c.Error(http.StatusUnauthorized, err)
	}

	pwd := req.Password
	if len(pwd) == 0 {
		return c.Error(http.StatusUnauthorized, errors.New("Invalid password"))
	}

	email := req.Email
	if checkmail.ValidateFormat(email) != nil {
		return c.Error(http.StatusUnauthorized, errors.New("Invalid email"))
	}

	u, err := getUser(c, email)

	if err != nil {
		c.Logger().Errorf("Error :%v", err)
		return c.Error(http.StatusUnauthorized, errors.New("Login failed"))
	}

	pwdCompare := bcrypt.CompareHashAndPassword([]byte(u.PasswordHash), []byte(pwd))
	if pwdCompare != nil {
		c.Logger().Errorf("Error :%v", pwdCompare)

		return c.Error(http.StatusUnauthorized, errors.New("Login failed"))
	}

	claims := jwt.StandardClaims{
		ExpiresAt: time.Now().Add(oneWeek()).Unix(),
		Issuer:    fmt.Sprintf("%s.api.go-with-jwt.it", envy.Get("GO_ENV", "development")),
		Id:        u.ID.String(),
	}
	c.Logger().Infof("Claims: %#v", claims)

	signingKey, err := ioutil.ReadFile(envy.Get("JWT_KEY_PATH", ""))

	if err != nil {
		return fmt.Errorf("could not open jwt key, %v", err)
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString(signingKey)

	if err != nil {
		return fmt.Errorf("could not sign token, %v", err)
	}

	return c.Render(200, r.JSON(map[string]string{"token": tokenString}))
}

// UsersMe default implementation.
func UsersMe(c buffalo.Context) error {
	return c.Render(200, r.JSON(c.Value("user")))
}

func getUser(c buffalo.Context, email string) (*models.User, error) {
	tx := c.Value("tx").(*pop.Connection)

	u := &models.User{}
	if err := tx.Where("email = ?", email).First(u); err != nil {
		return nil, err
	}
	return u, nil
}

func getUserByID(c buffalo.Context, id string) (*models.User, error) {
	tx := c.Value("tx").(*pop.Connection)

	u := &models.User{}
	if err := tx.Find(u, id); err != nil {
		return nil, err
	}

	return u, nil
}

func oneWeek() time.Duration {
	return 7 * 24 * time.Hour
}

func encryptPassword(p string) string {
	pwd, err := bcrypt.GenerateFromPassword([]byte(strings.TrimSpace(p)), 8)

	if err != nil {
		panic("could not encrypt password")
	}

	return string(pwd)
}

// RestrictedHandlerMiddleware searches and parses the jwt token in order to authenticate
// the request and populate the Context with the user contained in the claims.
func RestrictedHandlerMiddleware(next buffalo.Handler) buffalo.Handler {
	return func(c buffalo.Context) error {
		tokenString := c.Request().Header.Get("Authorization")

		if len(tokenString) == 0 {
			return c.Error(http.StatusUnauthorized, fmt.Errorf("No token set in headers"))
		}

		// parsing token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
			}

			// key
			mySignedKey, err := ioutil.ReadFile(envy.Get("JWT_KEY_PATH", ""))

			if err != nil {
				return nil, fmt.Errorf("could not open jwt key, %v", err)
			}

			return mySignedKey, nil
		})

		if err != nil {
			return c.Error(http.StatusUnauthorized, fmt.Errorf("Could not parse the token, %v", err))
		}

		// getting claims
		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {

			logrus.Errorf("claims: %v", claims)

			// retrieving user from db
			u, err := getUserByID(c, claims["jti"].(string))
			c.Logger().Infof("User: %#v err %v ", u, err)

			if err != nil {
				return c.Error(http.StatusUnauthorized, fmt.Errorf("Could not identify the user"))
			}

			c.Set("user", u)

		} else {
			return c.Error(http.StatusUnauthorized, fmt.Errorf("Failed to validate token: %v", claims))
		}

		return next(c)
	}
}
