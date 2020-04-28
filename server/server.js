const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const microchipRoutes = express.Router();
const PORT = 4000;
let Microchip = require('./microchip.model');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/microchips', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const connection = mongoose.connection;

connection.once('open', function () {
    console.log("MongoDB Database connection established Successfully.");
});

microchipRoutes.route('/').get(function (req, res) {
    Microchip.find(function (err, microchips) {
        if (err) {
            console.log(err);
        } else {
            res.json(microchips);
        }
    });
});

microchipRoutes.route('/:id').get(function (req, res) {
    let id = req.params.id;
    Microchip.findById(id, function (err, microchip) {
        if (err) {
            console.log(err);
        } else {
            res.json(microchip);
        }
    });
});

microchipRoutes.route('/update/:id').patch(function (req, res) {
    let id = req.params.id;
    Microchip.findById(id, function (err, microchip) {
        if (err) {
            console.log(err)
        } else {
            if (!microchip) {
                res.status(404).send("microchip " + req.body.microchip_Number + " is not found");
            } else {
                microchip.microchip_Number = req.body.microchip_Number;
                microchip.owner_Email = req.body.owner_Email;

                microchip.save().then(microchip => {
                    res.json({
                        'microchip': microchip
                    });
                })
                .catch(err => {
                    res.status(400).send(err);
                });
            }
        }
    });
});

microchipRoutes.route('/add').post(function (req, res) {
    let microchip = new Microchip(req.body);

    microchip.save().then(microchip => {
        res.status(200).json(
            {
                'microchip': microchip
            }
        )
    }).catch(err => {
        res.status(400).send(err);
    });
});

app.use('/microchips', microchipRoutes);

app.listen(PORT, function () {
    console.log("Server is Running on PORT: " + PORT);
});