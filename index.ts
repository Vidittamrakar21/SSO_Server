import express, {Express, Request,Response,NextFunction} from 'express';
import dotenv from 'dotenv';
dotenv.config()
//@ts-ignore
import jwt from 'jsonwebtoken'

//@ts-ignore
import cookieparser from 'cookie-parser'

//@ts-ignore
import morgan from 'morgan'

//@ts-ignore
import userrouter from './routes/user' 
import mongoose from 'mongoose';

//@ts-ignore
import cors from 'cors'

const app: Express = express();

app.use(express.json());
app.use(morgan('tiny'));
app.use(cookieparser());
app.use(cors())

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(`mongodb+srv://vidit:${process.env.db_pass}@cluster0.7dlepcd.mongodb.net/?retryWrites=true&w=majority`);
    console.log("Database Connected");
  }

const check = async (req:Request,res: Response, next: NextFunction)=>{

   try {

    const {refreshToken , accessToken} = req.cookies
    if(refreshToken){
        const user = await jwt.verify(refreshToken,process.env.SECKEY);
       if(user){
            if(accessToken){
                res.json({message: "Logged in successfully"})
                
            }
            else{

                const token =   jwt.sign( {id: user.id, email: user.email},
                    
                
                    process.env.SECKEY,
                    {
                        expiresIn : "45s"
                    }

                )

                res.cookie("accessToken",token,{
                    maxAge: 300000,
                    httpOnly: true
                })

                res.json({message: "Logged in successfully"})
                

            }
           
       }
  
    }

    else{
       
        if(accessToken){

            res.cookie("accessToken", "",{
                maxAge: 0,
                httpOnly: true
            })
            res.json({message: "Login to continue."})
        }

        else{
            res.json({message: "Login to continue."})
        }
    }
    
   } catch (error) {
    const {refreshToken , accessToken} = req.cookies;

    if(refreshToken && accessToken){

        res.cookie("refreshToken", "",{
                maxAge: 0,
                httpOnly: true
            })
            
        res.cookie("accessToken", "",{
                    maxAge: 0,
                    httpOnly: true
                })
                
        res.status(401).json({message: "Login to continue", error})     

    }

    else{

        res.status(401).json({message: "Login to continue", error})
    }
                
   }
}



app.use('/api',userrouter)

app.get('/check',check)


app.get('/',(req: Request, res: Response)=>{
    res.send("server  running")
})

app.get('/trans',(req: Request, res: Response)=>{

    const next  = req.query.next
    if(next){
        //@ts-ignore
        res.redirect(next);
        res.send("server  running")
    }
    else{
        res.send("request failed")
    }
})

app.listen(8080,()=>{
    console.log("server started")
})
