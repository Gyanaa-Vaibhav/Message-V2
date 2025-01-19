import React from "react";
import decryptPrivateKey from "../../../shared/decryptPrivateKey.ts";

const validateEmail = (value:string):boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
};

const validatePassword = (value:string):boolean => {
    return value.length >= 8;
};

const privateKey = localStorage.getItem('privateKey')
// fetch(url).then(res => res.json()).then(data => console.log(data))  //Test Fetch

type Props = {
    e: React.MouseEvent<HTMLButtonElement>,
    emailRef:React.RefObject<HTMLInputElement>,
    passwordRef:React.RefObject<HTMLInputElement>,
    saltRef:React.RefObject<HTMLTextAreaElement>,
    setErrors: React.Dispatch<React.SetStateAction<{
        email: string,
        password: string
        keys: string
    }>>,
    showKeyInput:boolean,
    setShowError: React.Dispatch<React.SetStateAction<boolean>>,
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>
}

const url = import.meta.env.VITE_SERVER_IP ? import.meta.env.VITE_SERVER_IP+'/login' : '/login';

export function handelLoginSubmit({e,emailRef,passwordRef,saltRef,showKeyInput,setErrors,setShowError,setErrorMessage}:Props){
    e.preventDefault();
    if(!emailRef.current || !passwordRef.current) return;

    const emailError = validateEmail(emailRef.current.value) ? '' : 'Invalid email address';
    const passwordError = validatePassword(passwordRef.current.value) ? '' : 'Password must be at least 8 characters long';

    if (!emailError && !passwordError) {
        setErrors({ email: '', password: '' ,keys: ''});
    } else {
        setErrors({ email: emailError, password: passwordError, keys: ''});
        return
    }

    const body = showKeyInput
        ? {
            email: emailRef.current.value,
            password: passwordRef.current.value,
            salt: saltRef.current?.value,
            privateKey,
        }
        : {
            email: emailRef.current.value,
            password: passwordRef.current.value,
            privateKey,
        };

    function validate(data:any){
        if(data.password){
            setErrors({ email: '', password: data.message , keys: ''});
            setErrorMessage(data.message);
            setShowError(true);
        }
        if(data.email){
            setErrors({ email: data.message, password: passwordError , keys: ''});
            setErrorMessage(data.message)
            setShowError(true);
        }
        if(data.key){
            setErrors({ email: emailError, password: passwordError, keys: data.message})
            setErrorMessage(data.message)
            setShowError(true);
        }
        if(!passwordRef.current || !emailRef.current) return;

        if(data.decryptedKey){
            localStorage.setItem('privateKey', data.decryptedKey);
            console.log(decryptPrivateKey(data.decryptedKey,emailRef.current.value))
        }
    }

    fetch(url,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // Specify content type
        },
        body: JSON.stringify(body),
        credentials: 'include',
    })
        .then((response) => {
            if(response.status === 403){
                response.json().then(data => {
                    setErrors({email: emailError, password: passwordError, keys: data.message})
                    setErrorMessage(data.message)
                    setShowError(true);
                })
            }
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log(data)
            validate(data)
            if(data.success){
                localStorage.setItem('accessToken', data.accessToken);
                window.location.pathname = '/chat'; // Redirect to the home page
            }
        })
        .catch((error) => {
            console.error('Fetch error:', error)
            setErrorMessage('Error Please try again.');
            setShowError(true);
        });
}