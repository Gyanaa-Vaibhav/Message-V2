import React, {useRef, useState} from "react";
import '../styles/Login.css'
import Input from "../Input/Input.tsx";
import Button from "../Button/Button.tsx";
import StarAnimation from "../../LandingPage/components/StarAnimation.tsx";
import NavBar from "../../NavBar/components/NavBar.tsx";

export default  function Register(){
    const emailRef = useRef<HTMLInputElement>(null);
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);
    const url = import.meta.env.VITE_SERVER_IP ? import.meta.env.VITE_SERVER_IP+'/register' : '/register';

    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [popupMessage, setPopupMessage] = useState<string>("");
    const [errors, setErrors] = useState({ username:'' ,email: '', password: '' ,confirmPassword: '' });

    function handelSubmit(e: React.MouseEvent<HTMLButtonElement>){
        if(!emailRef.current || !passwordRef.current || !usernameRef.current || !confirmPasswordRef.current) return;
        e.preventDefault();


        const validateEmail = (value:string) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(value);
        };

        const validatePassword = (value:string) => {
            return value.length >= 8;
        };

        const validateUser = (value:string)=>{
            const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
            if(value === ''){
                return 'Username is required';
            }else if(value.length < 4 || value.length > 20){
                return 'Username must be 3-20 characters long';
            } else if(!usernameRegex.test(value)){
                return 'Username can only contain letters, numbers, and underscores (_).'
            }
            return '';
        }


        const usernameError = validateUser(usernameRef.current.value);

        const emailError = validateEmail(emailRef.current.value) ? '' : 'Invalid email address';

        const passwordError = validatePassword(passwordRef.current.value) ? '' : 'Password must be at least 8 characters long';

        const confirmPasswordError = confirmPasswordRef.current.value === '' ? 'Password must be at least 8 characters long' :
            passwordRef.current.value === confirmPasswordRef.current.value ? '' : 'Passwords do not match';


        if (!usernameError && !emailError && !passwordError && !confirmPasswordError) {
            setErrors({username: '', email: '', password: '' , confirmPassword: ''});
        } else {
            setErrors({username: usernameError ,email: emailError, password: passwordError , confirmPassword: confirmPasswordError});
            return;
        }

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: usernameRef.current.value,
                email: emailRef.current.value,
                password: passwordRef.current.value,
                'confirm-password': confirmPasswordRef.current.value,
            }),
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                console.log(data.success)
                console.log(data.message)
                console.log(data)
                if (data.success) {
                    setPopupMessage('You have successfully registered! Redirecting to login page...');
                    setShowPopup(true)
                    setTimeout(()=>{window.location.pathname = '/login'}, 3000);
                } else {
                    setPopupMessage(data.message);
                    setShowPopup(true);
                    setTimeout(()=>{setShowPopup(false)}, 3000);
                }
            })
    }

    const closePopup = () => {
        setShowPopup(false);
    };

    return (
        <>
            <NavBar/>
            <StarAnimation/>
            <div className="form-container">
                <h1>Register</h1>

                <form>
                    <Input
                        ref={usernameRef}
                        type={'text'}
                        name={'username'}
                        id={"username"}
                        placeholder={"Enter your username"}
                        required={true}
                        autoComplete={'off'}
                    />
                    {errors.username && <small style={{color: '#ffa5a5'}}>{errors.username}</small>}

                    <Input
                        ref={emailRef}
                        type={'email'}
                        name={'email'}
                        id={"email"}
                        placeholder={"Enter your email"}
                        required={true}
                        autoComplete={'off'}
                    />
                    {errors.email && <small style={{color: '#ffa5a5'}}>{errors.email}</small>}

                    <Input
                        ref={passwordRef}
                        type={'password'}
                        name={'password'}
                        id={"password"}
                        placeholder={"Enter your password"}
                        required={true}
                        autoComplete={'off'}
                    />
                    {errors.password && <small style={{color: '#ffa5a5'}}>{errors.password}</small>}

                    <Input
                        ref={confirmPasswordRef}
                        type={'password'}
                        name={'confirm_password'}
                        id={"confirm_password"}
                        placeholder={"Confirm your password"}
                        required={true}
                        autoComplete={'off'}
                    />
                    {errors.confirmPassword && <small style={{color: '#ffa5a5'}}>{errors.confirmPassword}</small>}

                    <Button
                        label="Register"
                        type="submit"
                        onClick={(e) => handelSubmit(e)}
                    />
                    <p className="register-link">Already have an account? <a href="/login">Login here</a></p>
                </form>

                {/* Popup */}
                {showPopup && (
                    <div
                        className="popup-overlay"
                        onClick={closePopup} // Close popup when clicking outside
                    >
                        <div
                            className="popup"
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                        >
                            <p>{popupMessage}</p>
                            <div className="popup-slider"></div>
                            <button className="popup-close-btn" onClick={closePopup}>
                                Close
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </>
    )
}