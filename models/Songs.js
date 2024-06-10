import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true,
        trim:true,
    },
    fileName:{
        type:String,
        required:true,
    },
    filePath:{
        type:String,
        required:true,
    },
    singer:{
        type:String,
        required:true,
    },
    thumbnailPath:{
        type:String,
        required:true,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    }
});

const Songs = mongoose.model('Songs', userSchema);

export default Songs;
