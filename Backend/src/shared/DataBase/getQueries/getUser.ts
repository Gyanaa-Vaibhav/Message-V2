import {pool} from "../db.js";

export async function getUser(email:string,username:string){
    const query=`
        SELECT * FROM users WHERE email=($1) OR username=($2);
    `
    const values=[email,username];
    const {rows} = await pool.query(query,values);
    return rows || null;
}