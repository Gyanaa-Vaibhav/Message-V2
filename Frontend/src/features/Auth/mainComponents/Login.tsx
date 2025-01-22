import '../styles/Login.css';
import {motion} from "framer-motion";
import {useEffect, useRef, useState} from "react";
import Button from "../Button/Button.tsx";
import NavBar from "../../NavBar/components/NavBar.tsx";
import HideIcon from '/svg/hide_icon.svg?url'
import ShowIcon from '/svg/show_icon.svg?url'
import {handelLoginSubmit} from "../utils/handelLoginSubmit.ts";
import OtpInput from "../components/OPTInput.tsx";

const Login = () => {
    // Refs
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    // States
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [showError, setShowError] = useState<boolean>(false);
    const [errors, setErrors] = useState({ email: '', password: '', otp:''});
    const [email,setEmail] = useState<string>('');
    const [password,setPassword] = useState<string>('');
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [showPassword,setShowPassword] = useState<boolean>(false);

    const [showOPTScreen,setShowOPTScreen] = useState<boolean>(false);

    const FormVariants = {
        hidden: {
            opacity: 1,
            y: 0,
        },
        visible: {
            opacity: 1,
            y: "-30%",
        },
        exit: {
            opacity: 0,
            y: "-100vh",
            transition: {
                duration: 0.8,
                ease: "easeInOut"
            }
        }
    };


    useEffect(() => {
        setTimeout(() => {
            if(showError) setShowError(false);
        }, 3000);
    }, [showError]);

    const loginObject = {emailRef,passwordRef,showOPTScreen,setErrors,setShowError,setErrorMessage,setShowOPTScreen};

    return (
        <>
            <NavBar/>
            {showOPTScreen
                ?
                <OtpInput
                    password={password}
                    email={email}
                    errors={errors}
                    loginObject={loginObject}
                />
                :
                <motion.div
                    key="login-screen"
                    variants={FormVariants}
                    initial="visible"
                    animate="visible"
                    exit="exit"
                    className={"form-container"}
                >

                    <div className='heading'>
                        <h1>Welcome Back</h1>
                        <p>Sign in to your account</p>
                    </div>

                    <form
                        id="loginForm"
                    >
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
                                    onChange={(e)=>setEmail(e.target.value)}
                                    placeholder={"Enter your email"}
                                    required={true}
                                    autoComplete={'off'}
                                />
                            </div>
                        </div>
                        {errors.email && <small style={{ color: '#e5484d'}}>{errors.email}</small>}

                        <div>
                            <label htmlFor='password'>
                                Password:
                            </label>
                            <div
                                className={`password-container${errors.email ? ' error' : ''}`}
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
                                    onChange={(e)=>setPassword(e.target.value)}
                                    autoComplete={'off'}
                                    onFocus={()=>setIsFocused(true)}
                                    onBlur={()=> {
                                        setIsFocused(false)
                                        setShowPassword(false)
                                    }}
                                />
                                {isFocused && (
                                    <img
                                        style={{backgroundColor: errors.email? 'transparent' : '#3c454a'}}
                                        onMouseDown={(e) => e.preventDefault()} // Prevent input blur on icon click
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        src={showPassword ? HideIcon : ShowIcon}
                                        alt={showPassword ? "Hide Icon" : "Show Icon"}
                                    />
                                )}
                            </div>
                        </div>

                        {errors.password && <small style={{ color: '#e5484d' }}>{errors.password}</small>}

                        <Button
                            label="Login"
                            type="submit"
                            onClick={(e:React.MouseEvent<HTMLButtonElement>)=>handelLoginSubmit({...loginObject,e})}
                        />

                        <div className='links'>
                        <p className="register-link">Don't have an account? <a href="/register">Register here</a></p>
                        <p className="register-link">Use as <a href="/guest">Guest</a></p>
                        </div>
                    </form>
                </motion.div>
            }
            {/* Notification */}
            <div className={`notification ${showError ? 'show' : ''}`}>
                {errorMessage}
            </div>
        </>

    );
}

export default Login;