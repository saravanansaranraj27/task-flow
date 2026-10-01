package service

import "errors"

var (
	ErrTitleRequired              = errors.New("title is required")
	ErrRegistrationFieldsRequired = errors.New("name, email, and password are required")
	ErrPasswordTooShort           = errors.New("password must be at least 6 characters")
)
