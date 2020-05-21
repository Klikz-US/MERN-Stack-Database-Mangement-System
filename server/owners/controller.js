const Model = require("./model");

exports.count = (req, res) => {
    Model.find().countDocuments(function (err, count) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(count);
        }
    });
};

exports.getByPage = (req, res) => {
    const pageId = req.params.pageId;

    Model.paginate(
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
                res.status(500).send(err);
            } else {
                res.json(owners.docs);
            }
        }
    );
};

exports.getById = (req, res) => {
    const _id = req.params._id;
    Model.findOne({ _id: _id }, function (err, owner) {
        if (err) {
            res.status(500).send(err);
        } else {
            if (!owner) {
                res.status(404).send("No Owner found");
            } else {
                res.json(owner);
            }
        }
    });
};

exports.editById = (req, res) => {
    const _id = req.params._id;
    const data = req.body;

    Model.findOneAndUpdate({ _id: _id }, data, function (err, owner) {
        if (err) {
            res.status(500).send(err);
        } else {
            if (!owner) {
                res.status(404).send("No Owner found");
            } else {
                res.json(owner);
            }
        }
    });
};

exports.deleteById = (req, res) => {
    const _id = req.params._id;

    Model.findOneAndDelete({ _id: _id }, function (err, owner) {
        if (err) {
            res.status(500).send(err);
        } else {
            if (!owner) {
                res.status(404).send("No Owner found");
            } else {
                res.json(owner);
            }
        }
    });
};

exports.register = (req, res) => {
    const email = req.body.email;
    Model.findOne({ email: email }, function (err, owner) {
        if (err) {
            res.status(500).send(err);
        } else {
            if (owner) {
                res.status(403).send("Owner already exist");
            } else {
                const newOwner = new Model(req.body);
                newOwner
                    .save()
                    .then((owner) => {
                        res.json(owner);
                    })
                    .catch((err) => {
                        res.status(500).send(err);
                    });
            }
        }
    });
};

exports.search = (req, res) => {
    const searchCategory = req.body.field;
    const searchValue = req.body.value;

    console.log(searchCategory);
    console.log(searchValue);

    async function fetchRelatedData() {
        let owners = [];
        switch (searchCategory) {
            case "email":
                try {
                    owners = await Model.find({
                        email: searchValue,
                    });
                } catch (error) {
                    return res.status(500).send(error);
                }

                break;

            case "ownerName":
                try {
                    const owners_data = await Model.paginate(
                        {
                            ownerName: searchValue,
                        },
                        {
                            page: 1,
                            limit: 20,
                            sort: {
                                _id: -1,
                            },
                        }
                    );
                    owners = owners_data.docs;
                } catch (error) {
                    return res.status(500).send(error);
                }

                break;

            case "ownerState":
                try {
                    const owners_data = await Model.paginate(
                        {
                            ownerState: searchValue,
                        },
                        {
                            page: 1,
                            limit: 20,
                            sort: {
                                _id: -1,
                            },
                        }
                    );
                    owners = owners_data.docs;
                } catch (error) {
                    return res.status(500).send(error);
                }

                break;

            default:
                return res.status(404).send("Invalid Search Category");
        }

        console.log(owners);

        if (owners.length === 0) {
            res.status(404).send("no result");
        } else {
            return res.json(owners);
        }
    }
    fetchRelatedData();
};
