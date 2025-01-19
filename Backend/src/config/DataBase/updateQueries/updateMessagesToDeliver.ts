import {pool} from "../db.js";

export async function updateMessagesToDelivered(userId:number){
    const query = `
        UPDATE messages
        SET seen = FALSE
        WHERE recipient_id = $1 AND seen IS NULL;
    `;
    const values = [userId]
    await pool.query(query,values);
}