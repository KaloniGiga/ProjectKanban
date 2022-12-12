import express from 'express'
import {config} from 'dotenv'
import {configureDB} from './utils/db'
import cors from 'cors'
import authRoutes from './routes/auth.route'
import userRoutes from './routes/userProfile.route'
import path  from 'path'
import { getMaxListeners } from 'process'


//configure the dotenv
config()

//make the instance of express app
const app = express();

//configure mongodb
configureDB();

const BASE_PATH = process.env.BASE_PATH || "/api/v1";
const STATIC_PATH = process.env.STATIC_PATH || "/static";
const PUBLIC_DIR_NAME = process.env.PUBLIC_DIR_NAME || "public";

//middleware
app.use(cors({credentials: true}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(BASE_PATH + STATIC_PATH , express.static(path.join(__dirname, PUBLIC_DIR_NAME)))


app.get('/api/v1/user/readme', (req, res, next) => {
    const user = {
        _id: "kdldieneiieldi3938330",
        username: "dipakkalauni",
        email: "dipakkalauni8@gmail.com",
        avatar: "profil.jpg",
        emailVerified: true,
        isGoogleAuth: false
    }
    
    return res.status(200).json({success: true, user})
})

//configure routes
app.use('/api/v1', userRoutes);
app.use('/api/v1', authRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT , () => {
    console.log(`Server is running at port: ${process.env.PORT}`)
})