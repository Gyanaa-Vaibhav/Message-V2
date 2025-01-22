import {pool} from "../db.js";

export async function updateMessagesToSeen(activeUserId:number,userId:number){
    const query = `
        UPDATE messages
        SET seen = TRUE
        WHERE recipient_id = $1 
          AND sender_id = $2
          AND seen IN (false, NULL);
        ;
    `
    const values = [userId,activeUserId]
    const {rows} = await pool.query(query,values)
}