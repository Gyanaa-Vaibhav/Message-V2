import {pool} from "../db.js";

export async function getUserList(username:string){
    const query = `SELECT user_id,username,public_Key FROM users WHERE username LIKE($1);`;
    const values = [`${username}%`];
    const {rows} = await pool.query(query,values);
    return rows || null;
}