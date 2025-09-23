import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from "react-native";
import { colors } from "../themes/Colors";
import { fonts } from "../themes/Fonts";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

// Static data structure for future API integration
const signUpOptions = [
  {
    id: 1,
    type: "gmail",
    title: "Sign up with Gmail",
    icon: require("../assets/images/gmail.png"),
  },
  {
    id: 2,
    type: "facebook",
    title: "Sign up with Facebook",
    icon: require("../assets/images/facebook.png"),
  },
  {
    id: 3,
    type: "google",
    title: "Sign up with Google",
    icon: require("../assets/images/google.png"),
  },
];

const SignUpScreen = () => {
  const navigation = useNavigation();
  const handleSignUpPress = (type) => {
    // Placeholder for future functionality
    navigation.navigate("Registration-Form");
   // console.log(`Sign up with ${type} pressed`);
  };


  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* Header Section */}
      <View style={styles.headerContainer}>
        {/* Background geometric shape */}
        <View style={styles.backgroundShape} />

        <View style={styles.headerContent}>
          <View>
            <Image
              source={require("../assets/images/BG_IMG.png")}
              style={{
                width: width * 0.7,
                height: height * 0.22,
                resizeMode: "contain",
                borderRadius: 10,
                marginTop: "10%",
              }}
            />
          </View>

          {/* Tagline */}
          <View style={styles.taglineContainer}>
            <Text style={styles.taglineText}>
              Buy the books that shape your world,
            </Text>
            <Text style={styles.taglineText2}>
              Rent the ones that spark your curiosity.
            </Text>
          </View>
        </View>
      </View>

      {/* Main Content Section */}
      <View style={styles.mainContent}>
        {/* Title Section */}
        <View style={styles.titleContainer}>
          <Text style={styles.mainTitle}>Sign Up To Reader's Paradise</Text>
          <Text style={styles.subtitle}>
            (Your next adventure is just a page away—dive in today!)
          </Text>
        </View>

        {/* Sign Up Options Section */}
        <View style={styles.signUpOptionsContainer}>
          {signUpOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.signUpButton}
              onPress={() => handleSignUpPress(option.type)}
              activeOpacity={0.7}
            >
              <Image
                source={option.icon}
                style={styles.signUpIcon}
                resizeMode="center"
              />
              <Text style={styles.signUpButtonText}>{option.title}</Text>
            </TouchableOpacity>
          ))}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>
          <View style={{ alignSelf: "center", flexDirection: "row" }}>
            <Text>Already have account ?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={{ color: "#0155FD" }}> Log In</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Divider Section */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Header Styles
  headerContainer: {
    // backgroundColor: colors.primary,
    // paddingTop: StatusBar.currentHeight || 40,
    // paddingBottom: 20,
    paddingHorizontal: 16,
    minHeight: height * 0.4,
    position: "relative",
    justifyContent: "center",
    borderBottomWidth: 0.4,
    borderColor: "#bebebeff",
  },
  backgroundShape: {
    position: "absolute",
    top: 0,
    right: 0,
    width: width * 0.4,
    height: "100%",
    backgroundColor: colors.primary,
    opacity: 0.9,
    transform: [{ skewX: "-15deg" }],
  },
  headerContent: {
    alignItems: "center",
    zIndex: 2,
  },
  // logoCard: {
  //   backgroundColor: colors.cardBackground || colors.white,
  //   borderRadius: 16,
  //   padding: 20,
  //   width: width * 0.88,
  //   flexDirection: "row",
  //   alignItems: "center",
  //   justifyContent: "space-between",
  //   marginBottom: 20,
  //   shadowColor: "#000",
  //   shadowOffset: {
  //     width: 0,
  //     height: 4,
  //   },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 8,
  //   elevation: 8,
  // },

  taglineContainer: {
    alignItems: "center",
    // paddingHorizontal: 20,
    //maxWidth: width * 0.9,
    paddingBottom: 10,
  },
  taglineText: {
    fontSize: 18,
    color: colors.black,
    textAlign: "center",
    lineHeight: 35,
    fontWeight: "500",
    marginRight: "10%",
  },
  taglineText2: {
    fontSize: 18,
    color: colors.black,
    textAlign: "center",
    lineHeight: 24,
    fontWeight: "500",
    marginLeft: "10%",
  },

  // Main Content Styles
  mainContent: {
    flex: 1,
    //  paddingHorizontal: 20,
    // paddingTop: 40,
    // justifyContent: "space-between",
  },

  mainTitle: {
    fontSize: 18,
    fontWeight: fonts.weight.semiBold,
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: 10,
    marginTop: "10%",
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    fontStyle: "italic",
  },

  // Sign Up Options Styles
  signUpOptionsContainer: {
    flex: 1,
    //justifyContent: "center",
    gap: 15,
    marginTop: 25,
  },
  signUpButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.lightGray,
    borderRadius: 25,
    // paddingVertical: 12,
    // paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: colors.dividerColor,
    //justifyContent: "center",
    marginHorizontal: 30,
    height: 50,
    paddingLeft:'15%'
  },
  signUpIcon: {
     width: 30,
     height: 30,
    marginRight: 30,
    //alignItems: "center",
  },
  signUpButtonText: {
    fontSize: fonts.size.medium,
    color: colors.buttonText,
    fontWeight: fonts.weight.medium,
  },
  // Divider Styles
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    //marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.dividerColor,
  },
  dividerText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginHorizontal: 8,
    fontWeight: "600",
    backgroundColor: colors.background,
    paddingHorizontal: 8,
  },
});

export default SignUpScreen;
