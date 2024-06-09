import express from 'express';
import AddSong from '../controllers/songController.js';


const SongRoutes = express.Router();


SongRoutes.post('/addSong', AddSong);

export default SongRoutes;
