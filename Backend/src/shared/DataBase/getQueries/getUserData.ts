import {pool} from "../db.js";

export async function getUserData(email:string){
    const query=`
        SELECT * FROM users WHERE email=($1);
    `
    const values=[email];
    const {rows} = await pool.query(query,values);
    return rows || null;
}