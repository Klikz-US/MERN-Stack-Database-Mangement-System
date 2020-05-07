import { combineReducers } from 'redux';
import auth from './auth.reducer';

// to combine all reducers together
const appReducer = combineReducers({
    auth
});

export default appReducer;