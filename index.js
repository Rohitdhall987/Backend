import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import SongRoutes from './routes/songRoutes.js';
import cors from 'cors';




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



app.get("/",(req,res)=>{
  res.json({message:"connected"});
});


// Use Routes
 app.use('/api/admin_users', userRoutes);
 app.use('/api/songs/', SongRoutes);



// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
