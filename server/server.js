const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer')

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/stl', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const connection = mongoose.connection;
connection.once('open', function () {
    console.log("MongoDB Database connection established Successfully.");
});

const PORT = 4000;
app.listen(PORT, function () {
    console.log("Server is Running on PORT: " + PORT);
});

let petSchema = require('./models/pet.model');
let photoSchema = require('./models/pet-photo.model');

const petRoutes = express.Router();
const userRoutes = express.Router();
app.use('/pets', petRoutes);
app.use('/users', userRoutes);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/uploads/');
    },
    filename: function (req, file, cb) {
        console.log(file);
        cb(null, req.body.petPhotoName);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

petRoutes.route('/').get(function (req, res) {
    petSchema.find(function (err, allPets) {
        if (err) {
            res.status(500).send({ get_error: err });
        } else {
            res.json(allPets);
        }
    });
});

petRoutes.route('/:id').get(function (req, res) {
    let id = req.params.id;
    console.log(id);
    petSchema.findById(id, function (err, pet) {
        if (err) {
            console.log(err);
        } else {
            res.json(pet);
        }
    });
});

petRoutes.route('/update/:id').patch(function (req, res) {
    let id = req.params.id;
    petSchema.findByIdAndUpdate(id, req.body, function (err, updatedPet) {
        if (err) {
            res.status(err.status).send(err.body);
        }
        else {
            if (!updatedPet) {
                res.status(404).send("microchip " + req.body.microchip + " is not found");
            } else {
                res.status(200).json(
                    {
                        'updated-pet': updatedPet
                    }
                )
            }
        }
    });
});

petRoutes.route('/register').post(function (req, res, next) {
    const newPet = new petSchema(req.body);

    newPet.save().then(pet => {
        res.status(200).json(
            {
                'registered-pet': pet
            }
        )
    }).catch(err => next(err));
});

petRoutes.route('/register/photo').post(upload.single('petPhotoData'), (req, res, next) => {
    let petMicrochip = req.body.petMicrochip;
    photoSchema.findoneand
    photoSchema.findOneAndDelete({ 'petMicrochip': petMicrochip }, function (err, photoData) {
        if (err) {
            console.log("Deleting pre-uploaded pet's image has been failed");
        } else {
            if (!photoData) {
                console.log("This Pet's image has not been uploaded yet");
            } else {
                console.log("pre-uploaded photo has been removed");
                console.log(photoData);
            }
        }
    })

    const newPetPhoto = new photoSchema({
        petMicrochip: petMicrochip,
        petPhotoName: req.body.petPhotoName,
        petPhotoData: req.file.path
    });

    newPetPhoto.save().then(photo => {
        res.status(200).json(
            {
                'uploaded-photo': photo
            }
        )
    }).catch(err => next(err));
});

petRoutes.route('/photos').get(function (req, res) {
    photoSchema.find(function (err, allPhotos) {
        if (err) {
            res.status(500).send({ get_error: err });
        } else {
            res.json(allPhotos);
        }
    });
});

petRoutes.route('/photos/:microchip').get(function (req, res, next) {
    let microchip = req.params.microchip;

    photoSchema.findOne({ 'petMicrochip': microchip }, 'petPhotoData', function (err, photoData) {
        if (err) {
            res.status(500).send({ get_error: err });
        } else {
            if (photoData) {
                res.set('Content-Type', 'image/jpeg');
                res.send(photoData.petPhotoData);
            } else {
                res.status(404).send("this pet's photo is not uploaded yet")
            }
        }
    })
});