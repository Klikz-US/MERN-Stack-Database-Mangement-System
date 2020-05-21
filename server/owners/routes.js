const Controller = require("./controller");

exports.routesConfig = function (app) {
    app.get("/owners/count", [Controller.count]);
    app.get("/owners/page/:pageId", [Controller.getByPage]);
    app.get("/owners/:_id", [Controller.getById]);
    app.patch("/owners/edit/:_id", [Controller.editById]);
    app.delete("/owners/delete/:_id", [Controller.deleteById]);
    app.post("/owners/register", [Controller.register]);
    app.post("/owners/search", [Controller.search]);
};
