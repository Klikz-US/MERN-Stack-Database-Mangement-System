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
mongoose.set('useFindAndModify', false);

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

const ownerRoutes = express.Router();
const petRoutes = express.Router();
const photoRoutes = express.Router();
app.use('/owners', ownerRoutes);
app.use('/pets', petRoutes);
app.use('/photos', photoRoutes);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/uploads/');
    },
    filename: function (req, file, cb) {
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


/*
 * For Pet
 */
petRoutes.route('/').get(function (req, res) {
    petSchema.find(function (err, allPets) {
        if (err) {
            res.status(500).send({ get_error: err });
        } else {
            res.json(allPets);
        }
    });
});

petRoutes.route('/count').get(function (req, res) {
    petSchema.find().countDocuments(function (err, count) {
        if (err) {
            res.status(500).send({ get_error: err });
        } else {
            res.json(count);
        }
    })
});

petRoutes.route('/page/:pageId').get(function (req, res) {
    let pageId = req.params.pageId;

    petSchema.paginate(
        {},
        {
            page: pageId,
            limit: 20,
            sort: {
                updated_at: -1
            }
        },
        function (err, pets) {
            if (err) {
                res.status(500).send({ get_error: err });
            } else {
                res.json(pets.docs);
            }
        }
    );
});

petRoutes.route('/:microchip').get(function (req, res) {
    let microchip = req.params.microchip;
    petSchema.findOne({ "microchip": microchip }, function (err, pet) {
        if (err) {
            res.status(500).send({ get_error: err });
        } else {
            if (!pet) {
                res.status(404).send("Microchip is not registered yet.");
            } else {
                let email = pet.email;
                ownerSchema.findOne({ "email": email }, function (err, owner) {
                    if (err) {
                        res.status(500).send({ get_error: err });
                    } else {
                        if (!owner) {
                            res.status(404).send("Owner is not registered yet.");
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
    let email = req.body.email;
    let microchip = req.body.microchip;

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
                                res.status(404).send("Pet is not registered");
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
    let email = req.body.email;
    let microchip = req.body.microchip;

    const newPet = new petSchema(req.body);
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

                petSchema.findOne(
                    {
                        'microchip': microchip
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
                                res.status(403).send("Pet already has been registered.");
                            }
                        }
                    }
                );
            }
        }
    );
});


/*
 * For Owner
 */
ownerRoutes.route('/').get(function (req, res) {
    ownerSchema.find(function (err, allOwners) {
        if (err) {
            res.status(500).send({ get_error: err });
        } else {
            res.json(allOwners);
        }
    });
});

ownerRoutes.route('/count').get(function (req, res) {
    ownerSchema.find().countDocuments(function (err, count) {
        if (err) {
            res.status(500).send({ get_error: err });
        } else {
            res.json(count);
        }
    })
});

ownerRoutes.route('/page/:pageId').get(function (req, res) {
    let pageId = req.params.pageId;

    ownerSchema.paginate(
        {},
        {
            page: pageId,
            limit: 20,
            sort: {
                updated_at: -1
            }
        },
        function (err, owners) {
            if (err) {
                res.status(500).send({ get_error: err });
            } else {
                res.json(owners.docs);
            }
        }
    );
});

ownerRoutes.route('/:_id').get(function (req, res) {
    let _id = req.params._id;
    ownerSchema.findOne({ "_id": _id }, function (err, owner) {
        if (err) {
            res.status(500).send({ get_error: err });
        } else {
            if (!owner) {
                res.status(404).send("Owner Not found");
            } else {
                res.json(owner)
            }
        }
    });
});

ownerRoutes.route('/update/:_id').patch(function (req, res) {
    let _id = req.params._id;
    ownerSchema.findOneAndUpdate(
        {
            '_id': _id
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
                    res.status(404).send("Owner Not Found");
                } else {
                    res.json(owner);
                }
            }
        }
    );
});

ownerRoutes.route('/register').post(function (req, res) {
    let email = req.body.email;
    const newOwner = new ownerSchema(req.body);

    ownerSchema.findOne(
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
                    newOwner.save()
                        .then(owner => {
                            res.json(owner);
                        })
                        .catch(err => {
                            res.status(500).send({ get_error: err });
                        });
                } else {
                    res.status(403).send("Owner has already been registered");
                }
            }
        }
    );
});


/*
 * For Pet Photo
 */
photoRoutes.route('/').get(function (req, res) {
    photoSchema.find(function (err, allPhotos) {
        if (err) {
            res.status(500).send({ get_error: err });
        } else {
            res.json(allPhotos);
        }
    });
});

photoRoutes.route('/:microchip').get(function (req, res) {
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

photoRoutes.route('/add').post(upload.single('petPhotoData'), (req, res, next) => {
    let petMicrochip = req.body.petMicrochip;
    photoSchema.findOneAndDelete({ 'petMicrochip': petMicrochip }, function (err, photoData) { });

    const newPetPhoto = new photoSchema({
        petMicrochip: petMicrochip,
        petPhotoName: req.body.petPhotoName,
        petPhotoData: req.file.path
    });

    newPetPhoto.save().then(photo => {
        res.json(
            {
                'uploaded-photo': photo
            }
        )
    }).catch(err => next(err));
});