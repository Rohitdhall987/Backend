import express from 'express';
import {
  addArtist,
  deleteArtist,
  updateArtist,
  getArtist,
  getAllArtists,
} from '../controllers/artistController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();


router.use((req, res, next)=>{
    authMiddleware(req, res, next,process.env.JWT_SECRET );
});


router.post('/', async (req, res) => {
  try {
    const artist = await addArtist(req.body);
    res.status(201).json(artist);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await deleteArtist(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const artist = await updateArtist(req.params.id, req.body);
    res.status(200).json(artist);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const artist = await getArtist(req.params.id);
    res.status(200).json(artist);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const artists = await getAllArtists();
    res.status(200).json(artists);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
