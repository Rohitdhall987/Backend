import Album from '../models/albumModel.js';
import Artist from '../models/artistModel.js';

// Add Album
export const addAlbum = async (data) => {
  const album = new Album(data);
  await album.save();
  const artist = await Artist.findById(album.artist);
  artist.albums.push(album._id);
  await artist.save();
  return album;
};

// Delete Album
export const deleteAlbum = async (id) => {
  return await Album.findByIdAndDelete(id);
};

// Update Album
export const updateAlbum = async (id, data) => {
  return await Album.findByIdAndUpdate(id, data, { new: true });
};

// Get Album with Song IDs
export const getAlbum = async (id) => {
  return await Album.findById(id).populate('songs');
};

// Get All Albums
export const getAllAlbums = async () => {
  return await Album.find().populate('songs');
};
