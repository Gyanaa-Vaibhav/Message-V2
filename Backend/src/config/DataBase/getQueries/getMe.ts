import {pool} from "../db.js";

type User= {
    user_id?:number
}
export async function getMe({user_id}:User){
    const query=`
        SELECT
            u.user_id,
            username,
            email,
            k.public_Key
        FROM users u JOIN KEYS k ON u.user_id = k.user_id WHERE u.user_id=($1);
    `
    const values=[user_id];
    const {rows} = await pool.query(query,values);
    return rows || null;
}