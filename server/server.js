require("dotenv").config();

const http_port = process.env.HTTP_PORT;
const https_port = process.env.HTTPS_PORT;
const db_addr = process.env.DB_ADDR_LOCAL;
const photo_path = process.env.PHOTO_PATH;
const allowed_domains = ["https://portal.klikz.us", "http://localhost:3000"];

const {
    refreshTokens,
    COOKIE_OPTIONS,
    generateToken,
    generateRefreshToken,
    getCleanUser,
    verifyToken,
    clearTokens,
    handleResponse,
} = require("./utils/token");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const cookieParser = require("cookie-parser");

const app = express();
app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);

            if (allowed_domains.indexOf(origin) === -1) {
                var msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`;
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        },
        credentials: true,
    })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

const fs = require("fs");
const http = require("http");
const https = require("https");
const credentials = {
    key: fs.readFileSync("./ssl/wildcard_klikz_us_private.key"),
    cert: fs.readFileSync("./ssl/wildcard_klikz_us.crt"),
    ca: [
        fs.readFileSync("./ssl/CA_root.crt"),
        fs.readFileSync("./ssl/alphasslrootcabundle.crt"),
    ],
};
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(http_port, () => {
    console.log("HTTP Server running on port " + http_port);
});
httpsServer.listen(https_port, () => {
    console.log("HTTPS Server running on port " + https_port);
});

mongoose.connect(db_addr, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose.set("useFindAndModify", false);

const connection = mongoose.connection;
connection.once("open", function () {
    console.log("MongoDB Database connection established Successfully.");
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, photo_path);
    },
    filename: function (req, file, cb) {
        cb(null, req.body.petPhotoName);
    },
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/png"
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
    fileFilter: fileFilter,
});

/*
 * User
 */
const authMiddleware = function (req, res, next) {
    var token = req.headers["authorization"];
    if (!token) return handleResponse(req, res, 401);

    token = token.replace("Bearer ", "");

    // get xsrf token from the header
    const xsrfToken = req.cookies["XSRF-TOKEN"];
    if (!xsrfToken) {
        return handleResponse(req, res, 403);
    }

    // verify xsrf token
    const { signedCookies = {} } = req;
    const { refreshToken } = signedCookies;
    if (
        !refreshToken ||
        !(refreshToken in refreshTokens) ||
        refreshTokens[refreshToken] !== xsrfToken
    ) {
        return handleResponse(req, res, 401);
    }

    // verify token with secret key and xsrf token
    verifyToken(token, xsrfToken, (err, payload) => {
        if (err) return handleResponse(req, res, 401);
        else {
            req.user = payload; //set the user to req so other routes can use it
            next();
        }
    });
};

const userSchema = require("./models/user.model");
const adminRoutes = express.Router();
app.use("/", adminRoutes);

adminRoutes.route("/login").post(function (req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return handleResponse(
            req,
            res,
            400,
            null,
            "Username and Password required."
        );
    }

    userSchema.findOne({ email: email, password: password }, function (
        err,
        user
    ) {
        if (err) {
            next(err);
        } else {
            if (!user) {
                res.status(401).send("Username or Password is Wrong.");
            } else {
                const userObj = getCleanUser(user);
                const tokenObj = generateToken(user);
                const refreshToken = generateRefreshToken(userObj.userId);
                refreshTokens[refreshToken] = tokenObj.xsrfToken;

                res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
                res.cookie("XSRF-TOKEN", tokenObj.xsrfToken);

                return handleResponse(req, res, 200, {
                    user: userObj,
                    token: tokenObj.token,
                    expiredAt: tokenObj.expiredAt,
                });
            }
        }
    });
});

// handle user logout
adminRoutes.route("/logout").post(function (req, res) {
    clearTokens(req, res);
    return handleResponse(req, res, 204);
});

// verify the token and return new tokens if it's valid
adminRoutes.route("/verifyToken").post(function (req, res) {
    const { signedCookies = {} } = req;
    const { refreshToken } = signedCookies;
    if (!refreshToken) {
        return handleResponse(req, res, 204);
    }

    // verify xsrf token
    const xsrfToken = req.cookies["XSRF-TOKEN"];

    if (
        !xsrfToken ||
        !(refreshToken in refreshTokens) ||
        refreshTokens[refreshToken] !== xsrfToken
    ) {
        return handleResponse(req, res, 401);
    }
    // verify refresh token
    verifyToken(refreshToken, "", (err, payload) => {
        if (err) {
            return handleResponse(req, res, 401);
        } else {
            userSchema.findOne({ _id: payload.userId }, function (
                err,
                userData
            ) {
                if (!userData) {
                    return handleResponse(req, res, 401);
                }

                // get basic user details
                const userObj = getCleanUser(userData);

                // generate access token
                const tokenObj = generateToken(userData);

                // refresh token list to manage the xsrf token
                refreshTokens[refreshToken] = tokenObj.xsrfToken;
                res.cookie("XSRF-TOKEN", tokenObj.xsrfToken);

                // return the token along with user details
                return handleResponse(req, res, 200, {
                    user: userObj,
                    token: tokenObj.token,
                    expiredAt: tokenObj.expiredAt,
                });
            });
        }
    });
});

const userRoutes = express.Router();
app.use("/users", userRoutes);

userRoutes.route("/").get(authMiddleware, (req, res, next) => {
    userSchema.find(function (err, users) {
        if (err) {
            next(err);
        } else {
            const userList = users.map((user) => {
                delete user.password;
                return user;
            });
            return handleResponse(req, res, 200, { userList: userList });
        }
    });
});

userRoutes.route("/:_id").get(authMiddleware, (req, res, next) => {
    const _id = req.params._id;
    userSchema.findOne({ _id: _id }, function (err, user) {
        if (err) {
            next(err);
        } else {
            delete user.password;
            return handleResponse(req, res, 200, user);
        }
    });
});

userRoutes.route("/add").post(authMiddleware, (req, res, next) => {
    const email = req.body.email;

    userSchema.findOne({ email: email }, function (err, user) {
        if (err) {
            next(err);
        } else {
            if (user) {
                res.status(403).send("Account is already exist");
            } else {
                const newUser = new userSchema(req.body);
                newUser
                    .save()
                    .then((user) => {
                        res.json(user);
                    })
                    .catch((err) => next(err));
            }
        }
    });
});

userRoutes.route("/delete/:_id").delete(authMiddleware, (req, res) => {
    const _id = req.params._id;

    userSchema.findOneAndDelete({ _id: _id }, function (err, user) {
        if (err) {
            next(err);
        } else {
            if (!user) {
                res.status(404).send("Account not exist");
            } else {
                userSchema.find(function (err, users) {
                    if (err) {
                        next(err);
                    } else {
                        res.json(users);
                    }
                });
            }
        }
    });
});

userRoutes.route("/update/:_id").patch(authMiddleware, (req, res, next) => {
    const _id = req.params._id;
    const updateUser = req.body;
    userSchema.findOneAndUpdate({ _id: _id }, updateUser, function (err, user) {
        if (err) {
            next(err);
        } else if (user) {
            delete user.password;
            return handleResponse(req, res, 200, user);
        }
    });
});

/*
 * For Pets
 */
const petSchema = require("./models/pet.model");
const petRoutes = express.Router();
app.use("/pets", petRoutes);

petRoutes.route("/").get(function (req, res, next) {
    petSchema.find(function (err, allPets) {
        if (err) {
            next(err);
        } else {
            res.json(allPets);
        }
    });
});

petRoutes.route("/count").get(authMiddleware, function (req, res, next) {
    petSchema.find().countDocuments(function (err, count) {
        if (err) {
            next(err);
        } else {
            res.json(count);
        }
    });
});

petRoutes.route("/page/:pageId").get(authMiddleware, function (req, res, next) {
    let pageId = req.params.pageId;

    petSchema.paginate(
        {},
        {
            page: pageId,
            limit: 20,
            sort: {
                _id: -1,
            },
        },
        function (err, pets) {
            if (err) {
                next(err);
            } else {
                return res.json(pets.docs);
            }
        }
    );
});

petRoutes.route("/:microchip").get(function (req, res, next) {
    let microchip = req.params.microchip;
    petSchema.findOne({ microchip: microchip }, function (err, pet) {
        if (err) {
            next(err);
        } else {
            if (!pet) {
                res.status(404).send("Microchip is not registered yet.");
            } else {
                let email = pet.email;
                ownerSchema.findOne({ email: email }, function (err, owner) {
                    if (err) {
                        next(err);
                    } else {
                        const response = { ...pet._doc, ...owner._doc };
                        delete response._id;
                        delete response.__v;
                        res.json(response);
                    }
                });
            }
        }
    });
});

petRoutes.route("/update").patch(function (req, res, next) {
    let microchip = req.body.microchip;

    petSchema.findOneAndUpdate(
        {
            microchip: microchip,
        },
        req.body,
        {
            returnOriginal: false,
            new: true,
        },
        function (err, pet) {
            if (err) {
                next(err);
            } else {
                if (!pet) {
                    res.status(404).send("Pet is not registered");
                } else {
                    res.json({
                        pet: pet,
                    });
                }
            }
        }
    );
});

petRoutes.route("/delete/:microchip").delete(authMiddleware, (req, res) => {
    const microchip = req.params.microchip;

    petSchema.findOneAndDelete({ microchip: microchip }, function (err, pet) {
        if (err) {
            next(err);
        } else {
            if (!pet) {
                res.status(404).send("Pet not exist");
            } else {
                res.json(pet);
            }
        }
    });
});

petRoutes.route("/register").post(function (req, res, next) {
    let email = req.body.email;
    let microchip = req.body.microchip;

    const newPet = new petSchema(req.body);
    const newOwner = new ownerSchema(req.body);

    ownerSchema.findOneAndUpdate(
        {
            email: email,
        },
        req.body,
        {
            returnOriginal: false,
            new: true,
        },
        function (err, owner) {
            if (err) {
                next(err);
            } else {
                if (!owner) {
                    newOwner.save();
                }

                petSchema.findOne(
                    {
                        microchip: microchip,
                    },
                    function (err, pet) {
                        if (err) {
                            next(err);
                        } else {
                            if (!pet) {
                                newPet
                                    .save()
                                    .then((pet) => {
                                        res.json({
                                            owner: owner,
                                            pet: pet,
                                        });
                                    })
                                    .catch((err) => next(err));
                            } else {
                                res.status(403).send(
                                    "Pet already has been registered."
                                );
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
const ownerSchema = require("./models/owner.model");
const ownerRoutes = express.Router();
app.use("/owners", ownerRoutes);

ownerRoutes.route("/").get(function (req, res, next) {
    ownerSchema.find(function (err, allOwners) {
        if (err) {
            next(err);
        } else {
            res.json(allOwners);
        }
    });
});

ownerRoutes.route("/count").get(function (req, res, next) {
    ownerSchema.find().countDocuments(function (err, count) {
        if (err) {
            next(err);
        } else {
            res.json(count);
        }
    });
});

ownerRoutes.route("/page/:pageId").get(function (req, res, next) {
    let pageId = req.params.pageId;

    ownerSchema.paginate(
        {},
        {
            page: pageId,
            limit: 20,
            sort: {
                _id: -1,
            },
        },
        function (err, owners) {
            if (err) {
                next(err);
            } else {
                res.json(owners.docs);
            }
        }
    );
});

ownerRoutes.route("/:_id").get(function (req, res, next) {
    let _id = req.params._id;
    ownerSchema.findOne({ _id: _id }, function (err, owner) {
        if (err) {
            next(err);
        } else {
            if (!owner) {
                res.status(404).send("Owner Not found");
            } else {
                res.json(owner);
            }
        }
    });
});

ownerRoutes.route("/update/:_id").patch(function (req, res, next) {
    let _id = req.params._id;
    ownerSchema.findOneAndUpdate(
        {
            _id: _id,
        },
        req.body,
        {
            returnOriginal: false,
            new: true,
        },
        function (err, owner) {
            if (err) {
                next(err);
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

ownerRoutes.route("/delete/:_id").delete(authMiddleware, (req, res) => {
    const _id = req.params._id;

    ownerSchema.findOneAndDelete({ _id: _id }, function (err, owner) {
        if (err) {
            next(err);
        } else {
            if (!owner) {
                res.status(404).send("Owner not exist");
            } else {
                res.json(owner);
            }
        }
    });
});

ownerRoutes.route("/register").post(function (req, res, next) {
    let email = req.body.email;
    const newOwner = new ownerSchema(req.body);

    ownerSchema.findOne(
        {
            email: email,
        },
        req.body,
        {
            returnOriginal: false,
            new: true,
        },
        function (err, owner) {
            if (err) {
                next(err);
            } else {
                if (!owner) {
                    newOwner
                        .save()
                        .then((owner) => {
                            res.json(owner);
                        })
                        .catch((err) => {
                            next(err);
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
const photoSchema = require("./models/photo.model");
const photoRoutes = express.Router();
app.use("/photos", photoRoutes);

photoRoutes.route("/").get(function (req, res, next) {
    photoSchema.find(function (err, allPhotos) {
        if (err) {
            next(err);
        } else {
            res.json(allPhotos);
        }
    });
});

photoRoutes.route("/:microchip").get(function (req, res, next) {
    let microchip = req.params.microchip;

    photoSchema.findOne({ petMicrochip: microchip }, function (err, photoData) {
        if (err) {
            next(err);
        } else {
            if (photoData) {
                res.set("Content-Type", "image/jpeg");
                res.json(photoData.petPhotoData);
            } else {
                res.json("");
            }
        }
    });
});

photoRoutes
    .route("/add")
    .post(upload.single("petPhotoData"), (req, res, next) => {
        try {
            let petMicrochip = req.body.petMicrochip;
            photoSchema.findOneAndDelete({ petMicrochip: petMicrochip });

            const newPetPhoto = new photoSchema({
                petMicrochip: petMicrochip,
                petPhotoName: req.body.petPhotoName,
                petPhotoData: req.file.path.split("..")[1],
            });

            newPetPhoto
                .save()
                .then((photo) => {
                    res.json({
                        "uploaded-photo": photo,
                    });
                })
                .catch((err) => next(err));
        } catch (error) {
            next(error);
        }
    });

/*
 * Search
 */
const searchRoutes = express.Router();
app.use("/search", searchRoutes);

searchRoutes.route("/").post(authMiddleware, (req, res, next) => {
    const searchCategory = req.body.field;
    const searchValue = req.body.value;

    async function fetchRelatedData() {
        let pets = [];
        switch (searchCategory) {
            case "microchip":
                try {
                    pets = await petSchema.find({
                        microchip: searchValue,
                    });
                } catch (error) {
                    next(error);
                }

                break;

            case "email":
                try {
                    pets = await petSchema.find({
                        email: searchValue,
                    });
                } catch (error) {
                    next(error);
                }

                break;

            case "petName":
                try {
                    pets = await petSchema.find({
                        petName: searchValue,
                    });
                } catch (error) {
                    next(error);
                }

                break;

            case "ownerName":
                try {
                    pets = await petSchema.find({
                        ownerName: searchValue,
                    });
                } catch (error) {
                    next(error);
                }

                break;

            case "petBreed":
                try {
                    pets = await petSchema.find({
                        petBreed: searchValue,
                    });
                } catch (error) {
                    next(error);
                }

                break;

            case "implanted":
                try {
                    pets = await petSchema.find({
                        implantedCompany: searchValue,
                    });
                } catch (error) {
                    next(error);
                }

                break;

            default:
                next(err);
                break;
        }

        if (pets.length === 0) {
            res.status(404).send("no result");
        } else {
            return res.json(pets);
        }
    }
    fetchRelatedData();
});
