// types for Login
import React from "react";

type Errors = {
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
}

type SubmitTypes = {
    e:React.MouseEvent<HTMLButtonElement, MouseEvent>
    emailRef: React.RefObject<HTMLInputElement>
    passwordRef: React.RefObject<HTMLInputElement>,
    usernameRef: React.RefObject<HTMLInputElement>,
    confirmPasswordRef: React.RefObject<HTMLInputElement>,
    setErrors: React.Dispatch<React.SetStateAction<Errors>>,
    url:string,
    setShowPopup: React.Dispatch<React.SetStateAction<boolean>>,
    setPopupMessage: React.Dispatch<React.SetStateAction<string>>,
}

export type {Errors,SubmitTypes}
