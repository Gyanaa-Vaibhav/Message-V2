import {pool} from "./db.js";

export async function getUserId(name:string):Promise<number|null> {
    const query = `SELECT user_id FROM users WHERE username = $1;`
    // const trimmedName = name.trim();
    const values = [name];
    const {rows} = await pool.query(query,values);
    if(rows.length === 0) return null
    return rows[0].user_id || null
}

export async function getChats(userId:number){
    const query = `
        SELECT DISTINCT ON (m.recipient_id)
            m.encrypted_message as message,
            m.sender_id,
            sender.username AS sender_username,
            m.recipient_id,
            recipient.username AS recipient_username,
            sender.profile_picture,
            m.timestamp
        FROM
            messages m
                JOIN
            users sender
            ON
                m.sender_id = sender.user_id
                JOIN
            users recipient
            ON
                m.recipient_id = recipient.user_id
        WHERE
            m.sender_id = $1
        ORDER BY
            m.recipient_id,
            m.timestamp DESC
    `;
    const test = `
        SELECT DISTINCT ON (LEAST(m.sender_id, m.recipient_id), GREATEST(m.sender_id, m.recipient_id))
            m.encrypted_message as message,
            m.sender_id,
            sender.username AS sender_username,
            m.recipient_id,
            recipient.username AS recipient_username,
            recipient.profile_picture,
            m.timestamp
        FROM 
            messages m
        JOIN 
            users sender ON m.sender_id = sender.user_id
        JOIN 
            users recipient ON m.recipient_id = recipient.user_id
        WHERE 
            $1 IN (m.sender_id, m.recipient_id) -- User 2 is part of the conversation
        ORDER BY 
            LEAST(m.sender_id, m.recipient_id), -- Group by unique conversation pairs
            GREATEST(m.sender_id, m.recipient_id), 
            m.message_id DESC -- Fetch the latest message per conversation
        ;
    `
    const values = [userId]
    const {rows} = await pool.query(test,values);
    return rows || null;
}

export async function getChatMessagesByID(activeUser:number, chatUser:number){
    const query = `
        SELECT
            encrypted_message as message,
            timestamp,
            recipient_id as "userId",
            sender_id as "activeUserId"
        FROM
            messages m 
        where 
            m.sender_id=$1 AND m.recipient_id=$2
        OR
            m.sender_id=$2 AND m.recipient_id=$1
        ORDER BY
            m.timestamp;
    `;
    const values =[activeUser, chatUser]
    const {rows} = await pool.query(query,values);
    return rows || null;
}
