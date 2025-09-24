import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { colors } from "../themes/Colors";
import { fonts } from "../themes/Fonts";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { loginSuccess } from "../redux/LogInSlice";
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';
import * as AuthSession from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();



const { width, height } = Dimensions.get("window");
// Static data structure for future API integration
const socialLoginOptions = [
  {
    id: 1,
    type: "facebook",
    icon: require("../assets/images/facebook.png"),
  },
  {
    id: 2,
    type: "gmail",
    icon: require("../assets/images/gmail.png"),
  },
];

const LoginScreen = () => {
  const BASE_URL = "https://primabi.co";
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Get token from Redux store
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/Auth/login`,
        {
          email: email,
          password: password,
          rememberMe: rememberMe,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      //  console.log("Login Response:", response.data);

      if (response.data.success) {
        dispatch(
          loginSuccess({
            token: response.data.token,
            tokenExpiration: response.data.tokenExpiration,
            user: response.data.user,
          })
        );


        navigation.navigate("Home");
      }
    } catch (error) {
      console.log("Login Error:", error);

      if (error.response) {
        console.log("Error Status Code:", error.response.status);
        console.log("Error Response Data:", error.response.data);
      } else if (error.request) {
        console.log("No response received:", error.request);
      } else {
        console.log("Error Message:", error.message);
      }
    }
  };


  //Social Login
  const [request, response, promptAsync] = Google.useAuthRequest({
  expoClientId: "YOUR_EXPO_CLIENT_ID.apps.googleusercontent.com",
  androidClientId: "YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com",
  iosClientId: "YOUR_IOS_CLIENT_ID.apps.googleusercontent.com",
  scopes: ["profile", "email"],
 redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),

});



useEffect(() => {
  if (response?.type === "success") {
    const { authentication } = response;
    fetchUserInfo(authentication.accessToken);
  }
}, [response]);

useEffect(() => {
  if (response?.type === "success" && response.authentication) {
    const accessToken = response.authentication.accessToken;  // 👈 here you get token
    console.log("Access Token:", accessToken);

    fetchUserInfo(accessToken);  // pass it to fetch function
  }
}, [response]);

const fetchUserInfo = async (token) => {
  try {
    const res = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${token}`,  // 👈 Google access token here
      },
    });

    console.log("Google User Info:", res.data);
    // Example: { id, email, verified_email, name, given_name, family_name, picture }

    // If you want, you can dispatch this to Redux:
    // dispatch(loginSuccess({ user: res.data, token }));
    // navigation.navigate("Home");
  } catch (err) {
    console.log("Error fetching Google user info:", err.response?.data || err.message);
  }
};

const handleSocialLogin = (type) => {
  if (type === "gmail") {
    promptAsync(); // triggers Google login
  } else if (type === "facebook") {
    console.log("Facebook login pressed");
  }
};

