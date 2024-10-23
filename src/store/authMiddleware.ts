import { getSession } from "@/app/shared/reducers/authentication";
import { Storage } from 'react-jhipster';
const AUTH_TOKEN_KEY = 'jhi-authenticationToken';

const authMiddleware = store => next => action => {
    if (action.type === '@@INIT') {
        const token = Storage.local.get(AUTH_TOKEN_KEY) || Storage.session.get(AUTH_TOKEN_KEY);
        if (token) {
            store.dispatch(getSession());
        }
    }
    return next(action);
};

export default authMiddleware;