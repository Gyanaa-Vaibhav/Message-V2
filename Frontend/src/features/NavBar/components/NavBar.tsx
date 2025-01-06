import '../styles/NavBar.css';
import {Link} from "react-router";

const NavBar = () => {
    const path = window.location.pathname;

    return (
        <>
            <nav>
                <ul>
                    <li><Link to='/learn_more'>Learn More</Link></li>
                    <li><a href='https://github.com/Gyanaa-Vaibhav/Message-V2' rel='noopener' target="_blank">Contribute</a></li>
                    {path !== '/login' && < li > Sign In</li>}
                    {path !== '/register' && <li>Sign Up</li>}
                </ul>
            </nav>
        </>
    );
}

export default NavBar;
