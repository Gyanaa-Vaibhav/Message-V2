import {pool} from "../db.js";

type AddUser = {
    username:string,
    email:string,
    password:string,
}

export async function addUser({username,password,email}:AddUser){
    const query=`
        INSERT INTO 
            users(username,password,email,created_at) 
        VALUES 
            ($1,$2,$3,NOW())
        RETURNING user_id;
    `;
    const values = [username,password,email];
    const result = await pool.query(query, values);
    return result.rows[0].user_id;
}