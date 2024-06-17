import express from 'express';
import { addSong, getSongs, deleteById, updateSong } from '../controllers/songController.js';
import authMiddleware from '../middleware/authMiddleware.js';








// Create a new router instance
const SongRoutes = express.Router();


SongRoutes.use((req, res, next)=>{
    authMiddleware(req, res, next,process.env.JWT_SECRET );
});



// Route for adding a new song
SongRoutes.post('/add', authMiddleware, addSong);

// Route for retrieving all songs
SongRoutes.get('/', authMiddleware, getSongs);

// Route for deleting a song by ID
SongRoutes.delete('/:id', authMiddleware, deleteById);

// Route for updating a song by ID
SongRoutes.put('/:id', authMiddleware, updateSong);

export default SongRoutes;
