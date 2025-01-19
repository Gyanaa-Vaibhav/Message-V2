import {pool} from "../db.js";

type AddMessage = {
    message:string,
    userId:number,
    activeUserId:number,
    timestamp:string
}

export async function addToChats({message,userId,activeUserId,timestamp}:AddMessage){
    const query = `
        INSERT INTO messageing
            (message,sender_id,recipitent_id,timestamp) 
        VALUES 
            ($1,$2,$3,$4)
    `;
    const values = [message,activeUserId,userId,timestamp]
    console.log("From Data base",values)
    // await pool.query(query,values);
}