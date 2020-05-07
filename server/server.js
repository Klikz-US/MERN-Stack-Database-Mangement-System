require('dotenv').config();

const http_port = process.env.HTTP_PORT;
const https_port = process.env.HTTPS_PORT;
const db_addr = process.env.DB_ADDR;
const photo_path = process.env.PHOTO_PATH;
const allowed_domains = ['http://portal.klikz.com', 'http://localhost:3000'];

const {
    refreshTokens, COOKIE_OPTIONS, generateToken, generateRefreshToken, getCleanUser, verifyToken, clearTokens, handleResponse,
} = require('./utils/token');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (allowed_domains.indexOf(origin) === -1) {
            var msg = "This site ${origin} does not have an access. Only specific domains are allowed to access it.";
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

const fs = require('fs');
const http = require('http');
const https = require('https');
const credentials = {
    key: fs.readFileSync("./ssl/wildcard_klikz_us_private.key"),
    cert: fs.readFileSync("./ssl/wildcard_klikz_us.crt"),
    ca: [
        fs.readFileSync('./ssl/CA_root.crt'),
        fs.readFileSync('./ssl/alphasslrootcabundle.crt')
    ]
};
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(http_port, () => {
    console.log('HTTP Server running on port ' + http_port);
});
httpsServer.listen(https_port, () => {
    console.log('HTTPS Server running on port ' + https_port);
});

mongoose.connect(db_addr, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.set('useFindAndModify', false);

const connection = mongoose.connection;
connection.once('open', function () {
    console.log("MongoDB Database connection established Successfully.");
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, photo_path);
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
 * User
 */
// list of the users to be consider as a database for example
const userList = [
    {
        userId: "123",
        password: "clue",
        name: "Clue",
        username: "clue",
        isAdmin: true
    },
    {
        userId: "456",
        password: "mediator",
        name: "Mediator",
        username: "mediator",
        isAdmin: true
    },
    {
        userId: "789",
        password: "123456",
        name: "Clue Mediator",
        username: "cluemediator",
        isAdmin: true
    }
]


// middleware that checks if JWT token exists and verifies it if it does exist.
// In all private routes, this helps to know if the request is authenticated or not.
const authMiddleware = function (req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.headers['authorization'];
    if (!token) return handleResponse(req, res, 401);

    token = token.replace('Bearer ', '');

    // get xsrf token from the header
    const xsrfToken = req.headers['x-xsrf-token'];
    if (!xsrfToken) {
        return handleResponse(req, res, 403);
    }

    // verify xsrf token
    const { signedCookies = {} } = req;
    const { refreshToken } = signedCookies;
    if (!refreshToken || !(refreshToken in refreshTokens) || refreshTokens[refreshToken] !== xsrfToken) {
        return handleResponse(req, res, 401);
    }

    // verify token with secret key and xsrf token
    verifyToken(token, xsrfToken, (err, payload) => {
        if (err)
            return handleResponse(req, res, 401);
        else {
            req.user = payload; //set the user to req so other routes can use it
            next();
        }
    });
}


// validate user credentials
app.post('/users/signin', function (req, res) {
    const user = req.body.username;
    const pwd = req.body.password;

    // return 400 status if username/password is not exist
    if (!user || !pwd) {
        return handleResponse(req, res, 400, null, "Username and Password required.");
    }

    const userData = userList.find(x => x.username === user && x.password === pwd);

    // return 401 status if the credential is not matched
    if (!userData) {
        return handleResponse(req, res, 401, null, "Username or Password is Wrong.");
    }

    // get basic user details
    const userObj = getCleanUser(userData);

    // generate access token
    const tokenObj = generateToken(userData);

    // generate refresh token
    const refreshToken = generateRefreshToken(userObj.userId);

    // refresh token list to manage the xsrf token
    refreshTokens[refreshToken] = tokenObj.xsrfToken;

    // set cookies
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
    res.cookie('XSRF-TOKEN', tokenObj.xsrfToken);

    return handleResponse(req, res, 200, {
        user: userObj,
        token: tokenObj.token,
        expiredAt: tokenObj.expiredAt
    });
});


// handle user logout
app.post('/users/logout', (req, res) => {
    clearTokens(req, res);
    return handleResponse(req, res, 204);
});


// verify the token and return new tokens if it's valid
app.post('/verifyToken', function (req, res) {

    const { signedCookies = {} } = req;
    const { refreshToken } = signedCookies;
    if (!refreshToken) {
        return handleResponse(req, res, 204);
    }

    // verify xsrf token
    const xsrfToken = req.headers['x-xsrf-token'];
    if (!xsrfToken || !(refreshToken in refreshTokens) || refreshTokens[refreshToken] !== xsrfToken) {
        return handleResponse(req, res, 401);
    }

    // verify refresh token
    verifyToken(refreshToken, '', (err, payload) => {
        if (err) {
            return handleResponse(req, res, 401);
        }
        else {
            const userData = userList.find(x => x.userId === payload.userId);
            if (!userData) {
                return handleResponse(req, res, 401);
            }

            // get basic user details
            const userObj = getCleanUser(userData);

            // generate access token
            const tokenObj = generateToken(userData);

            // refresh token list to manage the xsrf token
            refreshTokens[refreshToken] = tokenObj.xsrfToken;
            res.cookie('XSRF-TOKEN', tokenObj.xsrfToken);

            // return the token along with user details
            return handleResponse(req, res, 200, {
                user: userObj,
                token: tokenObj.token,
                expiredAt: tokenObj.expiredAt
            });
        }
    });

});


// get list of the users
app.get('/users/getList', authMiddleware, (req, res) => {
    const list = userList.map(x => {
        const user = { ...x };
        delete user.password;
        return user;
    });
    return handleResponse(req, res, 200, { random: Math.random(), userList: list });
});


/*
 * For Pets
 */
const petSchema = require('./models/pet.model');
const petRoutes = express.Router();
app.use('/pets', petRoutes);

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
 * For Owners
 */
const ownerSchema = require('./models/owner.model');
const ownerRoutes = express.Router();
app.use('/owners', ownerRoutes);

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
const photoSchema = require('./models/photo.model');
const photoRoutes = express.Router();
app.use('/photos', photoRoutes);

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