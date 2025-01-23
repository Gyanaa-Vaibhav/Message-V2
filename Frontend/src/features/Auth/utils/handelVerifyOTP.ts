import React from "react";

type Props = {
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
    setShowError: React.Dispatch<React.SetStateAction<boolean>>,
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
    OPTData:number,
    email:string,
}

const url = import.meta.env.VITE_SERVER_IP ? import.meta.env.VITE_SERVER_IP+'/login' : '/login';

export default function handelVerifyOTP({setErrorMessage,setShowError,OPTData,email,setErrors,errors}:Props){
    fetch(url,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            otpExists:true,
            otp:OPTData,
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
            if(data.success){
                localStorage.setItem('accessToken',data.accessToken)
                localStorage.setItem('privateKey',data.privateKey)
                localStorage.setItem('publicKey',data.publicKey)
                window.location.href = '/chat';
            }
            if(!data.success){
                setErrors({...errors,otp:data.message})
            }
        })
        .catch((error) => {
            console.error('Fetch error:', error)
            setErrorMessage('Error Please try again.');
            setShowError(true);
        });
}