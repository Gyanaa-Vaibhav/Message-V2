import '../styles/Login.css';
import React, {useRef, useState} from "react";
import Input from "../Input/Input.tsx";
import Button from "../Button/Button.tsx";
import StarAnimation from "../../LandingPage/components/StarAnimation.tsx";
import NavBar from "../../NavBar/components/NavBar.tsx";
import HideIcon from '/svg/hide_icon.svg?url'
import ShowIcon from '/svg/show_icon.svg?url'

const Login = () => {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [showError, setShowError] = useState(false)
    const [errors, setErrors] = useState({ email: '', password: '' });
    const [isFocused, setIsFocused] = useState(false);
    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);
    const [showPassword,setShowPassword] = useState<boolean>(false);
    const url = import.meta.env.VITE_SERVER_IP ? import.meta.env.VITE_SERVER_IP+'/login' : '/login';


    const validateEmail = (value:string):boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    };

    const validatePassword = (value:string):boolean => {
        return value.length >= 8;
    };

    console.log(showPassword)
    // fetch(url).then(res => res.json()).then(data => console.log(data))  //Test Fetch

    function handelClick(e: React.MouseEvent<HTMLButtonElement>){
        if(!emailRef.current || !passwordRef.current) return;
        e.preventDefault();

        const emailError = validateEmail(emailRef.current.value) ? '' : 'Invalid email address';
        const passwordError = validatePassword(passwordRef.current.value) ? '' : 'Password must be at least 8 characters long';

        if (!emailError && !passwordError) {
            setErrors({ email: '', password: '' });
        } else {
            setErrors({ email: emailError, password: passwordError });
            return
        }

        fetch(url,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Specify content type
            },
            body: JSON.stringify({
                email:emailRef.current.value,
                password:passwordRef.current.value
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
                localStorage.setItem('accessToken', data.accessToken);
                window.location.pathname = '/chat'; // Redirect to the home page
            })
            .catch((error) => {
                console.error('Fetch error:', error)
                setErrorMessage('Invalid username or password. Please try again.'); // Set error message
                setShowError(true); // Show popup

                // Hide the notification after 3 seconds
                setTimeout(() => {
                    setShowError(false);
                }, 3000);
            });
    }

    return (
        <>
            <NavBar/>
            <StarAnimation/>
            <div
                className={"form-container"}
            >

                <h1>Login</h1>

                <form
                    id="loginForm"
                >
                    <Input
                        style={{border: errors.email ? '1px solid red' : '1px solid #ccc'}}
                        ref={emailRef}
                        type={'email'}
                        name={'email'}
                        id={"email"}
                        placeholder={"Enter your email"}
                        required={true}
                        autoComplete={'off'}
                    />
                    {errors.email && <small style={{ color: '#ffa0a0'}}>{errors.email}</small>}

                    <div>
                        <label htmlFor='password'>
                            Password:
                        </label>
                        <div className='password-container'>
                            <input
                                ref={passwordRef}
                                type={`${showPassword ? 'text' : 'password'}`}
                                name={'password'}
                                id={'password'}
                                placeholder={"Enter your password"}
                                required={true}
                                autoComplete={'off'}
                                onFocus={handleFocus} // Trigger when input gains focus
                                onBlur={handleBlur} // Trigger when input loses focus
                            />
                            {isFocused && (
                                <img
                                    onMouseDown={(e) => e.preventDefault()} // Prevent input blur on icon click
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    src={showPassword ? HideIcon : ShowIcon}
                                    alt={showPassword ? "Hide Icon" : "Show Icon"}
                                />
                            )}
                        </div>
                    </div>

                    {errors.password && <small style={{ color: '#ffa0a0' }}>{errors.password}</small>}

                    <Button
                        label="Login"
                        type="submit"
                        onClick={(e:React.MouseEvent<HTMLButtonElement>)=>handelClick(e)}
                    />

                    <p className="register-link">Don't have an account? <a href="/register">Register here</a></p>
                    <p className="register-link">Use as <a href="/guest">Guest</a></p>
                </form>
            </div>

            {/* Notification */}
            <div className={`notification ${showError ? 'show' : ''}`}>
                {errorMessage}
            </div>
        </>
    );
}

export default Login;