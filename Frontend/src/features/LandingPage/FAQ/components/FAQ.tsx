import '../styles/FAQ.css';
import Arrow from "/svg/Right_icon.svg?url";
import {FAQType} from "../../components/LandingPage.tsx";
import {useState} from "react";
import {motion} from "../../imports/LandingPageimports.ts";

const FAQ = ({title,Desc}:FAQType) => {
    const [showDesc,setShowDesc] = useState<boolean>(false)

    function handelClick():void{
        setShowDesc(!showDesc);
    }

    return (
        <>
            <motion.div
                className='FAQ-title-container'
                initial={{opacity:0,y:100}}
                whileInView={{opacity:1,y:0}}
                viewport={{once:true}}
            >
                <div onClick={handelClick} className='FAQ-title'>
                    <h4>{title}</h4>
                    <img
                        className={showDesc ? 'rotate' :''}
                        id='arrow'
                        src={Arrow}
                        alt="Arrow"
                    />
                </div>
                {showDesc &&
                    <div className='FAQ-Desc'>
                        <p dangerouslySetInnerHTML={{
                            __html: Desc,
                        }}>
                        </p>
                    </div>
                }
            </motion.div>
        </>
    );
}

export default FAQ;
