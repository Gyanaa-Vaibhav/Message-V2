import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.tsx'
import {Route, BrowserRouter, Routes} from "react-router";
import Login from "./features/Auth/mainComponents/Login.tsx";
import Register from "./features/Auth/mainComponents/Register.tsx";
import MainChat from "./features/Chat/MainChat.tsx";
import {Guest} from "./features/Auth/mainComponents/Guest.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<App/>}/>
                <Route path='/home' element={<App/>}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='/register' element={<Register/>}/>
                <Route path='/guest' element={<Guest/>}/>
                <Route path='/chat' element={<MainChat/>}/>
            </Routes>
        </BrowserRouter>
    </StrictMode>,
)
