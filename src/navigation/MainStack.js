// navigation/MainStack.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import all screens
import Home from "../screens/Home";
import BookDetails from "../screens/BookDetail";
import CategoryWiseBooks from "../screens/Category_wise_Books";
import RegistrationForm from "../screens/RegistrationForm";
import ShippingCart from "../screens/ShippingCart";
import ShoppingCartScreen from "../screens/ShippingCart";
import BookSubscriptionApp from "../screens/Subscription";

const Stack = createNativeStackNavigator();

export default function MainStack() {
  return (
    <Stack.Navigator>
     
      <Stack.Screen
        name="Recommanded"
        component={Home}
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
        name="Shipping-cart"
        component={ShoppingCartScreen}
        options={{ headerShown: false }}
      />
        <Stack.Screen
        name="Subscription"
        component={BookSubscriptionApp}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
