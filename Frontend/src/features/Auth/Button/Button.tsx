import './Button.css'
import React from "react";

type Props = {
    type:'button'|'reset'|'submit',
    label:string,
    onClick: React.MouseEventHandler<HTMLButtonElement>
}
export default function Button(props:Props){
    const {label,onClick,type="button"} = props;

    return(
        <button className='button' type={type} onClick={onClick}>
            {label}
        </button>
    )
};