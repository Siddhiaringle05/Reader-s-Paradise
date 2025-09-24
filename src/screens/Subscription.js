import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

// Static data structure - ready for API replacement
const featuresData = [
  {
    id: 1,
    iconFamily: "Ionicons",
    iconName: "checkmark-circle",
    title: "Certified",
    description: "Available Books from Certified Authors",
  },
  {
    id: 2,
    iconFamily: "MaterialIcons",
    iconName: "menu-book",
    title: "Rent",
    description: "Your favorite books, now on rent",
  },
  {
    id: 3,
    iconFamily: "FontAwesome5",
    iconName: "shipping-fast",
    title: "Shipping",
    description: "Fast, safe, and straight to your doorstep",
  },
];

const subscriptionPlans = [
  {
    id: 1,
    type: "quarterly",
    title: "Quarterly Plan",
    price: "AED 75",
    duration: "3 Months",
    badge: "Best for short-term readers",
    color: "#4A9B8E",
    popular: false,
  },
  {
    id: 2,
    type: "yearly",
    title: "Yearly Plan",
    price: "AED 250",
    duration: "12 Months",
    badge: "Most Popular - Save More!",
    color: "#5BA3B8",
    popular: true,
  },
];

const BookSubscriptionApp = () => {
  const navigation=useNavigation()
  const renderIcon = (iconFamily, iconName) => {
    const iconProps = {
      name: iconName,
      size: width * 0.065,
      color: "#4A9B8E",
    };

    switch (iconFamily) {
      case "Ionicons":
        return <Ionicons {...iconProps} />;
      case "MaterialIcons":
        return <MaterialIcons {...iconProps} />;
      case "FontAwesome5":
        return <FontAwesome5 {...iconProps} />;
      default:
        return <Ionicons {...iconProps} />;
    }
  };
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#56A6AD" barStyle="light-content" />

      {/* Header Section */}
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <Text style={styles.mainTitle}>
              Experience Our{"\n"}New Exclusive{"\n"}Books
            </Text>
            <Text style={styles.subtitle}>
              Fill your bookshelf without{"\n"}emptying your wallet.{"\n"}
              Buy what you love, rent what{"\n"}you're curious about.{"\n"}
              Pay less, read more.
            </Text>
          </View>

          <View style={styles.heroImageContainer}>
            <View style={styles.heroImageBackground}>
              <Image
                source={require("../assets/images/book2.png")}
                style={styles.heroImage}
                resizeMode="contain"
              />
            </View>
            <View style={styles.stackedBooksContainer}>
              <Image
                source={require("../assets/images/Books1.png")}
                style={styles.stackedBooks}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Features Section */}
        <View style={styles.featuresContainer}>
          {featuresData.map((feature, index) => (
            <React.Fragment key={feature.id}>
              <TouchableOpacity style={styles.featureCard}>
                <View style={styles.featureIconContainer}>
                  {renderIcon(feature.iconFamily, feature.iconName)}
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>
                  {feature.description}
                </Text>
              </TouchableOpacity>

              {/* Divider after every 3 items */}
              {(index + 1) % 3 === 0 && <View style={styles.featureDivider} />}
            </React.Fragment>
          ))}
        </View>

        {/* Subscription Plans Section */}
        <View style={styles.subscriptionSection}>
          <View style={styles.subscriptionHeader}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="book"
                size={22}
                color="#333"
                style={{ marginRight: 5 }}
              />
              <Text style={styles.subscriptionTitle}>Subscription Plans</Text>
            </View>
            <Text style={styles.subscriptionSubtitle}>
              (Enjoy unlimited stories at affordable prices)
            </Text>
          </View>

          <View style={styles.plansContainer}>
            {subscriptionPlans.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                style={[styles.planCard, { backgroundColor: "#5BA3B8" }]}
                activeOpacity={0.8}
                onPress={()=>navigation.navigate("Registration-Form")}
              >
                {/* Header */}
                <View style={styles.planHeader}>
                  <FontAwesome5
                    name="calendar-alt"
                    size={20}
                    color="#fff"
                    style={{ marginRight: 5 }}
                  />
                  <Text style={styles.planTitle}>{plan.title}</Text>
                </View>

                {/* Price + Duration */}
                <View style={styles.planPricing}>
                  <Text style={styles.planPrice}>{plan.price}</Text>
                  <Text style={styles.planDuration}>/ {plan.duration}</Text>
                </View>

                {/* Badge */}
                <View style={styles.planBadge}>
                  <Ionicons
                    name="checkmark-circle"
                    size={18}
                    color="#8fffadff"
                    style={{ marginRight: 4 }}
                  />
                  <Text style={styles.planBadgeText}>{plan.badge}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Refundable Deposit */}
          <View style={styles.depositContainer}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="information-circle"
                size={18}
                color="#333"
                style={{ marginRight: 4 }}
              />
              <Text style={styles.depositText}>
                Refundable Deposit: AED 100
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  headerContainer: {
    backgroundColor: "#ffffffff",
    paddingBottom: width * 0.05,
    paddingHorizontal: width * 0.05,
    paddingTop: "15%",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  titleContainer: {
    flex: 1,
    paddingRight: width * 0.03,
  },
  mainTitle: {
    fontSize: width * 0.065,
    fontWeight: "bold",
    color: "#56A6AD",
    lineHeight: width * 0.075,
    marginBottom: height * 0.02,
  },
  subtitle: {
    fontSize: width * 0.035,
    color: "#040404ff",
    lineHeight: width * 0.045,
  },
  heroImageContainer: {
    position: "relative",
    width: width * 0.35,
    height: width * 0.35,
  },
  heroImageBackground: {
    position: "absolute",
    right: -10,
    top: -width * 0.05,
    width: width * 0.2,
    height: width * 0.25,
    backgroundColor: "#56a6ad9d",

    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  heroImage: {
    width: 50,
    height: 50,
  },
  stackedBooksContainer: {
    position: "absolute",
    right: width * 0.1,
    top: width * 0.18,
    backgroundColor: "#56A6AD",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    width: "70%",
    height: 100,
  },
  stackedBooks: {
    marginTop: 18,
    right: width * 0.06,
    width: "150%",
    height: "130%",
  },
  scrollContainer: {
    flex: 1,
  },
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    backgroundColor: "#FFFFFF",
    marginHorizontal: width * 0.03,
    marginTop: height * 0.02,
    borderRadius: width * 0.03,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featureCard: {
    alignItems: "center",
    flex: 1,
    paddingHorizontal: width * 0.02,
    borderLeftWidth: 0.2,
    borderColor: "#ccc",
  },
  featureIconContainer: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.06,
    backgroundColor: "#F0F8FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: height * 0.01,
  },
  featureTitle: {
    fontSize: width * 0.04,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: height * 0.005,
  },
  featureDescription: {
    fontSize: width * 0.028,
    color: "#7F8C8D",
    textAlign: "center",
    lineHeight: width * 0.04,
  },
  subscriptionSection: {
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.03,
  },
  subscriptionHeader: {
    marginBottom: height * 0.03,
  },
  subscriptionTitle: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: height * 0.005,
  },
  subscriptionSubtitle: {
    fontSize: width * 0.032,
    color: "#7F8C8D",
  },
  plansContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    // padding: 12,
  },

  planCard: {
    width: "49%", // 2 per row
    minHeight: 180, // ensure same height
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    backgroundColor: "#5BA3B8",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4,
  },

  planHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  planIcon: {
    fontSize: 20,
    marginRight: 6,
  },

  planTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    flexShrink: 1,
  },

  planPricing: {
    flexDirection: "row",
    flexWrap: "wrap", // allow breaking instead of overflow
    alignItems: "center",
    marginBottom: 10,
  },

  planPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },

  planDuration: {
    fontSize: 14,
    color: "#fff",
    flexShrink: 1,
    flexWrap: "wrap",
  },

  planBadge: {
    // backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 6,
    //paddingHorizontal: 10,
    marginTop: "auto", // push badge to bottom
    flexDirection:'row'
  },

  planBadgeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#ffffffff",
  },

  depositContainer: {
    backgroundColor: "#E8F4F8",
    padding: width * 0.04,
    borderRadius: width * 0.03,
    alignItems: "center",
    marginTop: 10,
  },
  depositText: {
    fontSize: width * 0.038,
    color: "#ff403aff",
    fontWeight: "500",
  },
});

export default BookSubscriptionApp;
