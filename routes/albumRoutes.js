import express from 'express';
import {
  addAlbum,
  deleteAlbum,
  updateAlbum,
  getAlbum,
  getAllAlbums,
} from '../controllers/albumController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const albumRoutes = express.Router();


albumRoutes.use((req, res, next)=>{
    authMiddleware(req, res, next,process.env.JWT_SECRET );
});

albumRoutes.post('/', async (req, res) => {
  try {
    const album = await addAlbum(req.body);
    res.status(201).json(album);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

albumRoutes.delete('/:id', async (req, res) => {
  try {
    await deleteAlbum(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

albumRoutes.put('/:id', async (req, res) => {
  try {
    const album = await updateAlbum(req.params.id, req.body);
    res.status(200).json(album);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

albumRoutes.get('/:id', async (req, res) => {
  try {
    const album = await getAlbum(req.params.id);
    res.status(200).json(album);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

albumRoutes.get('/', async (req, res) => {
  try {
    const albums = await getAllAlbums();
    res.status(200).json(albums);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default albumRoutes;
