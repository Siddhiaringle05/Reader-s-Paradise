// App.js
import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { store, persistor } from "./src/redux/store";
import MainStack from "./src/navigation/MainStack";

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <StatusBar
            backgroundColor="rgb(244, 245, 246)"
            barStyle="dark-content"
          />
          <MainStack />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
