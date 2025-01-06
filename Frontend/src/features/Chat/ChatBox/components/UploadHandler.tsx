import cloud from '/svg/cloud_icon.svg?url'
import '../styles/UploadHandler.css'
import React from "react";
import {Socket} from "socket.io-client";

type Props = {
    children: React.ReactNode
    socket:Socket | null
};

export default function UploadHandler({children,socket}:Props){
    const [isDragging, setIsDragging] = React.useState(false);

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);

        const file = event.dataTransfer.files[0]; // Get the first file
        console.log(event.dataTransfer.files[0])
        if (file && socket) {
            const reader = new FileReader();
            reader.onload = () => {
                socket.emit("fileUpload", {
                    fileName: file.name,
                    fileType: file.type,
                    fileData: reader.result, // File data in base64 format
                });
            };
            reader.readAsDataURL(file); // Convert the file to Base64
        }
    };

    return(
        <>
            <div
                className='chat-box'
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {isDragging &&
                    <div className='dragging'>
                        <h1>Upload your files here</h1>
                        <img className='cloud' src={cloud} alt=""/>
                    </div>
                }
                {children}
            </div>
        </>
    )
}