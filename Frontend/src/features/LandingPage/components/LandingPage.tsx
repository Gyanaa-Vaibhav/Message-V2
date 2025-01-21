import '../styles/LandingPage.css';
import {Shield,Message,Delete,Mobile,Lock,AI,FeatureCard,FAQ,motion} from "../imports/LandingPageimports.ts";

export type FAQType = {
    title:string,
    Desc:string
}

type TypingTextProps = {
    text: string;
}


const typingVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 , delay : 0.2 }},
};

const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0,transition: { repeat: Infinity, duration: 2, ease: "easeInOut" } },
};

const TypingText = ({text}:TypingTextProps) => (
    <motion.h1 variants={typingVariants} initial="hidden" animate="visible">
        {text.split("").map((char:string, i:number) => (
            <motion.span key={i} variants={letterVariants}>
                {char}
            </motion.span>
        ))}
    </motion.h1>
);

const LandingPage = () => {
    const FAQs:FAQType[] = [
        {title:'Is it safe?',Desc:"Yes, It is a 100% safe if you are still skeptical the code is open source"},
        {title:'Are the Chats Stored?',Desc:"Yes and No, The room chats are saved normally while individual chats are encrypted and stored"},
        {title:'How many Devices I can access',Desc:"As of now we support 2 devices Simultaneously"},
        {title:'Is the AI free?',Desc:"As of now yes the AI is Free."},
        {title:'Where is the code base at?',Desc:`You can find the source code 
        <a target="_blank" href="https://github.com/Gyanaa-Vaibhav/Message-V2" rel="noopener">here</a>`}
    ]

    const faq = FAQs.map(i=><FAQ key={i.title} title={i.title}  Desc={i.Desc}/>)

    return (
        <>
            <div className='landing-page'>
                <motion.div
                    initial={
                        {
                            scale: 0,
                            opacity: 0,
                        }}
                    animate={
                        {
                            scale: 1,
                            opacity: 1,
                            transition: {duration: 0.25},
                        }}
                    className='landing-text'
                >
                    <TypingText text="Message INC" />;
                    <div className='landing-info'>
                        <h2>An AI Enabled Anonymous and
                            <br/>
                            Fully Private way to chat
                        </h2>
                        <div className='landing-cta'>
                            <motion.button animate={{y: [0, -8, 0], transition: { repeat: Infinity, duration: 1, ease: "easeInOut" },
                            }}>Try Chat Rooms Now
                            </motion.button>
                            <button>Learn More</button>
                        </div>
                    </div>
                </motion.div>
                <hr/>
                <motion.div
                    initial={
                        {
                            scale: 0, opacity: 0
                        }}
                    animate={
                        {
                            scale: 1,
                            opacity: 1,
                            transition: {duration: 0.5}
                        }}
                    aria-label='A women with a finger placed on her lips'
                    className='landing-image-container'
                >
                    <div className="gradient-overlay"></div>
                </motion.div>
            </div>

            <div className='features'>
                <FeatureCard
                    svg={Shield}
                    alt={'Shield Icon'}
                    description={`Chat without 
                        signing up or sharing 
                        personal information.`
                    }
                    title={'Complete Anonymity'}
                />
                <FeatureCard
                    svg={Lock}
                    alt={'Lock Icon'}
                    title={'Secure and Private'}
                    description={`
                        With End to End Encryption Nothing is being tracked
                        not even your IP address`
                    }
                />
                <FeatureCard
                    svg={Message}
                    alt={'Message Icon'}
                    title={'Diverse Chat Rooms'}
                    description={`
                        Find rooms based on your
                        interests or create your own.`
                    }
                />
                <FeatureCard
                    svg={Mobile}
                    alt={'Mobile Icon'}
                    title={'Accessible Anywhere'}
                    description={`
                        Use on mobile or desktop, anytime,
                        anywhere.`
                    }
                />
                <FeatureCard
                    svg={AI}
                    alt={'AI Icon'}
                    title={'Access To AI'}
                    description={`
                        Use Our ChatGPT enabled model to summarise 
                        long massages in the go.`
                    }
                />
                <FeatureCard
                    svg={Delete}
                    alt={'Delete Icon'}
                    title={'Delete All in Single click'}
                    description={`
                        With your privacy in mind you can not only 
                        delete you account but the chats with others as well`
                    }
                />
            </div>

            <div className='FAQ'>
                {faq}
            </div>
        </>
    );
}

            export default LandingPage;
