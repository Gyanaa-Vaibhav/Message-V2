import {SubmitTypes} from "../types/Login.ts";
// import decryptPrivateKey from "../../../shared/decryptPrivateKey.ts";
const url = import.meta.env.VITE_SERVER_IP ? import.meta.env.VITE_SERVER_IP+'/register' : '/register';

const validateEmail = (value: string) => {
    if (value.length === 0) {
        return 'Email is required';
    } else if (value.length < 5) {
        return 'Email must be at least 5 characters long';
    } else if (value.length > 320) {
        return 'Email must be less than 320 characters long';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
        return 'Invalid email format';
    }

    return '';
};

const validatePassword = (value:string) => {
    if(value.length === 0){
        return 'Password must be at least 8 characters long';
    }else if(value.length <= 8){
        return 'Password must be at least 8 characters long'
    }else if(value.length >= 8 && value.length >= 25){
        return  'Password must be less then 30 characters long'
    }
    return '';
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

const validateConfirmPassword = (password:string,confirmPassword: string) => {
    if (password !== confirmPassword) {
        return 'Passwords do not match';
    }
    return ''
}


export function handelRegisterSubmit({e,emailRef,passwordRef,confirmPasswordRef,usernameRef,setErrors,setPopupMessage,setShowPopup}:SubmitTypes){
    e.preventDefault();
    if(!emailRef.current || !passwordRef.current || !usernameRef.current || !confirmPasswordRef.current) return;

    const usernameError = validateUser(usernameRef.current.value);
    const emailError = validateEmail(emailRef.current.value);
    const passwordError = validatePassword(passwordRef.current.value);
    const confirmPasswordError = validateConfirmPassword(passwordRef.current.value,confirmPasswordRef.current.value);

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
            'confirm_password': confirmPasswordRef.current.value,
        }),
        credentials: 'include',
    })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            if (data.success) {
                localStorage.setItem('privateKey',data.hashedPrivateKey)
                setPopupMessage('You have successfully registered! Redirecting to login page...');
                setShowPopup(true)
                setTimeout(()=>{window.location.pathname = '/login'}, 3000);
            } else {
                if(data.username){
                    setErrors({username: 'Username already exists use different name', email: '', password: '' , confirmPassword: ''});
                }else{
                    // if(emailRef.current) console.log(decryptPrivateKey(data.hashedPrivateKey,emailRef.current.value))
                    setPopupMessage(data.message);
                    setShowPopup(true);
                    setTimeout(()=>{setShowPopup(false)}, 3000);
                }
            }
        })
}
