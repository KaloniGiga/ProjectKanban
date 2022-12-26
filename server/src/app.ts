import express from 'express'
import {config} from 'dotenv'
import {configureDB} from './utils/db'
import cors from 'cors'
import authRoutes from './routes/auth.route'
import userRoutes from './routes/userProfile.route'
import path  from 'path'
import { getMaxListeners } from 'process'
import workspaceRoutes from './routes/workspace.route'
import boardRoutes from './routes/board.route'


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
app.use(cors({ credentials: true}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(BASE_PATH + STATIC_PATH , express.static(path.join(__dirname, PUBLIC_DIR_NAME)))




//configure routes
app.use('/api/v1', userRoutes);
app.use('/api/v1', authRoutes);
app.use('/api/v1', workspaceRoutes)
app.use('/api/v1', boardRoutes)

const PORT = process.env.PORT || 4000;

app.listen(PORT , () => {
    console.log(`Server is running at port: ${process.env.PORT}`)
})