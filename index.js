import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT;

// Connect to MongoDB
mongoose.connect(process.env.MONGOLOCAL)
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

app.get("/api",(req,res)=>{
  res.json({message:"api is called"});
});

// Use Routes
 app.use('/api/admin_users', userRoutes);



// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
