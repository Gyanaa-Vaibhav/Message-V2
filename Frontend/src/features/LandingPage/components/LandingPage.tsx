import '../styles/LandingPage.css';
import {shh,Shield,Message,Mobile,Lock,FeatureCard,motion} from "../imports/LandingPageimports.ts";

const LandingPage = () => {
    console.log("From Landing Page")

    return (
        <>
            <div className='landing-page'>
                <motion.div
                    initial={
                    {
                        x:'-100vh',
                        opacity: 0.2,
                    }}
                    animate={
                    {
                        x:0,
                        opacity: 1,
                        transition: { duration: 0.5 },
                    }}
                    className='landing-text'
                >
                    <h1>Message INC</h1>
                    <div className='landing-info'>
                        <h2>An Anonymous and Fully
                            <br/>
                            Private way to chat
                        </h2>
                        <div className='landing-cta'>
                            <button>Try Chat Rooms Now</button>
                            <button>Learn More</button>
                        </div>
                    </div>
                </motion.div>
                <hr/>
                <motion.div
                    initial={
                    {
                        scale: 0,opacity:0
                    }}
                    animate={
                    {
                        scale: 1,
                        opacity:1,
                        transition: { duration: 0.5 }
                    }}
                    className='landing-image-container'
                >
                    <img src={shh} alt="A women with a finger placed on her lips"/>
                    <div className="gradient-overlay"></div>
                </motion.div>
            </div>
            <div className='features'>
                <FeatureCard
                    svg={Shield}
                    description={`Chat without 
                        signing up or sharing 
                        personal information.`
                    }
                    title={'Complete Anonymity'}
                />
                <FeatureCard
                    svg={Lock}
                    title={'Secure and Private'}
                    description={`
                        With End to End Encryption Nothing is being tracked
                        not even your IP address`
                    }
                />
                <FeatureCard
                    svg={Message}
                    title={'Diverse Chat Rooms'}
                    description={`
                        Find rooms based on your
                        interests or create your own.`
                    }
                />
                <FeatureCard
                    svg={Mobile}
                    title={'Accessible Anywhere'}
                    description={`
                        Use on mobile or desktop, anytime,
                        anywhere.`
                    }
                />
            </div>
        </>
    );
}

export default LandingPage;
