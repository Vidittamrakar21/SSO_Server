import express, {Express, Request,Response,NextFunction} from 'express';
import dotenv from 'dotenv';
dotenv.config()

//@ts-ignore
import jwt from 'jsonwebtoken'
//@ts-ignore
import _ from 'lodash'
//@ts-ignore
import User from "../model/user"

type userdata = {
    email: string
    name: string
}



const createuser = async (req: Request, res: Response)=>{
    try {

    const {email ,name}:userdata = req.body;



    if(!(email && name)){
        res.json({message: "An unexpected error occured while logging in !"})
    }
   
       
        
   
    
    else{
            
            
            const token = await jwt.sign( {email: email, name: name}, process.env.SECKEY,
                {
                    expiresIn : "65h"
                }

            )

            if(!token){
                res.json({message:"cannot make token"});
            }
            
            const newuser = await User.create({email: email , name: name, token: token});
            res.json(newuser);
           
    }
       
    
        
    } catch (error) {
        res.json({"Error": error})
    }
}


const existinguser = async (req: Request, res: Response) =>{
    try {
        const {email} = req.body;

        if(email){
            const exists = await User.findOne({email: email})
            if(exists){

                res.json({exists, already:true})
            }
            else{
                res.json({already:false})
            }
        }
        
        
    } catch (error) {
        res.json(error);
    }
}


const finduser = async (req: Request, res: Response)=>{
    try {
        const {token} = req.body;

        if(token){
            const isverified = await jwt.verify(token, process.env.SECKEY);
            console.log("verify:",isverified);
            if(isverified){
                const data  = await User.findOne({email: isverified.email});
                res.json({message: "Signed In successfully!" , data});
            }
            else{
                res.json({message: "An unexpected error occured while signing in user"});
            }

        }

        else{
            res.json({message: "no token found"})
        }
        
    } catch (error) {
        res.json(error)
        console.log(error)
    }
}





module.exports = {createuser , finduser, existinguser};