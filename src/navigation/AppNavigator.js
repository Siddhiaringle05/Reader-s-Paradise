// src/navigation/AppNavigator.js
import { useSelector } from "react-redux";
import MainStack from "./MainStack";
import AuthStack from "./AuthStack";

export default function AppNavigator() {
  const { islogin } = useSelector((state) => state.auth);

  return islogin ? <MainStack /> : <AuthStack />;
}
