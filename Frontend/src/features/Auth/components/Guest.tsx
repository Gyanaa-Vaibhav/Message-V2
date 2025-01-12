import React, {useRef, useState} from "react";
import '../styles/Guest.css'
import StarAnimation from "../../LandingPage/components/StarAnimation.tsx";

type Errors = {
    username:string
}

export function Guest() {
    // URL
    const url = import.meta.env.VITE_SERVER_IP ? import.meta.env.VITE_SERVER_IP+'/' : '/';

    // State
    const [username, setUsername] = useState<string>('');
    const [errors, setErrors] = useState<Errors>({ username:'' });
    const [isGuest, setIsGuest] = useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(false);

    // Refs
    const usernameRef = useRef<HTMLInputElement>(null);
    const guestRef = useRef<HTMLInputElement>(null);

    function fetchUser() {

        const validateUser = (value:string)=>{
            const usernameRegex = /^[a-zA-Z0-9]{3,20}$/;
            if(value === ''){
                return 'Username is required';
            }else if(value.length < 4 || value.length > 20){
                return 'Username must be 3-20 characters long';
            } else if(!usernameRegex.test(value)){
                return 'Username can only contain letters, numbers.'
            }
            return '';
        }


        if(!guestRef.current) return;

        if(!guestRef.current.checked){

            if(!usernameRef.current) return;

            const usernameError = validateUser(usernameRef.current.value);

            if (!usernameError) {
                console.log(usernameRef.current.value);
                setErrors({username: ''});
            } else {
                console.log(usernameRef.current.value);
                setErrors({username: usernameError });
                return;
            }
        }


        setLoading(true);

        fetch(url+`guest/${username || 'G uest'}`)
            .then(res => {
                return res.json();
            })
            .then(data => {
                localStorage.setItem("accessToken", (data.accessToken));
            })
            .finally(() => {
                setTimeout(() => {
                    // window.location.href = '/chat';
                }, 700);
            });
    }

    if (loading) return (
        <div className='loading'>
            <StarAnimation/>
            <h1>
                Getting things ready
                <span className="dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </span>
            </h1>
        </div>
    )

    return (
        <>
        <StarAnimation/>
        <div className="guest-container">
            <h1>Welcome to the Chat!</h1>
            <p>Choose how you want to join:</p>

            <div className="guest">
                <input
                    ref={guestRef}
                    type="radio"
                    id="guest"
                    name="join"
                    checked={isGuest}
                    onChange={() => setIsGuest(true)}
                />
                <label htmlFor="guest">Join as Guest</label>
            </div>

            <div className="option">
                <div className='username'>
                    <input
                        className='guest-radio'
                        type="radio"
                        id="name"
                        name="join"
                        checked={!isGuest}
                        onChange={() => setIsGuest(false)}
                    />
                    <label htmlFor="name">Enter a Username</label>
                </div>

                {!isGuest && (
                    <div>
                        <input
                            className='guest-name'
                            ref={usernameRef}
                            type="text"
                            value={username}
                            placeholder="Enter your username"
                            onChange={(e)=>setUsername(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    fetchUser();
                                }
                            }}
                        />
                    </div>
                )}
                {errors.username && <small style={{color:'#ffa5a5'}}>{errors.username}</small>}
            </div>

            <button className="enter-chat" onClick={fetchUser}>Enter Chat</button>
        </div>
        </>
    );
}