import {pool} from "../db.js";

export async function getChatUsers(userId:number){
    const query = `
        SELECT DISTINCT ON (recipient_id)
            recipient_id
        FROM
            messages
        WHERE
            sender_id = $1
    `;
    const values = [userId];
    const {rows} = await pool.query(query,values);
    return rows || null;
}