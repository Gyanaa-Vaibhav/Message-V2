import {pool} from "../db.js";

type AddKeys = {
    user_Id:number,
    salt:string,
    public_key:string,
    private_key:string,
}

export async function addToKeys({user_Id,salt,public_key,private_key}:AddKeys){
    const query = `
        INSERT INTO
            KEYS(user_id,salt,public_key,private_key)
        VALUES 
            ($1,$2,$3,$4);
    `
    const values= [user_Id,salt,public_key,private_key]
    await pool.query(query,values);
}