const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = 5000;
app.listen(PORT, function () {
    console.log("Server is Running on PORT: " + PORT);
});

mongoose.connect('mongodb+srv://stl:stl@cluster0-p8kcd.mongodb.net/stl?authSource=admin&replicaSet=Cluster0-shard-0&readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=true', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.set('useFindAndModify', false);

const PetImportSchema = require(./models/)

const connection = mongoose.connection;
connection.once('open', function () {
    console.log("MongoDB Database connection established Successfully.");

    start_pet_import();
});

const csvFilePath = './../../DB/registeredpets.csv';
const csv = require('csvtojson');

async function start_pet_import() {
    const microchipData = await csv().fromFile(csvFilePath);
    console.log(microchipData.length);

    for (let index = 0; index < microchipData.length; index++) {
        const microchip = microchipData[index];

        const pet_import = await pet_import(microchip);
        console.log(pet_import);
    }
}

async function pet_import(microchip) {

}