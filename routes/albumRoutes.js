import express from 'express';
import {
  addAlbum,
  deleteAlbum,
  updateAlbum,
  getAlbum,
  getAllAlbums,
} from '../controllers/albumController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();


router.use((req, res, next)=>{
    authMiddleware(req, res, next,process.env.JWT_SECRET );
});

router.post('/', async (req, res) => {
  try {
    const album = await addAlbum(req.body);
    res.status(201).json(album);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await deleteAlbum(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const album = await updateAlbum(req.params.id, req.body);
    res.status(200).json(album);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const album = await getAlbum(req.params.id);
    res.status(200).json(album);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const albums = await getAllAlbums();
    res.status(200).json(albums);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
