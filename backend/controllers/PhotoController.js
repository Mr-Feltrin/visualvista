const Photo = require("../models/Photo");
const User = require("../models/User");
const mongoose = require("mongoose");
const MongoError = require("../errors/MongoError");

// Insert a photo with a user related to it
const insertPhoto = async (req, res) => {
    const { title } = req.body;
    const image = req.file.filename;
    const reqUser = req.user;
    try {
        const user = await User.findById(reqUser._id);
        // Create a photo
        const newPhoto = await Photo.create({
            image,
            title,
            userId: user._id,
            userName: user.name
        });
        // If photo was created succesfully, return data
        if (!newPhoto) {
            res.status(222).json({ errors: ["Houve um problema, tente novamente mais tarde"] });
            return;
        }
        res.status(201).json(newPhoto);
    }
    catch (error) {
        res.status(222).json({ errors: ["Houve um problema, tente novamente mais tarde"] });
    }
}

// Remove a photo from DB
const deletePhoto = async (req, res) => {
    try {
        const { id } = req.params;
        const reqUser = req.user;
        const photo = mongoose.isValidObjectId(id) ? await Photo.findById(new mongoose.Types.ObjectId(id)) : null;
        // Check if photo exists
        if (!photo) {
            throw new MongoError("Foto não encontrada", 404);
        }
        // Check if photo belongs to the user
        if (!photo.userId.equals(reqUser._id)) {
            throw new MongoError("Acesso negado", 422);
        }
        await Photo.findByIdAndDelete(photo._id);
        res.status(200).json({ id: photo._id, message: "Foto excluída com sucesso" });
    }
    catch (error) {
        res.status(error.status || 500).json({ errors: error.status ? [error.message] : ["Ocorreu um erro, por favor tente mais tarde"] });
    }
}

// Get all photos
const getAllPhotos = async (req, res) => {
    try {
        const photos = await Photo.find({}).sort([["createdAt", -1]]).exec();
        return res.status(200).json(photos);
    }
    catch (error) {
        console.log(error.message);
        return res.status(422).json({ errors: ["Ocorreu um erro ao buscar fotos, tente mais tarde"] });
    }
}

// Get photo by id
const getPhotoById = async (req, res) => {
    try {
        const { id } = req.params;
        const photo = mongoose.isValidObjectId(id) ? await Photo.findById(id) : null;
        // Check if the photo exists
        if (!photo) {
            throw new MongoError("A foto não foi encontrada", 404);
        }
        res.status(200).json(photo);
    }
    catch (error) {
        res.status(error.status || 500).json({ errors: error.status ? [error.message] : ["Ocorreu um erro inesperado, por favor tente mais tarde"] });
    }
}

// Get user photos
const getUserPhotos = async (req, res) => {
    try {
        const { id } = req.params;
        const photos = await Photo.find({ userId: id }).sort([["createdAt", -1]]).exec();
        return res.status(200).json(photos);
    }
    catch (error) {
        console.log(error.message);
        return res.status(422).json({ errors: ["Ocorreu um erro ao buscar fotos, tente mais tarde"] });
    }
}

// Update a photo
const updatePhoto = async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        const reqUser = req.user;
        const photo = mongoose.isValidObjectId(id) ? await Photo.findById(id) : null;
        // Check if photo exists
        if (!photo) {
            throw new MongoError("Foto não encontrada", 404);
        }
        // Check if photo belongs to the current user
        if (!photo.userId.equals(reqUser._id)) {
            throw new MongoError("Ocorreu um erro, tente novamente mais tarde", 422);
        }
        if (title) {
            photo.title = title;
        }
        await photo.save();
        res.status(200).json({ photo, message: "Foto atualizada com sucesso" });
    }
    catch (error) {
        res.status(error.status || 500).json({ errors: error.status ? [error.message] : ["Ocorreu um erro inesperado, tente novamente mais tarde"] });
    }
}

// Like a photo functionality
const likePhoto = async (req, res) => {
    try {
        const { id } = req.params;
        const reqUser = req.user;
        const photo = mongoose.isValidObjectId(id) ? await Photo.findById(id) : null;
        if (!photo) {
            throw new MongoError("Foto não encontrada", 404);
        }
        // Check if the user already liked the photo
        if (photo.likes.includes(reqUser._id)) {
            throw new MongoError("Você já curtiu a foto", 422);
        }
        // Place user id in the likes array
        photo.likes.push(reqUser._id);
        photo.save();
        res.status(200).json({ photoId: id, userId: reqUser._id, message: "A foto foi curtida" });
    }
    catch (error) {
        res.status(error.status || 500).json({ errors: error.status ? [error.message] : ["Ocorreu um erro, tente novamente mais tarde"] });
    }
}

// Comment a photo functionallity
const commentPhoto = async (req, res) => {
    try {
        const { id } = req.params;
        const { comment } = req.body;
        const reqUser = req.user;
        const user = mongoose.isValidObjectId(id) ? await User.findById(reqUser._id) : null;
        const photo = mongoose.isValidObjectId(id) ? await Photo.findById(id) : null;
        if (!photo) {
            throw new MongoError("Foto não encontrada", 404);
        }
        if (!user) {
            throw new MongoError("Usuário não encontrado", 404);
        }
        // Add the comment to the comments array
        const userComment = {
            comment,
            userName: user.name,
            userImage: user.profileImage,
            userId: user._id
        };
        await photo.comments.push(userComment)
        await photo.save();
        res.status(200).json({ comment: userComment, message: "O comentário foi adicionado com sucesso" });

    }
    catch (error) {
        res.status(error.status || 500).json({ errors: error.status ? [error.message] : ["Ocorreu um erro, tente novamente mais tarde"] });
    }
}

// Search photos by title
const searchPhotoByTitle = async (req, res) => {
    try {
        const {q} = req.query;
        const photos = await Photo.find({title: new RegExp(q, "i")}).exec();
        res.status(200).json(photos);
    }
    catch (error) {
        res.status(500).json({errors: ["Ocorreu um erro, tente novamente mais tarde"]});
    }
}

module.exports = {
    insertPhoto,
    deletePhoto,
    getAllPhotos,
    getUserPhotos,
    getPhotoById,
    updatePhoto,
    likePhoto,
    commentPhoto,
    searchPhotoByTitle
}