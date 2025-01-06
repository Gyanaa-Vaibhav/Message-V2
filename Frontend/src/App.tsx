import './App.css'

import LandingPage from "./features/LandingPage/components/LandingPage.tsx";
import StarAnimation from "./features/LandingPage/components/StarAnimation.tsx";
import NavBar from "./features/NavBar/components/NavBar.tsx";


function App() {

    return (
        <>
            <NavBar/>
            <StarAnimation/>
            <LandingPage/>
        </>
    )
}

export default App
