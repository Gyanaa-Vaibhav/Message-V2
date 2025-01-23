import React from "react";

const url = import.meta.env.VITE_SERVER_IP ? import.meta.env.VITE_SERVER_IP+'/verifyToken' : '/verifyToken';
const refreshUrl = import.meta.env.VITE_SERVER_IP ? import.meta.env.VITE_SERVER_IP+'/refreshToken' : '/refreshToken';

export default function useAuthFetch():[boolean]{
    const [success,setSuccess] = React.useState<boolean>(false);

    const token = localStorage.getItem('accessToken')
    if(!token) {
        window.location.pathname = '/login'
        return [false];
    }

    fetch(url,{
        method:'GET',
        headers:{
            'authorization' : `Bearer ${token}`
        },
        credentials:'include',
    })
        .then(res => res.json())
        .then(data => {
            if(data.success) setSuccess(true)
            if(!data.success){
                fetch(refreshUrl,{
                    method:'GET',
                    credentials:'include',
                })
                    .then(res=>res.json())
                    .then(data =>{
                        if(data.success){
                            localStorage.setItem('accessToken', data.accessToken)
                            setSuccess(true)
                        }
                        if(!data.success){
                            window.location.pathname = '/login'
                        }
                    })
            }
        })

    return [success];
}