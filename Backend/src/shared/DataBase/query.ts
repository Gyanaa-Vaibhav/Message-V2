import {pool} from "./db.js";

export async function getAllUsers(){
    const query = `Select * from Users`;
    const {rows} = await pool.query(query);
    console.log(rows)
}


export async function getUserId(name:string):Promise<number|null> {
    const query = `SELECT user_id FROM users WHERE username = $1;`
    // const trimmedName = name.trim();
    const values = [name];
    const {rows} = await pool.query(query,values);
    if(rows.length === 0) return null
    return rows[0].user_id || null
}

export async function getChats(user:string){
    const userID = await getUserId(user)
    const query = `
        SELECT DISTINCT ON (m.recipitent_id)
            m.message,
            m.sender_id,
            sender.username AS sender_username,
            m.recipitent_id,
            recipient.username AS recipitent_username,
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
                m.recipitent_id = recipient.user_id
        WHERE
            m.sender_id = $1
          AND
            m.recipitent_id IS NOT NULL
        ORDER BY
            m.recipitent_id,
            m.timestamp DESC
    `;
    const values = [userID]
    const {rows} = await pool.query(query,values);
    return rows
}

export async function getChatMessages(activeUser:string, chatUser:string){
    const query = `
        SELECT 
            message,
            timestamp as time,
            recipient_username as recipient,
            sender_username as sender
        FROM 
            messages m 
        where 
            m.sender_username=$1 AND m.recipient_username=$2
        OR
            m.sender_username=$2 AND m.recipient_username=$1
        ORDER BY
            m.timestamp ASC;
    `;
    const values =[activeUser, chatUser]
    const {rows} = await pool.query(query,values);
    return rows || null;
}

export async function getChatMessagesByID(activeUser:string, chatUser:string){
    const query = `
        SELECT
            message,
            timestamp,
            recipitent_id as "userId",
            sender_id as "activeUserId"
        FROM
            messages m 
        where 
            m.sender_id=$1 AND m.recipitent_id=$2
        OR
            m.sender_id=$2 AND m.recipitent_id=$1
        ORDER BY
            m.timestamp ASC;
    `;
    const values =[activeUser, chatUser]
    const {rows} = await pool.query(query,values);
    return rows || null;
}
