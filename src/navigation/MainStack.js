// navigation/MainStack.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import all screens
import SignUpScreen from "../screens/SignupScreen";
import LoginScreen from "../screens/LogIn";
import Home from "../screens/Home";
import Recommandedbooks from "../screens/Recommandation";
import BookstoreApp from "../screens/Home";
import BookDetails from "../screens/BookDetail";
import CategoryWiseBooks from "../screens/Category_wise_Books";
import RegistrationForm from "../screens/RegistrationForm";

const Stack = createNativeStackNavigator();

export default function MainStack() {
  return (
    <Stack.Navigator>
 
      <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
           <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Recommanded"
        component={BookstoreApp}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BookDetail"
        component={BookDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BooksList"
        component={CategoryWiseBooks}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Registration-Form"
        component={RegistrationForm}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
