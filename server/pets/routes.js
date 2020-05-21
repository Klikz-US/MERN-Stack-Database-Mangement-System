const Controller = require("./controller");

exports.routesConfig = function (app) {
    app.get("/pets/count", [Controller.count]);
    app.get("/pets/page/:pageId", [Controller.getByPage]);
    app.get("/pets/:_id", [Controller.getById]);
    app.patch("/pets/edit/:_id", [Controller.editById]);
    app.delete("/pets/delete/:_id", [Controller.deleteById]);
    app.post("/pets/register", [Controller.register]);
    app.post("/pets/search", [Controller.search]);
};
