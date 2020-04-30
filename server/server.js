const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

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

let petSchema = require('./register-pet.model');

const petRoutes = express.Router();
const userRoutes = express.Router();
app.use('/pets', petRoutes);
app.use('/users', userRoutes);

petRoutes.route('/').get(function (req, res) {
    petSchema.find(function (err, allPets) {
        if (err) {
            console.log(err);
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

petRoutes.route('/register').post(function (req, res) {
    let newPet = new petSchema(req.body);

    newPet.save().then(pet => {
        res.status(200).json(
            {
                'registered-pet': pet
            }
        )
    }).catch(err => {
        res.status(400).send(err);
    });
});