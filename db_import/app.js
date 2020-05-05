const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');

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

const PetImportSchema = require('./models/pet.model');
const OwnerImportSchema = require('./models/owner.model');

const connection = mongoose.connection;
connection.once('open', function () {
    console.log("MongoDB Database connection established Successfully.");

    start_import();
});

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

const csvFilePath = './registeredpets.csv';
const csv = require('csvtojson');

// function pet_import(microchip) {
//     if (microchip) {
//         axios.get(
//             'https://api.savethislife.com/a/find-microchip?microchip=' + microchip,
//             {
//                 headers: {
//                     "X-Client-Secret": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
//                 }
//             }).then(res => {
//                 console.log(res);
//             }).catch(err => {
//                 if (err.response) {
//                     const petData = {
//                         microchip: err.response.data.pet.microchip,
//                         petName: err.response.data.pet.name,
//                         petSpecies: err.response.data.pet.species,
//                         petBreed: err.response.data.pet.breed,
//                         petColor: err.response.data.pet.color,
//                         petGender: err.response.data.pet.gender.toLowerCase(),
//                         petBirth: err.response.data.registrationDate,
//                         specialNeeds: '',
//                         vetInfo: '',
//                         dateRV: '',
//                         implantedCompany: err.response.data.pet.implantCompany,
//                         email: err.response.data.owner.email,
//                         membership: err.response.data.registrationType,
//                     };

//                     const ownerData = {
//                         email: err.response.data.owner.email,
//                         ownerName: err.response.data.owner.name,
//                         ownerPhone1: err.response.data.owner.phone1,
//                         ownerAddress1: err.response.data.owner.address,
//                         ownerAddress2: '',
//                         ownerCity: err.response.data.owner.city,
//                         ownerState: err.response.data.owner.state,
//                         ownerZip: err.response.data.zipcode,
//                         ownerCountry: err.response.data.owner.country,
//                         ownerPhone2: '',
//                         ownerPhone3: '',
//                         ownerPhone4: '',
//                         ownerPhone5: '',
//                         ownerPhone6: '',
//                         ownerPhone7: '',
//                         ownerSecContact: '',
//                         ownerNote: '',
//                     }

//                     // Import Pet
//                     if (err.response.data.pet.microchip && err.response.data.owner.email) {
//                         const petImport = new PetImportSchema(petData);
//                         petImport.save().then(pet => {
//                             console.log(pet.microchip + " saved");
//                         }).catch(err => {
//                             console.log(err);
//                         }).then(function () {
//                             index++;
//                             console.log(index);
//                             pet_import(microchipData[index].Microchip.split('#')[1]);
//                         })
//                     }

//                     // Import Owner
//                     if (err.response.data.owner.email) {
//                         const ownerImport = new OwnerImportSchema(ownerData);
//                         ownerImport.save().then(owner => {
//                             console.log(owner.email + " saved");
//                         }).catch(err => {
//                             console.log(err);
//                         }).then(function () {
//                             index++;
//                             console.log(index);
//                             pet_import(microchipData[index].Microchip.split('#')[1]);
//                         })
//                     }
//                 } else {
//                     index++;
//                     pet_import(microchipData[index].Microchip.split('#')[1]);
//                 }

//             });
//     }
// }



async function start_import() {
    const microchipList = await csv().fromFile(csvFilePath);

    for (let index = 0; index < microchipList.length; index++) {
        const microchip = microchipList[index].Microchip.split('#')[1];

        try {
            const data = await axios.get(
                'https://api.savethislife.com/a/find-microchip?microchip=' + microchip,
                {
                    headers: {
                        "X-Client-Secret": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
                    }
                });
        } catch (err) {
            if (err.response) {
                const petData = {
                    microchip: err.response.data.pet.microchip,
                    petName: err.response.data.pet.name,
                    petSpecies: err.response.data.pet.species,
                    petBreed: err.response.data.pet.breed,
                    petColor: err.response.data.pet.color,
                    petGender: err.response.data.pet.gender.toLowerCase(),
                    petBirth: err.response.data.registrationDate,
                    specialNeeds: '',
                    vetInfo: '',
                    dateRV: '',
                    implantedCompany: err.response.data.pet.implantCompany,
                    email: err.response.data.owner.email,
                    membership: err.response.data.registrationType,
                };

                const ownerData = {
                    email: err.response.data.owner.email,
                    ownerName: err.response.data.owner.name,
                    ownerPhone1: err.response.data.owner.phone1,
                    ownerAddress1: err.response.data.owner.address,
                    ownerAddress2: '',
                    ownerCity: err.response.data.owner.city,
                    ownerState: err.response.data.owner.state,
                    ownerZip: err.response.data.owner.zipcode,
                    ownerCountry: err.response.data.owner.country,
                    ownerPhone2: '',
                    ownerPhone3: '',
                    ownerPhone4: '',
                    ownerPhone5: '',
                    ownerPhone6: '',
                    ownerPhone7: '',
                    ownerSecContact: '',
                    ownerNote: '',
                }

                const petImport = new PetImportSchema(petData);
                const ownerImport = new OwnerImportSchema(ownerData);

                petImport.save()
                    .then(pet => {
                        console.log(pet.microchip + " saved");
                    })
                    .catch(err => {
                        console.log(err);
                    });

                ownerImport.save()
                    .then(owner => {
                        console.log(owner.email + " saved");
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        }
    }
}