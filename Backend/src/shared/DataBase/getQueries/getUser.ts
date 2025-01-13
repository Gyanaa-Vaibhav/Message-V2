import {pool} from "../db.js";

export async function getUser(email:string,username:string){
    const query=`
        SELECT * FROM userss WHERE email=($1) OR user_name=($2);
    `
    const values=[email,username];
    const {rows} = await pool.query(query,values);
    return rows || null;
}