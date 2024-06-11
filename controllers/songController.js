import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

import Songs from '../models/Songs.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if(file.mimetype.startsWith("audio/")){
            cb(null, path.resolve(__dirname, '../public/audio')); 
        }else{
            cb(null, path.resolve(__dirname, '../public/images')); 
        }
    },
    filename: function (req, file, cb) {

        cb(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {

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
        fileSize: 10 * 1024 * 1024 
    }
}).fields([{ name: "thumbnail", maxCount: 1 }, { name: "audio", maxCount: 1 }]);




//function to upload song and add in database



const AddSong= (req, res) => {
    upload(req, res, async function (err) {

        const {title,singer}=req.body;

        if (err) {
            return res.status(400).json({ message: err.message });
        }
        
     
        if (!req.files || !req.files.thumbnail || !req.files.audio || !title || !singer) {
            return res.status(400).json({ message: "all fields are required." });
        }


        console.log(req.files);

  

        const thumbnailName = req.files.thumbnail[0].filename;
        const audioName = req.files.audio[0].filename;
        
        const newSong=new Songs({
            title : title,
            fileName : audioName,
            filePath : "/public/audio/"+audioName,
            singer : singer,
            thumbnailPath : "/public/images/"+thumbnailName
        });

        await newSong.save();


        res.status(200).json({
            message: "Song uploaded successfully!",
            data:{
                title : title,
                fileName : audioName,
                filePath : "/public/audio/"+audioName,
                singer : singer,
                thumbnailPath : "/public/images/"+thumbnailName
            }
        });
    });
};


// Function to get all songs from the database
const GetSongs = async (req, res) => {


    try{
    // Find all documents in the Songs collection
        const songs=await Songs.find();
    

        res.status(200).json(songs);

    }catch (error){
        console.error('Error fetching songs:', error);
            res.status(500).json({ message: 'Error fetching songs', error });
    }
       
};





// Function to find and delete a song from the database by its ID
const DeleteById = async (req, res) => {
    const { id } = req.body;

    // Check if the id is provided
    if (!id) {
        return res.status(400).json({ message: "ID is required" });
    }

    try {
        // Find and delete the song by its ID
        const response = await Songs.findByIdAndDelete(id);

        // If no song is found, return a 404 status code
        if (!response) {
            return res.status(404).json({ message: "Song not found" });
        }

        // Send the deleted song's details as a JSON response
        res.status(200).json({ message: "Song deleted successfully", song: response });
    } catch (error) {
        console.error('Error deleting song:', error);
        res.status(500).json({ message: 'Error deleting song', error });
    }
};


// Function to update an existing song
const UpdateSong = (req, res) => {
    upload(req, res, async function (err) {
        const { id, title, singer } = req.body;

        if (err) {
            return res.status(400).json({ message: err.message });
        }

        // Validate ID and required fields
        if (!id) {
            return res.status(400).json({ message: "ID is required." });
        }
        if (!title || !singer) {
            return res.status(400).json({ message: "Title and Singer are required." });
        }

        // Prepare update fields
        const updateFields = {
            title,
            singer,
        };

        if (req.files && req.files.thumbnail) {
            updateFields.thumbnailPath = req.files.thumbnail[0].path;
        }

        if (req.files && req.files.audio) {
            updateFields.fileName = req.files.audio[0].originalname;
            updateFields.filePath = req.files.audio[0].path;
        }

        try {
            // Find the song by ID and update it with the new data
            const updatedSong = await Songs.findByIdAndUpdate(id, updateFields, { new: true });

            // If the song does not exist, return 404
            if (!updatedSong) {
                return res.status(404).json({ message: "Song not found." });
            }

            // Respond with the updated song
            res.status(200).json({
                message: "Song updated successfully!",
                data: updatedSong
            });
        } catch (error) {
            console.error('Error updating song:', error);
            res.status(500).json({ message: 'Error updating song', error });
        }
    });
};


export  {AddSong , GetSongs , DeleteById , UpdateSong};