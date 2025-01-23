import {pool} from "../db.js";

type User= {
    email?:string,
    username?:string,
    user_id?:number
}
export async function getUser({user_id,username,email}:User){
    const query=`
        SELECT * FROM users u JOIN KEYS k ON u.user_id = k.user_id WHERE email=($1) OR username=($2) OR u.user_id=($3);
    `
    const values=[email,username,user_id];
    const {rows} = await pool.query(query,values);
    return rows || null;
}