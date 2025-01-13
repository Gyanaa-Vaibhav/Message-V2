import {pool} from "../db.js";

type AddUser = {
    username:string,
    email:string,
    password:string
}

export async function addUser({username,password,email}:AddUser){
    const query=`
        INSERT INTO 
            userss(user_name,password,email) 
        VALUES 
            ($1,$2,$3);
    `;
    const values = [username,password,email];
    await pool.query(query,values);
}