import '../styles/FeatureCard.css';
import {Props} from "../types/FeatureCardtypes.ts";

const FeatureCard = ({svg,title,description}:Props) => {
    return (
        <>
            <div className='feature-card'>
                <div className='svg'>
                    <img src={svg} alt={svg.split('.')[0]}/>
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
        </>
    );
}

export default FeatureCard;
