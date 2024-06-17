import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import SongRoutes from './routes/songRoutes.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';




const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT;

// Connect to MongoDB
mongoose.connect(process.env.MONGOLOCAL)
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err)); 


app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['POST', 'GET',],
  allowedHeaders: ['Content-Type']
}));


app.use('/public', express.static(path.join(__dirname, 'public')));


app.get("/",(req,res)=>{
  res.json({message:"connected"});
});


// Use Routes
 app.use('/api/admin_users', userRoutes);
 app.use('/api/artists', artistRoutes);
 app.use('/api/albums', albumRoutes);
 app.use('/api/songs', songRoutes);



// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
