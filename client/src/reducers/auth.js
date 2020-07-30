import { REGISTER_SUCCESS, REGISTER_FAIL, USER_LOADED ,AUTH_ERROR} from '../actions/types';

const initalState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null,
};

export default function (state = initalState , action) {
    const {type, payload} = action;
    switch (type) {
        case USER_LOADED :
            return {
              ...state,
              isAuthenticated: true,
              loading: false,
              user: payload,
            };
        case REGISTER_SUCCESS:
            localStorage.setItem('token', payload.token);
            return {
                ...state,
                ...payload,
                isAuthenticated : true,
                loading:false
            };
        case AUTH_ERROR: 
        case REGISTER_FAIL:
            localStorage.removeItem('token')
            return {
                ...state,
                token:null,
                isAuthenticated :null,
                loading:false
            }
        default:
            return state;
    }
}