import React from "react";
import { useSelector } from "react-redux";
import { BrowserRouter as Router, Switch, Redirect } from "react-router-dom";

import Navigation from "../utils/navigation.util";
import PrivateRoute from "../routes/private.route";
import PublicRoute from "../routes/public.route";
import FooterContent from "../utils/footer.util";
import PetList from "../pages/pet-list.page";
import PetEdit from "../pages/pet-update.page";
import PetRegister from "../pages/pet-register.page";
import OwnerList from "../pages/owner-list.page";
import OwnerEdit from "../pages/owner-update.page";
import OwnerRegister from "../pages/owner-register.page";
import UserList from "../pages/user-list.page";
import UserRegister from "../pages/user-register.page";
import UserEdit from "../pages/user-edit.page";
import Report from "../pages/report.page";
import AccountLogin from "../pages/login.page";

export default function STLRouter() {
    const auth_obj = useSelector((state) => state.auth);

    const { isAuthenticated } = auth_obj;
    const { isAdmin } = auth_obj.user !== null ? auth_obj.user : false;

    return (
        <Router>
            {isAuthenticated && (
                <header>
                    <Navigation />
                </header>
            )}

            <main className="mb-5">
                <Switch>
                    <PrivateRoute
                        path="/pets"
                        exact
                        component={PetList}
                        isAuthenticated={isAuthenticated}
                    />
                    <PrivateRoute
                        path="/pets/edit/:id"
                        exact
                        component={PetEdit}
                        isAuthenticated={isAuthenticated}
                    />
                    <PrivateRoute
                        path="/pets/register"
                        exact
                        component={PetRegister}
                        isAuthenticated={isAuthenticated}
                    />

                    <PrivateRoute
                        path="/owners"
                        exact
                        component={OwnerList}
                        isAuthenticated={isAuthenticated}
                    />
                    <PrivateRoute
                        path="/owners/edit/:id"
                        exact
                        component={OwnerEdit}
                        isAuthenticated={isAuthenticated}
                    />
                    <PrivateRoute
                        path="/owners/register"
                        exact
                        component={OwnerRegister}
                        isAuthenticated={isAuthenticated}
                    />

                    <PrivateRoute
                        path="/users"
                        exact
                        component={UserList}
                        isAuthenticated={isAuthenticated}
                        isAdmin={isAdmin}
                    />
                    <PrivateRoute
                        path="/users/add"
                        exact
                        component={UserRegister}
                        isAuthenticated={isAuthenticated}
                        isAdmin={isAdmin}
                    />
                    <PrivateRoute
                        path="/users/edit/:id"
                        exact
                        component={UserEdit}
                        isAuthenticated={isAuthenticated}
                        isAdmin={isAdmin}
                    />

                    <PrivateRoute
                        path="/report"
                        exact
                        component={Report}
                        isAuthenticated={isAuthenticated}
                        isAdmin={isAdmin}
                    />

                    <PublicRoute
                        path="/login"
                        component={AccountLogin}
                        isAuthenticated={isAuthenticated}
                    />

                    <Redirect to={isAuthenticated ? "/" : "/login"} />
                </Switch>
            </main>

            {isAuthenticated && (
                <footer className="mt-auto pt-4 pb-4 bg-light shadow-lg">
                    <FooterContent />
                </footer>
            )}
        </Router>
    );
}
