package main

import (
	"fmt"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	password := "F0r3st40!"
	hash := "$2a$10$M9.3AYd5CONwYXlgmFvPJu/Ord4VtWH8h9o7Gqa7dtb67wiCBhFnK"
	
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	if err != nil {
		fmt.Printf("Password does not match: %v\n", err)
	} else {
		fmt.Println("Password matches!")
	}
}