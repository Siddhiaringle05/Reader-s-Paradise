import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StatusBar,
  Dimensions,
} from "react-native";
import { useSelector } from "react-redux";
import { useRoute, useNavigation } from "@react-navigation/native";
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  Feather,
  MaterialIcons,
  FontAwesome,
  AntDesign,
} from "@expo/vector-icons";
const { width } = Dimensions.get("window");

const BookDetail = () => {
  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const BASE_URL = "https://primabi.co";

  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;

  // Get bearer token from Redux store
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    fetchBookDetails();
  }, [id]);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/v1/Books/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setBookData(response.data);
    } catch (error) {
      console.error("Error fetching book details:", error);
      Alert.alert("Error", "Failed to load book details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleWishlist = () => {
   navigation.navigate("Shipping-cart")
  };

  const handleShare = () => {
    // Add your share functionality here
    Alert.alert("Share", "Share functionality will be implemented");
  };

  const handleSave = () => {
    // Add your save functionality here
     setIsBookmarked(!isBookmarked);
   // Alert.alert("Save", "Book saved to your library");
  };

  const handleRent = async () => {
    if ( !bookData.id) {
      Alert.alert("Error", "Book data is not available.");
      return;
    }
console.log(bookData.id);

    const requestBody = {
      bookIds: [bookData.id], // get bookId from fetched details
      deliveryAddress: "Your delivery address here", // replace or get from user input
      notes: "Any notes here", // optional
    };

    try {
      setLoading(true);

      const response = await axios.post(
        `${BASE_URL}/api/v1/Orders/checkout`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

   //   console.log("Checkout response:", response.data);
      Alert.alert("Success", "Book rented successfully!");
    } catch (error) {
      console.error("Checkout error:", error.response || error.message);
      Alert.alert("Error", "Failed to rent the book. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5DAFA7" />
        <Text style={styles.loadingText}>Loading book details...</Text>
      </View>
    );
  }

  if (!bookData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Book not found</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchBookDetails}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#56A6AD" barStyle="light-content" />

      {/* Header */}
     <View style={styles.header}>
  <TouchableOpacity
    style={styles.backButton}
    onPress={() => navigation.goBack()}
  >
    <Ionicons name="ios-chevron-back" size={24} color="#FFFFFF" />
  </TouchableOpacity>

  <Text style={styles.headerTitle}>Book Detail</Text>

  <TouchableOpacity
    style={styles.wishlistButton}
    onPress={handleWishlist}
  >
     <MaterialIcons name="shopping-cart" size={20} color="#000000ff" />
  </TouchableOpacity>
</View>


      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Book Image and Actions */}
        <View style={styles.imageSection}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: bookData.imageUrl }}
              style={styles.bookImage}
              resizeMode="cover"
            />
          </View>

        <View style={styles.actionButtons}>
  <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
    <MaterialIcons name="share" size={20} color="#666" />
  </TouchableOpacity>
  <TouchableOpacity style={styles.actionButton} onPress={handleSave}>
<MaterialIcons
    name={isBookmarked ? "bookmark" : "bookmark-border"} // toggle icon
    size={24}
    color={isBookmarked ? "red" : "#000"} 
  />
   </TouchableOpacity>
</View>
        </View>

        {/* Book Details */}
        <View style={styles.detailsSection}>
          <View style={styles.priceContainer}>
          
            <View style={styles.availabilityBadge}>
              <View style={[
                styles.statusDot, 
                { backgroundColor: bookData.isAvailable ? '#4CAF50' : '#FF5722' }
              ]} />
            </View>
          </View>

          <Text style={styles.bookTitle}>{bookData.title}</Text>

          <View style={styles.authorContainer}>
            <Text style={styles.authorLabel}>By </Text>
            <Text style={styles.authorName}>
              {bookData.authors?.map((author) => author.name).join(", ") ||
                "Unknown Author"}
            </Text>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Rating</Text>
              <Text style={styles.statValue}>
                {bookData.averageRating > 0
                  ? bookData.averageRating.toFixed(1)
                  : "4"}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Reads</Text>
              <Text style={styles.statValue}>31</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Review</Text>
              <Text style={styles.statValue}>
                {bookData.reviewCount > 0 ? bookData.reviewCount : "15"}
              </Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.description}>
            {bookData.description ||
              `This is a captivating ${
                bookData.category?.name.toLowerCase() || "book"
              } that offers an engaging reading experience. The author delivers a compelling narrative that will keep you turning pages. With ${
                bookData.pages || "multiple"
              } pages of ${
                bookData.binding?.toLowerCase() || "quality"
              } content, this book is perfect for readers looking for their next great read.`}
          </Text>

          {/* Additional Info */}
          <View style={styles.additionalInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Category:</Text>
              <Text style={styles.infoValue}>
                {bookData.category?.name || "General"}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Publisher:</Text>
              <Text style={styles.infoValue}>
                {bookData.publisher?.name || "Unknown"}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Pages:</Text>
              <Text style={styles.infoValue}>{bookData.pages || "N/A"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Binding:</Text>
              <Text style={styles.infoValue}>{bookData.binding || "N/A"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Available Copies:</Text>
              <Text style={styles.infoValue}>
                {bookData.availableCopies}/{bookData.totalCopies}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.rentBtn]}
          onPress={handleRent}
          disabled={!bookData?.isAvailable || loading} // disable while loading
        >
          <Text style={styles.rentBtnText}>RENT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#56A6AD",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    backgroundColor: "#56A6AD",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 40,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginLeft: -28,
  },
  wishlistButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  wishlistText: {
    color: "#FFFFFF",
    fontSize: 14,
    marginLeft: 4,
  },
  content: {
    flex: 1,
  },
  imageSection: {
    alignItems: "center",
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: "#FAFAFA",
  },
  imageContainer: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  bookImage: {
    width: width * 0.5,
    height: width * 0.75,
    borderRadius: 8,
  },
  actionButtons: {
    position: "absolute",
    right: 20,
    top: 30,
    flexDirection: "column",
  },
  actionButton: {
    width: 40,
    height: 40,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailsSection: {
    padding: 20,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: "#999",
    textDecorationLine: "line-through",
    marginRight: 8,
  },
  currentPrice: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  availabilityBadge: {
    marginLeft: "auto",
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  bookTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  authorContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  authorLabel: {
    fontSize: 14,
    color: "#666",
  },
  authorName: {
    fontSize: 14,
    color: "#56A6AD",
    fontWeight: "500",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 16,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: "#555",
    marginBottom: 24,
  },
  additionalInfo: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
  },
  bottomActions: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  rentBtn: {
    backgroundColor: "#56A6AD",
    marginRight: 10,
  },
  buyBtn: {
    backgroundColor: "#56A6AD",
    marginLeft: 10,
  },
  rentBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  buyBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default BookDetail;
