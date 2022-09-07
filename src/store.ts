import {
  configureStore,
  Middleware,
  MiddlewareAPI,
  isRejectedWithValue,
  combineReducers,
  Reducer,
  AnyAction,
} from "@reduxjs/toolkit";
import authReducer, { logoutUser } from "./redux/authSlice";
import walletSlice from "./redux/walletSlice";
import { taxitPayApi } from "./redux/apiSlice";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import toast from "react-hot-toast";
import capitalize from "./helpers/capitalize";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

export const rtkQueryErrorLogger: Middleware = (api: MiddlewareAPI) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    if (action?.payload?.data?.message === "jwt expired") {
      alert("Jwt expired")
      api.dispatch(logoutUser());
      return;
    } else if (action?.payload.status === 500) {
      toast.error("Something went wrong");
      return;
    } else if (action?.payload?.status === 401) {
      // alert("You are not authorized")
      // toast.error(capitalize(action?.payload?.data?.message as string) ?? "Something went wrong");
      api.dispatch(logoutUser());
      return;
    } else {
      toast.error(capitalize(action?.payload?.data?.message as string) ?? "Something went wrong");
    }
  }

  return next(action);
};

const appReducer = combineReducers({
  auth: authReducer,
  wallet: walletSlice,
  [taxitPayApi.reducerPath]: taxitPayApi.reducer,
});

const rootReducer: Reducer = (state: RootState, action: AnyAction) => {
  if (action.type === "auth/logoutUser") {
    if (typeof window !== undefined) {
      localStorage.removeItem("taxitPayToken");
    };

    taxitPayApi.util.resetApiState();
    window.location.replace("/login");

    state = {} as RootState;
  };

  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(taxitPayApi.middleware)
      .concat(rtkQueryErrorLogger),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
