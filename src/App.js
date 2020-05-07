import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/App.css';

import Navigation from './utils/navigation.utils';
import FooterContent from './utils/footer.utils';
import PetList from './pages/pet-list.page';
import PetEdit from './pages/pet-update.page';
import PetRegister from './pages/pet-register.page';
import OwnerList from './pages/owner-list.page';
import OwnerEdit from './pages/owner-update.page';
import OwnerRegister from './pages/owner-register.page';
import AccountLogin from './pages/login.page';
import PrivateRoute from './routes/private.route';
import PublicRoute from './routes/public.route';
import { verifyTokenAsync } from './actions/auth-async.actions';

export default function App() {
    const auth_obj = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const { authLoading, isAuthenticated } = auth_obj;

    useEffect(() => {
        dispatch(verifyTokenAsync());
    }, [dispatch]);

    if (authLoading) {
        return (
            <div className="content">Checking Authentication...</div>
        );
    } else {
        return (
            <Router>
                {isAuthenticated &&
                    <header>
                        <Navigation />
                    </header>
                }

                <main>
                    <Switch>
                        <PublicRoute path="/login" component={AccountLogin} isAuthenticated={isAuthenticated} />

                        <PrivateRoute path="/pets" exact component={PetList} isAuthenticated={isAuthenticated} />
                        <PrivateRoute path="/pets/edit/:id" exact component={PetEdit} isAuthenticated={isAuthenticated} />
                        <PrivateRoute path="/pets/register" exact component={PetRegister} isAuthenticated={isAuthenticated} />
                        <PrivateRoute path="/owners" exact component={OwnerList} isAuthenticated={isAuthenticated} />
                        <PrivateRoute path="/owners/edit/:id" exact component={OwnerEdit} isAuthenticated={isAuthenticated} />
                        <PrivateRoute path="/owners/register" exact component={OwnerRegister} isAuthenticated={isAuthenticated} />

                        <Redirect to={isAuthenticated ? '/' : '/login'} />
                    </Switch>
                </main>

                {isAuthenticated &&
                    <footer className="mt-5 pt-4 pb-4">
                        <FooterContent />
                    </footer>
                }
            </Router>
        );
    }
}