import EmojiPicker from "emoji-picker-react";
import '../componentStyles/EmojiContainer.css'
import React from "react";
import reaction from '/svg/add_reaction.svg'
import {ClassNames} from "emoji-picker-react/dist/DomUtils/classNames";

export default function EmojiContainer(){
    const [selectedEmojis, setSelectedEmojis] = React.useState(["👍", "❤️", "😀", "😢", "🙏", "👎", "😡","＋"]);
    const [showReactionOptions,setShowReactionOptions] = React.useState<boolean>(false);
    const [showReaction,setShowReaction] = React.useState<boolean>(false)

    function handelReactionClick(e: React.MouseEvent<HTMLImageElement, MouseEvent>){
        e.preventDefault();
        setShowReaction(true);
    }

    function handelInitialReaction(e: React.MouseEvent<HTMLSpanElement, MouseEvent>,emoji:string){
        e.preventDefault();
        if(emoji === '＋'){
            setShowReaction(false);
            setShowReactionOptions(true);
        }
    }

    return(
        <div className='emoji-holder'>
            {!showReaction &&
                <img
                    className={'reaction-icon'}
                    src={reaction} alt="Reaction Icon"
                    onClick={(e) => handelReactionClick(e)}
                />
            }
            <div style={{display : `${showReaction ? 'flex' : 'none'}`}} className={`emoji-container`}>
                {showReaction && selectedEmojis.map((emoji, index) => (
                        <span
                            key={index}
                            className={'emoji'}
                            onClick={(e)=>{
                                handelInitialReaction(e,emoji)
                            }}
                        >
                                {emoji}
                        </span>
                    ))}
                {showReactionOptions &&
                    <div className={`emoji-Picker`}>
                        <EmojiPicker
                            onEmojiClick={(emoji, event) => {
                                console.log(event, emoji)
                            }}
                        />
                    </div>
                }
            </div>
        </div>
    )
}