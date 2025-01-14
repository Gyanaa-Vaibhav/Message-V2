import {useRef, useState} from "react";
import '../styles/Login.css'
import Input from "../Input/Input.tsx";
import Button from "../Button/Button.tsx";
import StarAnimation from "../../LandingPage/components/StarAnimation.tsx";
import NavBar from "../../NavBar/components/NavBar.tsx";
import HideIcon from '/svg/hide_icon.svg?url'
import ShowIcon from '/svg/show_icon.svg?url'
import {Errors} from "../types/Login.ts";
import {handelRegisterSubmit} from "../utils/handelRegisterSubmit.ts";

export default  function Register(){
    const emailRef = useRef<HTMLInputElement>(null);
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);

    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [popupMessage, setPopupMessage] = useState<string>("");
    const [showPassword,setShowPassword] = useState<boolean>(false);
    const [showPasswordCNF,setShowPasswordCNF] = useState<boolean>(false);

    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [isFocusedOnCNF, setIsFocusedOnCNF] = useState<boolean>(false);

    const [errors, setErrors] = useState<Errors>({
        username:'' ,email: '', password: '' ,confirmPassword: ''
    });

    const handleFocus = () => setIsFocused(true);
    const handleFocusOnCNF = () => setIsFocusedOnCNF(true);

    const handleBlur = () => {
        setShowPassword(false)
        setIsFocused(false);
    }

    const handleBlurOnCNF = () => {
        setShowPasswordCNF(false)
        setIsFocusedOnCNF(false)
    };

    const submitObjects = {
        emailRef,passwordRef,confirmPasswordRef,usernameRef,setErrors,setPopupMessage,setShowPopup
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

                <form
                    // onSubmit={(e) => handelSubmit(e)}
                >
                    <Input
                        ref={usernameRef}
                        type={'text'}
                        name={'username'}
                        id={"username"}
                        placeholder={"Enter your username"}
                        required={true}
                        autoComplete={'off'}
                    />
                    {errors.username &&
                        <small style={{color: '#ffa5a5'}}>{errors.username}</small>
                    }

                    <Input
                        ref={emailRef}
                        type={'email'}
                        name={'email'}
                        id={"email"}
                        placeholder={"Enter your email"}
                        required={true}
                        autoComplete={'off'}
                    />
                    {errors.email &&
                        <small style={{color: '#ffa5a5'}}>{errors.email}</small>
                    }

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
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                            />
                            {isFocused && (
                                <img
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    src={showPassword ? HideIcon : ShowIcon}
                                    alt={showPassword ? "Hide Icon" : "Show Icon"}
                                />
                            )}
                        </div>
                    </div>
                    {errors.password &&
                        <small style={{color: '#ffa5a5'}}>{errors.password}</small>
                    }

                    <div>
                        <label htmlFor='confirm_password'>
                            Confirm Password:
                        </label>
                        <div className='password-container'>
                            <input
                                ref={confirmPasswordRef}
                                type={`${showPasswordCNF ? 'text' : 'password'}`}
                                name={'confirm_password'}
                                id={'confirm_password'}
                                placeholder={"Confirm your password"}
                                required={true}
                                autoComplete={'off'}
                                onFocus={handleFocusOnCNF}
                                onBlur={handleBlurOnCNF}
                            />
                            {isFocusedOnCNF && (
                                <img
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => setShowPasswordCNF((prev) => !prev)}
                                    src={showPasswordCNF ? HideIcon : ShowIcon}
                                    alt={showPasswordCNF ? "Hide Icon" : "Show Icon"}
                                />
                            )}
                        </div>
                    </div>
                    {errors.confirmPassword &&
                        <small style={{color: '#ffa5a5'}}>{errors.confirmPassword}</small>
                    }

                    <Button
                        label="Register"
                        type="submit"
                        onClick={(e)=>handelRegisterSubmit({...submitObjects,e})}
                    />
                    <p className="register-link">Already have an account? <a href="/login">Login here</a></p>
                </form>

                {showPopup && (
                    <div
                        className="popup-overlay"
                        onClick={closePopup}
                    >
                        <div
                            className="popup"
                            onClick={(e) => e.stopPropagation()}
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