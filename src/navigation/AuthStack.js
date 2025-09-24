// src/navigation/AuthStack.js
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignUpScreen from "../screens/SignupScreen";
import LoginScreen from "../screens/LogIn";
import RegistrationForm from "../screens/RegistrationForm";

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
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
