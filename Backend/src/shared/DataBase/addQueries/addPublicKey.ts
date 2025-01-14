import {pool} from "../db.js";

type AddPublicKey = {
    publicKey:string,
    email:string,
}

export async function addPublicKey({publicKey,email}:AddPublicKey){
    const query=`
        UPDATE 
            userss 
        SET 
            public_key =$1 
        WHERE 
            email=$2;
    `;
    const values = [publicKey,email];
    await pool.query(query,values);
}