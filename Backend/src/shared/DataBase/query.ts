import {pool} from "./db.js";

export async function getAllUsers(){
    const query = `Select * from Users`;
    const {rows} = await pool.query(query);
    console.log(rows)
}


export async function getUserId(name:string):Promise<number|null> {
    const query = `SELECT id FROM users WHERE Lower(name) = Lower($1);`
    const trimmedName = name.trim();
    const values = [trimmedName];
    const {rows} = await pool.query(query,values);
    if(!rows) return null
    return rows[0].id || null
}

export async function getChats(user:string){
    const userID = await getUserId(user)
    const query = `
    SELECT DISTINCT
        ON (recipient_id)
            message,
            name,
            recipient_id,
            timestamp
        FROM
            messages m
        JOIN
            users u
        ON 
            m.recipient_id = u.ID
        WHERE
            m.sender_id = ($1)
        AND
            m.recipient_id IS NOT NULL
        ORDER BY
            recipient_id,
            m.timestamp DESC
    `;
    const values = [userID]
    const {rows} = await pool.query(query,values);
    return rows
}

export async function getChatMessages(activeUser:string, chatUser:string){
    const activeUserID = await getUserId(activeUser)
    const chatUserID = await getUserId(chatUser)
    const query = `
        SELECT * 
        FROM 
            messages m 
        where 
            (m.sender_id=$1 AND m.recipient_id=$2)
        OR
            (m.sender_id = $2 AND m.recipient_id = $1)
        ORDER BY
            m.timestamp ASC;
    `;

    const values =[activeUserID, chatUserID]
    const {rows} = await pool.query(query,values);
    return rows || null;
}