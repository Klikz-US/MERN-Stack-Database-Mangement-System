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

let ownerSchema = require('./models/owner.model');
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

petRoutes.route('/:microchip').get(function (req, res) {
    let microchip = req.params.microchip;
    petSchema.findOne({ "microchip": microchip }, function (err, pet) {
        if (err) {
            console.log(err);
        } else {
            if (!pet) {
                res.status(404).send("Pet Not found");
            } else {
                let email = pet.email;

                ownerSchema.findOne({ "email": email }, function (err, owner) {
                    if (err) {
                        console.log(err);
                    } else {
                        if (!owner) {
                            res.status(404).send("Owner Not found");
                        } else {
                            const response = { ...pet._doc, ...owner._doc };
                            delete response._id;
                            delete response.__v
                            res.json(response);
                        }
                    }
                });
            }
        }
    });
});

petRoutes.route('/update').patch(function (req, res) {
    mongoose.set('useFindAndModify', false);

    let email = req.body.email;
    const newOwner = new ownerSchema(req.body);
    ownerSchema.findOneAndUpdate(
        {
            'email': email
        },
        req.body,
        {
            returnOriginal: false,
            new: true
        },
        function (err, owner) {
            if (err) {
                res.status(500).send({ get_error: err });
            } else {
                if (!owner) {
                    newOwner.save();
                }

                let microchip = req.body.microchip;
                const newPet = new petSchema(req.body);

                petSchema.findOneAndUpdate(
                    {
                        'microchip': microchip
                    },
                    req.body,
                    {
                        returnOriginal: false,
                        new: true
                    },
                    function (err, pet) {
                        if (err) {
                            res.status(500).send({ get_error: err });
                        } else {
                            if (!pet) {
                                res.status(404).send("Pet not found.");
                            } else {
                                res.json(
                                    {
                                        "owner": owner,
                                        "pet": pet
                                    }
                                );
                            }
                        }
                    }
                );
            }
        }
    );
});

petRoutes.route('/register').post(function (req, res, next) {
    mongoose.set('useFindAndModify', false);

    let email = req.body.email;
    const newOwner = new ownerSchema(req.body);
    ownerSchema.findOneAndUpdate(
        {
            'email': email
        },
        req.body,
        {
            returnOriginal: false,
            new: true
        },
        function (err, owner) {
            if (err) {
                res.status(500).send({ get_error: err });
            } else {
                if (!owner) {
                    newOwner.save();
                }

                let microchip = req.body.microchip;
                const newPet = new petSchema(req.body);

                petSchema.findOneAndUpdate(
                    {
                        'microchip': microchip
                    },
                    req.body,
                    {
                        returnOriginal: false,
                        new: true
                    },
                    function (err, pet) {
                        if (err) {
                            res.status(500).send({ get_error: err });
                        } else {
                            if (!pet) {
                                newPet.save().then(pet => {
                                    res.json(
                                        {
                                            "owner": owner,
                                            "pet": pet
                                        }
                                    );
                                }).catch(err => next(err));
                            } else {
                                res.status(404).send("Pet already has been registered.");
                            }
                        }
                    }
                );
            }
        }
    );
});

petRoutes.route('/register/photo').post(upload.single('petPhotoData'), (req, res, next) => {
    let petMicrochip = req.body.petMicrochip;
    photoSchema.findOneAndDelete({ 'petMicrochip': petMicrochip });

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

    photoSchema.findOne({ 'petMicrochip': microchip }, function (err, photoData) {
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
    });
});