const Controller = require("./controller");
const Authentication = require("../services/auth");

exports.routesConfig = function (app) {
    app.get("/users/", [Authentication.authMiddleware, Controller.getAll]);
    app.get("/users/:_id", [Authentication.authMiddleware, Controller.getById]);
    app.post("/users/add", [Authentication.authMiddleware, Controller.add]);
    app.patch("/users/edit/:_id", [
        Authentication.authMiddleware,
        Controller.editById,
    ]);
    app.delete("/users/delete/:_id", [
        Authentication.authMiddleware,
        Controller.deleteById,
    ]);

    app.post("/login", [Controller.login]);
    app.post("/logout", [Controller.logout]);
    app.post("/verifyToken", [Controller.verifyToken]);
};
