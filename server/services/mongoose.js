require("dotenv").config();

const mongoose = require("mongoose");

const db_addr = process.env.DB_ADDR_ONLINE;
let count = 0;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
const connectWithRetry = () => {
    mongoose
        .connect(db_addr, options)
        .then(() => {
            console.log(
                "MongoDB Database connection established Successfully."
            );
        })
        .catch(() => {
            console.log(
                "MongoDB connection unsuccessful, retry after 5 seconds. ",
                ++count
            );
            setTimeout(connectWithRetry, 5000);
        });
};
connectWithRetry();

mongoose.set("useFindAndModify", false);
exports.mongoose = mongoose;
