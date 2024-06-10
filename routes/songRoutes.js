import express from 'express';
import {AddSong,GetSongs ,DeleteById,UpdateSong} from '../controllers/songController.js';
import authMiddleware from '../middleware/authMiddleware.js';


const SongRoutes = express.Router();

SongRoutes.use(authMiddleware);

SongRoutes.post('/addSong', AddSong);

SongRoutes.post('/getSongs', GetSongs);

SongRoutes.post('/deleteById', DeleteById);

SongRoutes.post('/updateSongById', UpdateSong);

export default SongRoutes;
