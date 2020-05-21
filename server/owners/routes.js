const Controller = require("./controller");
const Authentication = require("../services/auth");

exports.routesConfig = function (app) {
    app.get("/owners/count", [Authentication.authMiddleware, Controller.count]);
    app.get("/owners/page/:pageId", [
        Authentication.authMiddleware,
        Controller.getByPage,
    ]);
    app.get("/owners/:_id", [
        Authentication.authMiddleware,
        Controller.getById,
    ]);
    app.patch("/owners/edit/:_id", [
        Authentication.authMiddleware,
        Controller.editById,
    ]);
    app.delete("/owners/delete/:_id", [
        Authentication.authMiddleware,
        Controller.deleteById,
    ]);
    app.post("/owners/register", [
        Authentication.authMiddleware,
        Controller.register,
    ]);
    app.post("/owners/search", [
        Authentication.authMiddleware,
        Controller.search,
    ]);
};
