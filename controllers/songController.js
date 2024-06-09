import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';


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

        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
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



const AddSong=async (req, res) => {
    upload(req, res, function (err) {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        
     
        if (!req.files || !req.files.thumbnail || !req.files.audio) {
            return res.status(400).json({ message: "Both thumbnail and audio files are required." });
        }

  
        const thumbnailPath = req.files.thumbnail[0].path;
        const audioPath = req.files.audio[0].path;


        res.status(200).json({
            message: "Song uploaded successfully!",
            thumbnailPath: thumbnailPath,
            audioPath: audioPath
        });
    });
};

export default AddSong;