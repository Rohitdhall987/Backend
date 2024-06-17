import Artist from '../models/artistModel.js';

// Add Artist
export const addArtist = async (data) => {
  const artist = new Artist(data);
  return await artist.save();
};

// Delete Artist
export const deleteArtist = async (id) => {
  return await Artist.findByIdAndDelete(id);
};

// Update Artist
export const updateArtist = async (id, data) => {
  return await Artist.findByIdAndUpdate(id, data, { new: true });
};

// Get Artist with Album IDs
export const getArtist = async (id) => {
  return await Artist.findById(id).populate('albums');
};

// Get All Artists
export const getAllArtists = async () => {
  return await Artist.find().populate('albums');
};
