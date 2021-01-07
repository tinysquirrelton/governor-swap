import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
//import { xReducer } from "./x/reducers";

const rootReducer = {
  //x: xReducer,
};

function configureAppStore(preloadedState) {
  const store = configureStore({
    reducer: rootReducer,
    middleware: [...getDefaultMiddleware()],
    devTools: process.env.NODE_ENV !== "production",
    preloadedState,
  });

  if (process.env.NODE_ENV !== "production" && module.hot) {
    module.hot.accept(rootReducer, () => store.replaceReducer(rootReducer));
  }

  return store;
}

export const store = configureAppStore({});
