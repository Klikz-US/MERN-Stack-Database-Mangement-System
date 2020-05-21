const Controller = require("./controller");
const Authentication = require("../services/auth");

exports.routesConfig = function (app) {
    app.get("/pets/count", [Authentication.authMiddleware, Controller.count]);
    app.get("/pets/page/:pageId", [
        Authentication.authMiddleware,
        Controller.getByPage,
    ]);
    app.get("/pets/:_id", [Authentication.authMiddleware, Controller.getById]);
    app.patch("/pets/edit/:_id", [
        Authentication.authMiddleware,
        Controller.editById,
    ]);
    app.delete("/pets/delete/:_id", [
        Authentication.authMiddleware,
        Controller.deleteById,
    ]);
    app.post("/pets/register", [
        Authentication.authMiddleware,
        Controller.register,
    ]);
    app.post("/pets/search", [
        Authentication.authMiddleware,
        Controller.search,
    ]);
};
