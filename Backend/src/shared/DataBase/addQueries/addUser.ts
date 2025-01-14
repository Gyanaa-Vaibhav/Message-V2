import {pool} from "../db.js";

type AddUser = {
    username:string,
    email:string,
    password:string,
    public_key:string,
    private_key:string
}

export async function addUser({username,password,email,public_key,private_key}:AddUser){
    const query=`
        INSERT INTO 
            users(username,password,email,public_key,private_key,created_at) 
        VALUES 
            ($1,$2,$3,$4,$5,NOW());
    `;
    const values = [username,password,email,public_key,private_key];
    await pool.query(query,values);
}