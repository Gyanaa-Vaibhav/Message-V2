import '../styles/FeatureCard.css';
import {Props} from "../types/FeatureCardtypes.ts";
import {motion} from "framer-motion";

const FeatureCard = ({svg,title,description,alt}:Props) => {
    return (
        <>
            <motion.div
                initial={{opacity:0,y:100}}
                whileInView={{opacity:1,y:0}}
                viewport={{once:true}}
                className='feature-card'
            >
                <div className='svg'>
                    <img id={alt.split(' ')[0]} src={svg} alt={alt}/>
                </div>
                <h2>{title}</h2>
                <p>{description}</p>
            </motion.div>
        </>
    );
}

export default FeatureCard;
