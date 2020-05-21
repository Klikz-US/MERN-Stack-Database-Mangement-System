const Controller = require("./controller");

exports.routesConfig = function (app) {
    app.get("/users/", [Controller.getAll]);
    app.get("/users/:_id", [Controller.getById]);
    app.post("/users/add", [Controller.add]);
    app.patch("/users/edit/:_id", [Controller.editById]);
    app.delete("/users/delete/:_id", [Controller.deleteById]);

    app.post("/login", [Controller.login]);
    app.post("/logout", [Controller.logout]);
    app.post("/verifyToken", [Controller.verifyToken]);
};
