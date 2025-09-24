import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  StatusBar,
  Dimensions,
  Alert
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors } from "../themes/Colors";
import { fonts } from "../themes/Fonts";
import {
  Feather,
  MaterialIcons,
  FontAwesome,
  AntDesign,
} from "@expo/vector-icons";
import { logout } from "../redux/LogInSlice";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const BookstoreApp = () => {
  const BASE_URL = "https://primabi.co";
  const navigation = useNavigation();
  const dispatch=useDispatch()
  const token = useSelector((state) => state.auth.token);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Books data for different sections
  const [mostPopularBooks, setMostPopularBooks] = useState([]);
  const [bestSellingBooks, setBestSellingBooks] = useState([]);
  const [recommendedBooks, setRecommendedBooks] = useState([]);

  // Pagination states
  const [mostPopularPage, setMostPopularPage] = useState(1);
  const [bestSellingPage, setBestSellingPage] = useState(1);
  const [recommendedPage, setRecommendedPage] = useState(1);

  const [hasMoreMostPopular, setHasMoreMostPopular] = useState(true);
  const [hasMoreBestSelling, setHasMoreBestSelling] = useState(true);
  const [hasMoreRecommended, setHasMoreRecommended] = useState(true);

  // Loading states for pagination
  const [loadingMostPopular, setLoadingMostPopular] = useState(false);
  const [loadingBestSelling, setLoadingBestSelling] = useState(false);
  const [loadingRecommended, setLoadingRecommended] = useState(false);
//delivery 
const [deliveryAddress, setDeliveryAddress] = useState("");
const [notes, setNotes] = useState("");

  //Heart Colection
  const [likedBooks, setLikedBooks] = useState({});

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          dispatch(logout()); // clear Redux auth state
          navigation.replace("Login"); // navigate back to login screen
        },
      },
    ]);
  };

  const toggleLike = (bookId) => {
    setLikedBooks((prev) => ({
      ...prev,
      [bookId]: !prev[bookId],
    }));
  };

  // Fetch categories on mount if token exists
  useEffect(() => {
    if (!token) return;

    const fetchCategories = async () => {
      //  console.log("Fetching categories with token:", token);
      try {
        const response = await axios.get(
          `${BASE_URL}/api/v1/Books/categories`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        //   console.log("Fetched categories:", response.data);
        setCategories(response.data);
      } catch (err) {
        console.log("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, [token]);

  // Fetch books data
  const fetchBooks = async (categoryId, page = 1, section) => {
    if (!token) return;

    const setLoadingState = {
      mostPopular: setLoadingMostPopular,
      bestSelling: setLoadingBestSelling,
      recommended: setLoadingRecommended,
    }[section];

    setLoadingState(true);

    try {
      const response = await axios.get(`${BASE_URL}/api/v1/Books`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page,
          pageSize: 5,
          categoryId,
          isAvailable: true,
        },
      });

      const newBooks = response.data.data || [];

      if (section === "mostPopular") {
        if (page === 1) {
          setMostPopularBooks(newBooks);
        } else {
          setMostPopularBooks((prev) => [...prev, ...newBooks]);
        }
        setHasMoreMostPopular(newBooks.length === 5);
      } else if (section === "bestSelling") {
        if (page === 1) {
          setBestSellingBooks(newBooks);
        } else {
          setBestSellingBooks((prev) => [...prev, ...newBooks]);
        }
        setHasMoreBestSelling(newBooks.length === 5);
      } else if (section === "recommended") {
        if (page === 1) {
          setRecommendedBooks(newBooks);
        } else {
          setRecommendedBooks((prev) => [...prev, ...newBooks]);
        }
        setHasMoreRecommended(newBooks.length === 5);
      }
    } catch (err) {
      console.log(`Error fetching ${section} books:`, err);
    } finally {
      setLoadingState(false);
    }
  };

  // Initial fetch for all sections
  useEffect(() => {
    if (!token) return;

    fetchBooks(10, 1, "mostPopular");
    fetchBooks(11, 1, "bestSelling");
    fetchBooks(12, 1, "recommended");
  }, [token]);

  // Handle end reached for horizontal pagination
  const handleEndReached = (section) => {
    const hasMore = {
      mostPopular: hasMoreMostPopular,
      bestSelling: hasMoreBestSelling,
      recommended: hasMoreRecommended,
    }[section];

    const isLoading = {
      mostPopular: loadingMostPopular,
      bestSelling: loadingBestSelling,
      recommended: loadingRecommended,
    }[section];

    const currentPage = {
      mostPopular: mostPopularPage,
      bestSelling: bestSellingPage,
      recommended: recommendedPage,
    }[section];

    const categoryId = {
      mostPopular: 10,
      bestSelling: 11,
      recommended: 12,
    }[section];

    if (hasMore && !isLoading) {
      const nextPage = currentPage + 1;

      if (section === "mostPopular") {
        setMostPopularPage(nextPage);
      } else if (section === "bestSelling") {
        setBestSellingPage(nextPage);
      } else if (section === "recommended") {
        setRecommendedPage(nextPage);
      }

      fetchBooks(categoryId, nextPage, section);
    }
  };

  const renderBookCard = ({ item }) => (
    <View style={[styles.bookCard, { minHeight: 220, position: "relative" }]}>
      {/* Image Section */}
      <TouchableOpacity
        style={styles.bookImageContainer}
        onPress={() => navigation.navigate("BookDetail", { id: item.id })}
      >
        <Image
          source={
            item.imageUrl
              ? { uri: item.imageUrl }
              : require("../assets/images/Storybook.png")
          }
          style={styles.bookImage}
        />
      </TouchableOpacity>

      {/* Info Section */}
      <View style={styles.bookInfo}>
        {/* Title */}
        <Text style={styles.bookTitle} numberOfLines={2}>
          {item.title || "Untitled"}
        </Text>

        {/* Author */}
        <Text style={styles.bookAuthor} numberOfLines={1}>
          By{" "}
          {item.authors?.length > 0
            ? item.authors.join(", ")
            : "Unknown Author"}
        </Text>

        {/* Rating Row */}
        <View style={[styles.ratingRow, { minHeight: 20 }]}>
          <View style={{ flexDirection: "row", marginRight: 5 }}>
            {item.averageRating === 0 ? (
              <MaterialIcons name="star-border" size={18} color="#ffd500ff" />
            ) : (
              Array.from({ length: 5 }).map((_, i) => (
                <MaterialIcons
                  key={i}
                  name={
                    i < Math.round(item.averageRating) ? "star" : "star-border"
                  }
                  size={18}
                  color="#FFD700"
                />
              ))
            )}
          </View>
          <Text style={styles.reviewCount}>
            ({item.reviewCount || 0} reviews)
          </Text>
        </View>

        {/* Stock */}
        <Text
          style={[
            styles.stockText,
            item.isAvailable ? styles.inStock : styles.outOfStock,
          ]}
        >
          {item.isAvailable
            ? `In Stock (${item.availableCopies})`
            : "Out of Stock"}
        </Text>
      </View>

      {/* Heart Button (aligned bottom right) */}
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 10,
          right: 10,
          borderRadius: 50,
          justifyContent: "center",
          alignItems: "center",
          width: 36,
          height: 36,
          backgroundColor: "#fff", // matches previous add button style
          elevation: 3,
          shadowColor: "#000",
          shadowOpacity: 0.2,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 2 },
        }}
        onPress={() => toggleLike(item.id)}
      >
        <MaterialIcons
          name={likedBooks[item.id] ? "favorite" : "favorite-border"}
          size={22}
          color={likedBooks[item.id] ? "red" : "#000"}
        />
      </TouchableOpacity>
    </View>
  );

  const handleViewAll = (categoryId) => {
    navigation.navigate("BooksList", { categoryId });
  };
  //Heart Button

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <MaterialIcons
              name="search"
              size={24}
              color={colors.textSecondary}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by title, author, or category"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          <TouchableOpacity
            style={{
              padding: 6,
              borderRadius: 5,
              backgroundColor: "#fbf9f99d", // optional background
              //    elevation: 2, // shadow for Android
              //  shadowColor: "#000", // shadow for iOS
              shadowOpacity: 0.1,
              shadowRadius: 3,
              shadowOffset: { width: 0, height: 2 },
            }}
            onPress={() => navigation.navigate("Shipping-cart")} 
          >
            <MaterialIcons name="shopping-cart" size={20} color="#000000ff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ padding: 6, borderRadius: 5 }}
            onPress={handleLogout}
          >
            <MaterialIcons name="logout" size={20} color="red" />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={{
                marginRight: 5,
                //padding: 2,
                backgroundColor: "#ffffffff",
                borderRadius: 8,
                marginLeft: 5,
                alignItems: "center",
                paddingHorizontal: 10,
                paddingVertical: 5,
              }}
              onPress={() =>
                navigation.navigate("BooksList", { categoryId: category.id })
              }
            >
              <Text
                style={{
                  fontSize: 14,
                  color: "#000000ff",
                  alignSelf: "center",
                  fontWeight: "500",
                }}
              >
                {category.name}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "#838383ff",
                  alignSelf: "center",
                }}
              >
                {category.bookCount} books
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Sort and Filter Row */}
        {/* <View style={styles.sortFilterRow}>
          <TouchableOpacity style={styles.sortButton}>
            <Text style={styles.sortText}>Sort</Text>
            <Icon name="swap-vertical" size={16} color={colors.white} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.filterText}>Filter</Text>
          </TouchableOpacity>
        </View> */}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Most Popular Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Most Popular</Text>
            <TouchableOpacity onPress={() => handleViewAll(10)}>
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={mostPopularBooks}
            renderItem={renderBookCard}
            keyExtractor={(item, index) => `popular-${item.id || index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            onEndReached={() => handleEndReached("mostPopular")}
            onEndReachedThreshold={0.5}
          />
        </View>

        {/* Best Selling Books Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Our Best Selling Books</Text>
            <TouchableOpacity onPress={() => handleViewAll(11)}>
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={bestSellingBooks}
            renderItem={renderBookCard}
            keyExtractor={(item, index) => `bestselling-${item.id || index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            onEndReached={() => handleEndReached("bestSelling")}
            onEndReachedThreshold={0.5}
          />
        </View>

        {/* Recommended Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended</Text>
            <TouchableOpacity onPress={() => handleViewAll(12)}>
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={recommendedBooks}
            renderItem={renderBookCard}
            keyExtractor={(item, index) => `recommended-${item.id || index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            onEndReached={() => handleEndReached("recommended")}
            onEndReachedThreshold={0.5}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    marginBottom: 10,
  },

  // Header Styles
  header: {
    backgroundColor: colors.primary,
    paddingTop: 10,
    // paddingHorizontal: 10,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    color: colors.white,
    fontSize: fonts.size.title,
    fontWeight: fonts.weight.medium,
  },
  headerTitle: {
    color: colors.white,
    fontSize: fonts.size.large,
    fontWeight: fonts.weight.semiBold,
  },
  wishlistButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  wishlistText: {
    color: colors.white,
    fontSize: fonts.size.small,
    fontWeight: fonts.weight.medium,
    marginLeft: 4,
  },

  // Search Styles
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: "10%",
    paddingHorizontal: 10,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: fonts.size.small,
    color: colors.textPrimary,
    marginLeft: 8,
  },
  filterButton: {
    backgroundColor: colors.lightGray,
    padding: 12,
    borderRadius: 8,
  },
  filterIcon: {
    fontSize: fonts.size.medium,
    color: colors.textSecondary,
  },

  // Categories Styles
  categoriesContainer: {
    marginBottom: 16,
  },
  categoryButton: {
    marginRight: 16,
    paddingBottom: 8,
  },
  categoryText: {
    color: colors.white,
    fontSize: fonts.size.small,
    fontWeight: fonts.weight.medium,
  },

  // Sort Filter Row
  sortFilterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  sortText: {
    color: colors.white,
    fontSize: fonts.size.small,
    fontWeight: fonts.weight.medium,
    marginRight: 8,
  },
  sortIcon: {
    color: colors.white,
    fontSize: fonts.size.small,
  },
  filterText: {
    color: colors.white,
    fontSize: fonts.size.small,
    fontWeight: fonts.weight.medium,
  },

  // Content Styles
  content: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Section Styles
  sectionContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: fonts.size.large,
    fontWeight: fonts.weight.bold,
    color: colors.textPrimary,
  },
  viewAllText: {
    fontSize: fonts.size.small,
    color: colors.textSecondary,
    fontWeight: fonts.weight.medium,
  },

  horizontalList: {
    paddingRight: 16,
  },

  // Book Card Styles (Same for all sections)
  bookCard: {
    width: SCREEN_WIDTH * 0.4, // ~38% of screen width for multiple cards in a row
    minHeight: 200, // fixed height for alignment across cards
    backgroundColor: "#fff",
    borderRadius: 8,
    marginRight: 12,
    padding: 10,
    position: "relative",
    elevation: 3,
    borderWidth: 0.2,
    borderColor: "#ccc",
  },

  bookImageContainer: {
    width: "100%",
    height: SCREEN_WIDTH * 0.5, // makes image scale with screen width
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 10,
  },

  bookImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  bookInfo: {
    flex: 1,
    justifyContent: "space-between",
  },

  bookTitle: {
    fontSize: SCREEN_WIDTH * 0.036, // scale font with screen width
    fontWeight: "600",
    color: "#000",
    marginBottom: 2,
    minHeight: 40, // ensures 2-line height consistency
  },

  bookAuthor: {
    fontSize: SCREEN_WIDTH * 0.032,
    color: "#555",
    marginBottom: 4,
    minHeight: 18,
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    minHeight: 20,
  },

  reviewCount: {
    fontSize: SCREEN_WIDTH * 0.028,
    color: "#777",
    marginLeft: 4,
  },

  stockText: {
    fontSize: SCREEN_WIDTH * 0.03,
    fontWeight: "500",
    marginBottom: 4,
    color: "#06bc34ff",
  },

  heartButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    width: SCREEN_WIDTH * 0.09,
    height: SCREEN_WIDTH * 0.09,
    borderRadius: SCREEN_WIDTH * 0.045,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
});

export default BookstoreApp;
