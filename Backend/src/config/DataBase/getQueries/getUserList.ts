import {pool} from "../db.js";

export async function getUserList(username:string){
    const query = `
        SELECT u.user_id,
               u.username,
               k.public_Key,
               u.profile_picture
        FROM users u
                 JOIN
             KEYS k
             ON
                 u.user_id = k.user_id
        WHERE u.username LIKE($1);
    `;
    const values = [`${username}%`];
    const {rows} = await pool.query(query,values);
    return rows || null;
}