const Model = require("./model");

exports.getByMicrochip = (req, res) => {
    let microchip = req.params.microchip;

    Model.findOne({ petMicrochip: microchip }, function (err, photoData) {
        if (err) {
            res.status(500).send(err);
        } else {
            if (photoData) {
                res.set("Content-Type", "image/jpeg");
                res.json(photoData.petPhotoData);
            } else {
                res.json("");
            }
        }
    });
};

exports.add = (req, res) => {
    try {
        let petMicrochip = req.body.petMicrochip;
        Model.findOneAndDelete({ petMicrochip: petMicrochip }, () => {
            const newPetPhoto = new Model({
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
                .catch((err) => res.status(500).send(err));
        });
    } catch (error) {
        res.status(500).send(err);
    }
};
