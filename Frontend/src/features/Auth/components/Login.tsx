import '../styles/Login.css';
import React, {useEffect, useRef, useState} from "react";
import Input from "../Input/Input.tsx";
import Button from "../Button/Button.tsx";
import StarAnimation from "../../LandingPage/components/StarAnimation.tsx";
import NavBar from "../../NavBar/components/NavBar.tsx";
import HideIcon from '/svg/hide_icon.svg?url'
import ShowIcon from '/svg/show_icon.svg?url'
import {handelLoginSubmit} from "../utils/handelLoginSubmit.ts";

const Login = () => {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const saltRef = useRef<HTMLTextAreaElement>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [showError, setShowError] = useState<boolean>(false);
    const [errors, setErrors] = useState({ email: '', password: '', keys:''});
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);
    const [showPassword,setShowPassword] = useState<boolean>(false);
    const [showKeyInput,setShowKeyInput] = useState<boolean>(false);

    const privateKey = localStorage.getItem('privateKey')

    useEffect(() => {
        if(privateKey) return;
        setShowKeyInput(true);
    },[privateKey]);

    useEffect(() => {
        setTimeout(() => {
            if(showError) setShowError(false);
        }, 3000);
    }, [showError]);

    const loginObject = {emailRef,passwordRef,saltRef,showKeyInput,setErrors,setShowError,setErrorMessage};

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

                    {showKeyInput &&<>
                            <div>
                            <label htmlFor='salt'>
                                Keys:
                            </label>
                            <textarea
                                style={{width: '100%',boxSizing:'border-box',resize:'none',overflowY:'auto',scrollbarWidth:'thin',scrollbarColor:'rgba(255, 255, 255, 0.16) transparent'}}
                                ref={saltRef}
                                rows={5}
                                name={'salt'}
                                id={"salt"}
                                placeholder={"Enter your Keys/Salts"}
                                required={true}
                                autoComplete={'off'}
                            />
                        </div>
                        {errors.keys && <small style={{ color: '#ffa0a0' }}>{errors.keys}</small>}
                    </>
                    }

                    <Button
                        label="Login"
                        type="submit"
                        onClick={(e:React.MouseEvent<HTMLButtonElement>)=>handelLoginSubmit({...loginObject,e})}
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