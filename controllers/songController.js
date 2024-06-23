import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

import Album from '../models/albumModel.js';
import Songs from '../models/Songs.js';

// Utility to get the __dirname in ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setting up storage configuration for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Determine the directory based on the file type
        if (file.mimetype.startsWith("audio/")) {
            cb(null, path.resolve(__dirname, '../public/audio'));
        } else if (file.mimetype.startsWith("image/")) {
            cb(null, path.resolve(__dirname, '../public/images'));
        } else {
            cb(new Error("Invalid file type!"), false);
        }
    },
    filename: (req, file, cb) => {
        // Define the filename format
        cb(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
    }
});

// Initializing multer with the defined storage and file filters
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // File filter based on field name and file type
        if (file.fieldname === "thumbnail") {
            if (!file.mimetype.startsWith("image/")) {
                return cb(new Error("Only image files are allowed for thumbnails!"), false);
            }
        } else if (file.fieldname === "audio") {
            if (!file.mimetype.startsWith("audio/")) {
                return cb(new Error("Only audio files are allowed for audio!"), false);
            }
        }
        cb(null, true);
    },
    limits: {
        fileSize: 3 * 1024 * 1024 // Limiting file size to 3MB
    }
}).fields([{ name: "thumbnail", maxCount: 1 }, { name: "audio", maxCount: 1 }]);

// Function to add a new song and upload files
const addSong = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        const { title, singer, albumId } = req.body;

        // Check for required fields
        if (!req.files || !req.files.thumbnail || !req.files.audio || !title || !singer || !albumId) {
            return res.status(400).json({ message: "All fields are required." });
        }

        try {
            const thumbnailName = req.files.thumbnail[0].filename;
            const audioName = req.files.audio[0].filename;

            const newSong = new Songs({
                title: title,
                fileName: audioName,
                filePath: `/public/audio/${audioName}`,
                singer: singer,
                thumbnailPath: `/public/images/${thumbnailName}`,
                album: albumId
            });

            // Save new song to database
            await newSong.save();

            // Add song reference to the album
            const album = await Album.findById(albumId);
            if (album) {
                album.songs.push(newSong._id);
                await album.save();
            }

            res.status(200).json({ message: "Song uploaded successfully!", data: newSong });
        } catch (error) {
            console.error('Error saving song:', error);
            res.status(500).json({ message: 'Error saving song', error });
        }
    });
};

// Function to get all songs from the database
const getSongs = async (req, res) => {
    try {
        // Fetch all songs and populate album data
        const songs = await Songs.find().populate('album');
        res.status(200).json(songs);
    } catch (error) {
        console.error('Error fetching songs:', error);
        res.status(500).json({ message: 'Error fetching songs', error });
    }
};

// Function to find and delete a song from the database by its ID
const deleteById = async (req, res) => {
    const { id } = req.body;

    // Check if the id is provided
    if (!id) {
        return res.status(400).json({ message: "ID is required" });
    }

    try {
        // Find and delete the song by its ID
        const song = await Songs.findByIdAndDelete(id);

        if (!song) {
            return res.status(404).json({ message: "Song not found" });
        }

        // Remove song reference from the album
        await Album.updateOne({ songs: id }, { $pull: { songs: id } });

        res.status(200).json({ message: "Song deleted successfully", song });
    } catch (error) {
        console.error('Error deleting song:', error);
        res.status(500).json({ message: 'Error deleting song', error });
    }
};

// Function to update an existing song
const updateSong = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        const { id, title, singer, albumId } = req.body;

        if (!id) {
            return res.status(400).json({ message: "ID is required." });
        }

        // Prepare update fields
        const updateFields = {
            title,
            singer,
            album: albumId
        };

        if (req.files && req.files.thumbnail) {
            updateFields.thumbnailPath = `/public/images/${req.files.thumbnail[0].filename}`;
        }

        if (req.files && req.files.audio) {
            updateFields.fileName = req.files.audio[0].filename;
            updateFields.filePath = `/public/audio/${req.files.audio[0].filename}`;
        }

        try {
            // Find the song by ID and update it with the new data
            const updatedSong = await Songs.findByIdAndUpdate(id, updateFields, { new: true });

            if (!updatedSong) {
                return res.status(404).json({ message: "Song not found." });
            }

            // Update album references if albumId has changed
            if (albumId) {
                const oldAlbum = await Album.findOne({ songs: id });
                if (oldAlbum && oldAlbum._id.toString() !== albumId) {
                    oldAlbum.songs.pull(id);
                    await oldAlbum.save();

                    const newAlbum = await Album.findById(albumId);
                    newAlbum.songs.push(id);
                    await newAlbum.save();
                }
            }

            res.status(200).json({ message: "Song updated successfully!", data: updatedSong });
        } catch (error) {
            console.error('Error updating song:', error);
            res.status(500).json({ message: 'Error updating song', error });
        }
    });
};

export { addSong, getSongs, deleteById, updateSong };
