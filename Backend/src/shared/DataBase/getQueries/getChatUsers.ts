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

export async function getChatUsersLastMessage(activeUserId:number,userId:number){
    const query = `
        SELECT
            m.encrypted_message AS message,
            m.timestamp,
            CASE
                WHEN m.sender_id = $1 THEN m.recipient_id
                ELSE m.sender_id
                END AS recipient_id,
            CASE
                WHEN m.sender_id = $1 THEN recipient.username
                ELSE sender.username
                END AS recipient_username,
            CASE
                WHEN m.sender_id = $1 THEN recipient.profile_picture
                ELSE sender.profile_picture
                END AS profile_picture
        FROM
            messages m
                JOIN
            users sender ON m.sender_id = sender.user_id
                JOIN
            users recipient ON m.recipient_id = recipient.user_id
        WHERE
            (m.sender_id = $1 AND m.recipient_id = $2)
           OR
            (m.sender_id = $2 AND m.recipient_id = $1)
        ORDER BY
            m.message_id DESC
        LIMIT 1;
        `;
    const values = [activeUserId,userId]
    const {rows} = await pool.query(query,values);
    return rows || null
}