const redirectUri = AuthSession.makeRedirectUri({
  useProxy: true,
});
console.log(redirectUri);
// Forgot Password

  const handleForgotPassword = () => {
    // Placeholder for future functionality
    console.log("Forgot password pressed");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Section */}
          <View style={styles.headerContainer}>
            <Image
              source={require("../assets/images/Login_BG.png")}
              style={styles.logoImage}
              resizeMode="contain" // or "stretch" depending on your design
            />
          </View>

          {/* Main Content Section */}
          <View style={styles.mainContent}>
            {/* Title Section */}
            <View style={styles.titleContainer}>
              <Text style={styles.mainTitle}>Log In to Reader's Paradise</Text>
            </View>

            {/* Form Section */}
            <View style={styles.formContainer}>
              {/* Email Input */}

              <View style={styles.inputWrapper}>
                <Ionicons
                  name="person-outline"
                  size={18}
                  color="#ccc"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your Email"
                  placeholderTextColor={colors.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color="#ccc"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter Your Password"
                  placeholderTextColor={colors.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={togglePasswordVisibility}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={18}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>

              {/* Remember Me and Forgot Password */}
              <View style={styles.optionsContainer}>
                <TouchableOpacity
                  style={styles.rememberMeContainer}
                  onPress={toggleRememberMe}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.checkbox,
                      rememberMe && styles.checkboxChecked,
                    ]}
                  >
                    {rememberMe && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={styles.rememberMeText}>Remember Me</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleForgotPassword}
                  activeOpacity={0.7}
                >
                  <Text style={styles.forgotPasswordText}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Login Button */}
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
                activeOpacity={0.8}
              >
                <Text style={styles.loginButtonText}>LOG IN</Text>
              </TouchableOpacity>
            </View>

            {/* Divider Section */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Login Section */}
            <View style={styles.socialLoginContainer}>
              {socialLoginOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.socialButton, // base style
                    option.type === "facebook" && styles.facebookButton, // facebook extra style
                    option.type === "gmail" && styles.gmailButton, // gmail extra style
                  ]}
                  onPress={() => handleSocialLogin(option.type)}
                  activeOpacity={0.7}
                >
                  <Image
                    source={option.icon}
                    style={[
                      styles.socialIcon, // base style
                      option.type === "facebook" && styles.facebookIcon,
                      option.type === "gmail" && styles.gmailIcon,
                    ]}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },

  // Header Styles
  headerContainer: {
    // paddingTop: StatusBar.currentHeight || 40,
    // alignItems: "center",
    // justifyContent: "center",
  },
  logoImage: {
    width: width, // full width of the screen
    height: height * 0.3, // 30% of screen height
  },
  logoText: {
    fontSize: fonts.title,
    fontWeight: fonts.bold,
    color: colors.textPrimary,
    fontStyle: "italic",
    flex: 1,
    marginLeft: 10,
  },
  badgeContainer: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: "center",
    minWidth: 100,
  },
  badgeText: {
    fontSize: fonts.extraSmall,
    fontWeight: fonts.medium,
    color: colors.white,
    textAlign: "center",
  },
  badgeTextLarge: {
    fontSize: fonts.medium,
    fontWeight: fonts.bold,
    color: colors.white,
    textAlign: "center",
    lineHeight: 18,
  },
  badgeSubText: {
    fontSize: fonts.extraSmall,
    color: colors.white,
    textAlign: "center",
  },

  // Main Content Styles
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    //paddingTop: 40,
    //justifyContent: 'center',
    marginTop: 20,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: colors.textPrimary,
    textAlign: "center",
  },

  // Form Styles
  formContainer: {
    marginBottom: 30,
  },
  // inputContainer: {
  //   marginBottom: 20,
  // },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#aaa",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 20,
    marginTop: 10,
    backgroundColor: "#fff",
    shadowColor: "#ccc",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 0.5,
    padding: 3,
    marginBottom: 5,
    paddingLeft: 10,
  },

  input: {
    flex: 1,
    fontSize: fonts.medium,
    color: colors.textPrimary,
    paddingVertical: 8,
    paddingLeft: 10,
  },
  eyeIcon: {
    padding: 5,
  },
  eyeIconText: {
    fontSize: fonts.medium,
  },

  // Options Styles
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    marginTop: 15,
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: colors.dividerColor,
    borderRadius: 4,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: colors.white,
    fontSize: fonts.small,
    fontWeight: fonts.bold,
  },
  rememberMeText: {
    fontSize: fonts.small,
    color: colors.textSecondary,
  },
  forgotPasswordText: {
    fontSize: fonts.small,
    color: colors.textSecondary,
  },

  // Login Button Styles
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    // marginBottom: 5,
    width: "50%",
    alignSelf: "center",
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.white,
    letterSpacing: 1,
  },

  // Divider Styles
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    //marginVertical: 20,
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.dividerColor,
  },
  dividerText: {
    fontSize: fonts.medium,
    color: colors.textSecondary,
    marginHorizontal: 15,
    fontWeight: fonts.medium,
    backgroundColor: colors.background,
    paddingHorizontal: 10,
  },

  // Social Login Styles
  socialLoginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    // marginTop: 5,
  },

  socialButton: {
    padding: 12,
    borderRadius: 25,
    marginHorizontal: 8,
    //paddingHorizontal:25
  },

  facebookButton: {
    borderWidth: 1,
    borderColor: "#3D6AD6",
  },

  gmailButton: {
    borderWidth: 1,
    borderColor: "#DB4437", // Gmail red
  },

  socialIcon: {
    width: 24,
    height: 24,
  },

  // facebookIcon: {
  //   width: 30,   // bigger icon for facebook
  //   height: 30,
  // },

  // gmailIcon: {
  //   width: 20,   // different size for gmail
  //   height: 20,
  // },

  // facebookIcon: {
  //   tintColor: "white", // makes the white icon visible
  // },

  // gmailIcon: {
  //   tintColor: "white",
  // },
});

export default LoginScreen;
