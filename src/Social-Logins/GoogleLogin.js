// import React, { useEffect, useState } from "react";
// import { View, StyleSheet, Alert } from "react-native";
// import * as WebBrowser from "expo-web-browser";
// import * as Google from "expo-auth-session/providers/google";
// import * as AuthSession from "expo-auth-session";
// import axios from "axios";
// import { useNavigation } from "@react-navigation/native";

// WebBrowser.maybeCompleteAuthSession();

// export default function GoogleLogin() {
//   const navigation = useNavigation(); // get navigation
//   const [userInfo, setUserInfo] = useState(null);

//   const [request, response, promptAsync] = Google.useAuthRequest({
//     expoClientId: "YOUR_ACTUAL_CLIENT_ID.apps.googleusercontent.com",
//     androidClientId: "YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com",
//     iosClientId: "YOUR_IOS_CLIENT_ID.apps.googleusercontent.com",
//     scopes: ["profile", "email"],
//     redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
//   });

//   // auto-trigger Google login
//   useEffect(() => {
//     if (request) {
//       promptAsync().catch((error) => {
//         console.error("❌ Auto-login error:", error);
//         Alert.alert("Login Error", "Failed to start Google login");
//         navigation.goBack(); // go back on error
//       });
//     }
//   }, [request]);

//   // handle login response
//   useEffect(() => {
//     if (response?.type === "success") {
//       handleAuthResponse();
//     } else if (response?.type === "error" || response?.type === "cancel") {
//       navigation.goBack(); // return to previous screen
//     }
//   }, [response]);

//   const handleAuthResponse = async () => {
//     const { authentication } = response;
//     if (authentication?.accessToken) {
//       try {
//         await fetchUserInfo(authentication.accessToken);
//         await callCompanySocialLogin("google", authentication.accessToken);

//         // redirect to your main app screen after login
//         navigation.replace("Dashboard"); // or whatever screen you want
//       } catch (error) {
//         console.error("❌ Auth flow error:", error);
//         Alert.alert("Authentication Error", "Failed to complete login process");
//         navigation.goBack(); // go back on error
//       }
//     }
//   };

//   const fetchUserInfo = async (token) => {
//     const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
//       headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
//     });
//     const user = await res.json();
//     setUserInfo(user);
//     return user;
//   };

//   const callCompanySocialLogin = async (provider, token) => {
//     await axios.post("https://primabi.co/api/v1/Auth/social-login", {
//       provider,
//       accessToken: token,
//     });
//   };

//   return <View style={styles.container} />; // keep screen blank
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#f8f9fa" },
// });
import { View, Text } from 'react-native'
import React from 'react'

const GoogleLogin = () => {
  return (
    <View>
      <Text>GoogleLogin</Text>
    </View>
  )
}

export default GoogleLogin