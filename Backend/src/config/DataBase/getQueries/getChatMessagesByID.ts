import {pool} from "../db.js";

export async function getChatMessagesByID(activeUserId:number, chatUserId:number){
    const query = `
        SELECT
            encrypted_message as message,
            timestamp,
            recipient_id as "userId",
            sender_id as "activeUserId",
            seen
        FROM
            messages m 
        where 
            m.sender_id=$1 AND m.recipient_id=$2
        OR
            m.sender_id=$2 AND m.recipient_id=$1
        ORDER BY
            m.timestamp;
    `;
    const values =[activeUserId, chatUserId]
    const {rows} = await pool.query(query,values);
    return rows || null;
}