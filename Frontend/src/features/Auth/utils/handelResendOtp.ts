import React from "react";

type Props = {
    email:string,
    password:string,
    errors: {
        email: string,
        password: string,
        otp: string
    },
    setErrors: React.Dispatch<React.SetStateAction<{
        email: string,
        password: string
        otp: string
    }>>,
}

const url = import.meta.env.VITE_SERVER_IP ? import.meta.env.VITE_SERVER_IP+'/login' : '/login';

export function handelResendOtp({email,password,errors,setErrors}:Props){
    fetch(url,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            password,
        }),
        credentials: 'include',
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log(data)
            if(data.success){
                setErrors({...errors,otp:''})
            }
        })
}