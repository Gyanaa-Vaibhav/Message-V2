import React, {useState, useRef, useEffect} from "react";
import "../styles/OTP.css";
import handelVerifyOTP from "../utils/handelVerifyOTP.ts";
import {motion} from "framer-motion";
import {handelResendOtp} from "../utils/handelResendOtp.ts";

const OTP_LENGTH = 4;

type Props= {
    email:string,
    password:string,
    errors: {
        email: string,
        password: string,
        otp: string
    },
    loginObject: {
        emailRef:React.RefObject<HTMLInputElement>,
        passwordRef:React.RefObject<HTMLInputElement>,
        setErrors: React.Dispatch<React.SetStateAction<{
            email: string,
            password: string
            otp: string
        }>>,
        showOPTScreen:boolean,
        setShowError: React.Dispatch<React.SetStateAction<boolean>>,
        setShowOPTScreen: React.Dispatch<React.SetStateAction<boolean>>,
        setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
    }
}

const OtpInput = ({errors,loginObject,email,password}:Props) => {
    const OTPVariants = {
        hidden: {
            opacity: 0,
            y: "100vh",
        },
        visible: {
            opacity: 1,
            y: "-40%",
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 20
            }
        },
    };

    const [otp, setOtp] = useState<string[]>(new Array(OTP_LENGTH).fill(""));
    const inputRefs = useRef<Array<HTMLInputElement | null>>(Array(OTP_LENGTH).fill(null));
    const [,setOPTData] = useState<number>(NaN);
    const { setErrorMessage, setShowError, setErrors } = loginObject;
    const [allowResend,setAllowResend] = useState<boolean>(false);
    const [showResendInfo,setShowResendInfo] = useState<boolean>(false);
    const [resendTime,setResendTime] = useState<number>(30);

    // Handle input change
    const handleChange = (index: number, value: string) => {
        if (!/^[0-9]?$/.test(value)) return; // Only allow numeric input
        setErrors({...errors,otp:''})

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setOPTData(Number(otp.join('')))

        // Move focus to next input
        if (value && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // Handle backspace key to move focus back
    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {

        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }

        if (e.key === "Enter" && otp.join('').length <= 3){
            setErrors({...errors,otp:'Please enter correct OTP'})
        }

        if (e.key === "Enter") {
            // Compute the latest OTP string including the last value
            const newOtp = [...otp];

            // If input field is empty, don't include it
            if (inputRefs.current[index]?.value) {
                newOtp[index] = inputRefs.current[index]?.value || "";
            }

            const otpValue = newOtp.join("");

            if (otpValue.length < OTP_LENGTH) return;

            setOPTData(Number(otpValue));
            // Call function with updated OTP value
            handelVerifyOTP({ setErrorMessage, setShowError, OPTData: Number(otpValue), setErrors, errors, email });
        }
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (resendTime > 0) {
            interval = setInterval(() => {
                setResendTime((prev) => (prev > 0 ? prev - 1 : 0));
            }, 1000);
        }

        if(resendTime === 0){
            setAllowResend(true)
        }

        return () => clearInterval(interval);
    }, [resendTime]);

    return (
        <>
            <motion.div
                key="otp-screen"
                variants={OTPVariants}
                initial="hidden"
                animate="visible"
                className="verify-OTP"
            >
                <h1>Verify Login</h1>
                <p>Enter code we've sent to your inbox <br/>{email}</p>
                    <div className="otp-container">
                        <div className='opt-holder'>
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    className="otp-input"
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    autoComplete="off"
                                />
                            ))}
                        </div>
                        {errors.otp && <small style={{color: '#e5484d'}}>{errors.otp}</small>}
                    </div>
                <div className='resend-block'>
                    <p>Didn't get the code?
                        <span
                            onClick={()=> {
                                if(allowResend) handelResendOtp({email, password, errors, setErrors})
                                setResendTime(30)
                            }}
                            onMouseEnter={()=>setShowResendInfo(true)}
                            onMouseLeave={()=>setShowResendInfo(false)}
                            style={
                            {
                                cursor:`${resendTime === 0 ? 'pointer' : 'not-allowed'}`,
                                color:`${resendTime === 0 ? '#25D366' : '#25D36699'}`
                            }}
                        >{` Resend Otp`}</span></p>
                    {showResendInfo &&
                        <motion.p
                            className='resend-timer'
                            initial={{opacity:0}}
                            animate={{opacity:1}}
                    >You can Generate a new OPT {resendTime === 0 ? 'now' :  `in ${resendTime} sec`}</motion.p>}
                </div>
            </motion.div>
        </>
    );
};

export default OtpInput;
