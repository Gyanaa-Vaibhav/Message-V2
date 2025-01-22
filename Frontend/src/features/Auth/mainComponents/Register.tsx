import {useRef, useState} from "react";
import '../styles/Login.css'
import '../Input/Input.css'
import Button from "../Button/Button.tsx";
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

    const submitObjects = {
        emailRef,passwordRef,confirmPasswordRef,usernameRef,setErrors,setPopupMessage,setShowPopup
    }

    return (
        <>
            <NavBar/>
            <div className="form-container">
                <div className='heading'>
                    <h1>Get Started</h1>
                    <p>Create a new account</p>
                </div>

                <form>
                    <div>
                        <label htmlFor='username'>
                            Username:
                        </label>
                    <input
                        style={{
                            backgroundColor: errors.username? '#7e221560' : '#3c454a',
                        }}
                        ref={usernameRef}
                        type={'text'}
                        name={'username'}
                        id={"username"}
                        placeholder={"Enter your username"}
                        required={true}
                        autoComplete={'off'}
                    />
                    </div>
                    {errors.username &&
                        <small style={{color: '#e5484d'}}>{errors.username}</small>
                    }

                    <div>
                        <label htmlFor='email'>
                            Email:
                        </label>
                        <div>
                            <input
                                style={{
                                    backgroundColor: errors.email? '#7e221560' : '#3c454a',
                                }}
                                className={errors.email ? 'error' : ''}
                                ref={emailRef}
                                type={'email'}
                                name={'email'}
                                id={"email"}
                                placeholder={"Enter your email"}
                                required={true}
                                autoComplete={'off'}
                            />
                        </div>
                    </div>
                    {errors.email &&
                        <small style={{color: '#e5484d'}}>{errors.email}</small>
                    }

                    <div>
                        <label htmlFor='password'>
                            Password:
                        </label>
                        <div
                            className='password-container'
                            style={{backgroundColor: errors.email ? '#7e221560' : '#3c454a'}}
                        >
                            <input
                                style={{backgroundColor: errors.email ? 'transparent' : '#3c454a'}}
                                ref={passwordRef}
                                type={`${showPassword ? 'text' : 'password'}`}
                                name={'password'}
                                id={'password'}
                                placeholder={"Enter your password"}
                                required={true}
                                autoComplete={'off'}
                                onFocus={()=>setIsFocused(true)}
                                onBlur={()=>{
                                    setShowPassword(false)
                                    setIsFocused(false)
                                }}
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
                        <small style={{color: '#e5484d'}}>{errors.password}</small>
                    }

                    <div>
                        <label htmlFor='confirm_password'>
                            Confirm Password:
                        </label>
                        <div
                            className='password-container'
                            style={{backgroundColor: errors.email ? '#7e221560' : '#3c454a'}}
                        >
                            <input
                                style={{backgroundColor: errors.email ? 'transparent' : '#3c454a'}}
                                ref={confirmPasswordRef}
                                type={`${showPasswordCNF ? 'text' : 'password'}`}
                                name={'confirm_password'}
                                id={'confirm_password'}
                                placeholder={"Confirm your password"}
                                required={true}
                                autoComplete={'off'}
                                onFocus={()=>setIsFocusedOnCNF(true)}
                                onBlur={()=>{
                                    setShowPasswordCNF(false)
                                    setIsFocusedOnCNF(false)
                                }}
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
                        <small style={{color: '#e5484d'}}>{errors.confirmPassword}</small>
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
                        onClick={()=>setShowPopup(false)}
                    >
                        <div
                            className="popup"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <p>{popupMessage}</p>
                            <div className="popup-slider"></div>
                            <button className="popup-close-btn" onClick={()=>setShowPopup(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </>
    )
}