import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  RefreshControl
} from "react-native";
import { useSelector } from "react-redux";
import axios from "axios";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const CategoryWiseBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false); // New state for loading more items
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [wishlist, setWishlist] = useState(new Set());
  const [refreshing, setRefreshing] = useState(false);
  const [showAvailableFilter, setShowAvailableFilter] = useState(false);

  const [filters, setFilters] = useState({
  bestSellers: false,
  newReleases: false,
  availableOnly: false,
  sortBy: "title",     // could be title, author, rating etc.
  sortOrder: "asc",    // asc or desc
});


  // Get token from Redux store
  const token = useSelector((state) => state.auth.token);
  const route = useRoute();
  const { categoryId } = route.params || {};
  const navigation = useNavigation();

  const pageSize = 1;
  const API_BASE_URL = "https://primabi.co";

  // Configure axios instance with default headers
  const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Add request interceptor to include bearer token
  apiClient.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor for error handling
  apiClient.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        Alert.alert("Authentication Error", "Please login again.");
      } else if (error.response?.status === 403) {
        Alert.alert(
          "Access Denied",
          "You do not have permission to access this resource."
        );
      } else if (error.code === "ECONNABORTED") {
        Alert.alert("Timeout Error", "Request timeout. Please try again.");
      }
      return Promise.reject(error);
    }
  );
//Filter Logic 
const handleFilterToggle = (key) => {
  setFilters((prev) => {
    const updated = { ...prev, [key]: !prev[key] };
    setCurrentPage(1); 
    fetchFilteredBooks(1, searchQuery, updated); 
    return updated;
  });
};

const handleSortToggle = () => {
  setFilters((prev) => {
    const updated = {
      ...prev,
      sortOrder: prev.sortOrder === "asc" ? "desc" : "asc",
      sortBy: "title", // fixed sort by title
    };
    setCurrentPage(1); // reset page
    fetchFilteredBooks(1, searchQuery, updated); // call API with new sort
    return updated;
  });
};

// Fetch filtered/sorted books
// Unified fetch function for filters, sort, search, and refresh
const fetchFilteredBooks = async (pageNo = 1, search = "", activeFilters = filters) => {
  try {
    const params = {
      categoryId,
      title: search,
      bestSellers: activeFilters.bestSellers,
      newReleases: activeFilters.newReleases,
      sortBy: activeFilters.sortBy,
      sortOrder: activeFilters.sortOrder,
      page: pageNo,
      pageSize: 20,
    };

    // Only include availableOnly if true
if (activeFilters.availableOnly) {
  params.availableOnly = true;
}

    const response = await apiClient.get("/api/v1/Books/search", {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });

    const newBooks = response.data.data || [];

    if (pageNo === 1) {
      setBooks(newBooks); // fresh list
    } else {
      setBooks((prev) => [...prev, ...newBooks]); // append for infinite scroll
    }

    setTotalPages(response.data.totalPages || 1);
  } catch (error) {
    console.error("Error fetching filtered books:", error);
    Alert.alert("Error", "Failed to fetch books.");
  } finally {
    setLoading(false);
    setLoadingMore(false);
    setRefreshing(false);
  }
};

// Refresh handler
const handleRefresh = () => {
  setRefreshing(true);
  setCurrentPage(1); 
  fetchFilteredBooks(1, searchQuery, filters); // <-- use current filters
};



  // Modified fetchBooks function to support appending data for infinite scroll
 const fetchBooks = async (page = 1, search = "", showLoader = true, append = false) => {
  if (showLoader && !append) setLoading(true);
  if (append) setLoadingMore(true);

  try {
    const response = await apiClient.get("/api/v1/Books", {
      params: {
        page: page,
        pageSize: pageSize,
        search: search,
        categoryId: categoryId,
        // Remove hardcoded isAvailable: true if you want all books
      },
    });

    const { data, totalCount, totalPages } = response.data;

    // Update the list of books
    if (append) {
      setBooks(prevBooks => [...prevBooks, ...(data || [])]);
    } else {
      setBooks(data || []);
    }

    // Set total count and pages
    setTotalCount(totalCount || 0);
    setTotalPages(totalPages || 1);

    // ✅ Check if any book is available for "Available" filter
    const anyAvailable = (data || []).some(book => book.isAvailable === true);
    setShowAvailableFilter(anyAvailable);

  } catch (error) {
    console.error("Error fetching books:", error);

    let errorMessage = "Failed to fetch books. Please try again.";

    if (error.response) {
      errorMessage = `Server error: ${error.response.status}`;
    } else if (error.request) {
      errorMessage = "Network error. Please check your connection.";
    }

    Alert.alert("Error", errorMessage);

    if (!append) {
      setBooks([]);
      setTotalCount(0);
      setTotalPages(1);
    }
  } finally {
    setLoading(false);
    setLoadingMore(false);
    setRefreshing(false);
  }
};

  useEffect(() => {
    // Only fetch if token is available
    if (token) {
      // Reset to page 1 and fetch initial data
      setCurrentPage(1);
      fetchBooks(1, searchQuery);
    } else {
      Alert.alert("Authentication Required", "Please login to view books.");
    }
  }, [token, searchQuery]);

  //Handle Search with highlights
  const filteredBooks = books.filter((book) => {
    const query = searchQuery.toLowerCase();
    return (
      book.title?.toLowerCase().includes(query) ||
      book.authors?.some((author) =>
        (author.name || author).toLowerCase().includes(query)
      ) ||
      book.isbn?.toLowerCase().includes(query)
    );
  });

  // Sort → prioritize title matches
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    const query = searchQuery.toLowerCase();
    const aTitleMatch = a.title?.toLowerCase().includes(query) ? 1 : 0;
    const bTitleMatch = b.title?.toLowerCase().includes(query) ? 1 : 0;
    return bTitleMatch - aTitleMatch;
  });

  // Final list to render
  const displayBooks = searchQuery ? sortedBooks : books;

  const highlightText = (text, query) => {
    if (!query) return <Text>{text}</Text>;

    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <Text key={index} style={{ backgroundColor: "yellow" }}>
          {part}
        </Text>
      ) : (
        <Text key={index}>{part}</Text>
      )
    );
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setCurrentPage(1); // Reset to first page for search

      const response = await axios.get(
        "https://primabi.co/api/v1/Books/search",
        {
          params: {
            title: searchQuery,
            author: searchQuery,
            isbn: searchQuery,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { data, totalCount, totalPages } = response.data;

      setBooks(data || []);
      setTotalCount(totalCount || 0);
      setTotalPages(totalPages || 1);
    } catch (error) {
      console.error("Search error:", error);

      let errorMessage = "Failed to search books. Please try again.";

      if (error.response) {
        errorMessage = `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      }

      Alert.alert("Error", errorMessage);
      setBooks([]);
      setTotalCount(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  const toggleWishlist = (bookId) => {
    const newWishlist = new Set(wishlist);
    if (newWishlist.has(bookId)) {
      newWishlist.delete(bookId);
    } else {
      newWishlist.add(bookId);
    }
    setWishlist(newWishlist);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Icon key={i} name="star" size={12} color="#FFD700" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Icon key={i} name="star-half" size={12} color="#FFD700" />);
      } else {
        stars.push(
          <Icon key={i} name="star-outline" size={12} color="#C0C0C0" />
        );
      }
    }
    return stars;
  };

  const renderBookItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("BookDetail", { id: item.id })}
      activeOpacity={0.8}
    >
      <View style={styles.bookItem}>
        <Image
          source={{
            uri:
              item.imageUrl ||
              "https://via.placeholder.com/80x120?text=No+Image",
          }}
          style={styles.bookImage}
          resizeMode="cover"
        />

        <View style={styles.bookInfo}>
          <View style={styles.bookHeader}>
            <Text style={styles.bookTitle} numberOfLines={2}>
              {highlightText(item.title, searchQuery)}
            </Text>

            <Text style={styles.bookAuthor}>
              By{" "}
              {item.authors && item.authors.length > 0
                ? item.authors.map((author, i) => (
                    <Text key={i}>
                      {highlightText(author.name || author, searchQuery)}
                      {i < item.authors.length - 1 ? ", " : ""}
                    </Text>
                  ))
                : "Unknown Author"}
            </Text>

            <TouchableOpacity
              onPress={() => toggleWishlist(item.id)}
              style={styles.wishlistButton}
            >
              <Icon
                name={wishlist.has(item.id) ? "bookmark" : "bookmark-outline"}
                size={18}
                color={wishlist.has(item.id) ? "#FF4444" : "#999"}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.bookAuthor}>
            By{" "}
            {item.authors && item.authors.length > 0
              ? item.authors.map((author) => author.name || author).join(", ")
              : "Unknown Author"}
          </Text>

          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>
              {renderStars(item.averageRating || 0)}
            </View>
            <Text style={styles.reviewCount}>
              {item.reviewCount || 0} Review{item.reviewCount !== 1 ? "s" : ""}
            </Text>
          </View>

          <View style={styles.bookDetails}>
            {item.category && (
              <Text style={styles.detailText}>Category: {item.category}</Text>
            )}
            {item.publisher && (
              <Text style={styles.detailText}>Publisher: {item.publisher}</Text>
            )}
            {item.availableCopies !== undefined && (
              <Text style={styles.detailText}>
                Available: {item.availableCopies} copies
              </Text>
            )}
            {item.binding && (
              <Text style={styles.detailText}>Binding: {item.binding}</Text>
            )}
            {item.isbn && (
              <Text style={styles.detailText}>ISBN: {item.isbn}</Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyList = () => {
    if (!token) {
      return (
        <View style={styles.emptyContainer}>
          <Icon name="lock-closed-outline" size={64} color="#999" />
          <Text style={styles.emptyText}>Authentication Required</Text>
          <Text style={styles.emptySubText}>Please login to view books</Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Icon name="library-outline" size={64} color="#999" />
        <Text style={styles.emptyText}>No books found</Text>
        {searchQuery ? (
          <Text style={styles.emptySubText}>
            Try adjusting your search terms
          </Text>
        ) : (
          <Text style={styles.emptySubText}>
            Pull to refresh or check your connection
          </Text>
        )}
      </View>
    );
  };

  // New component to show loading indicator at the bottom
  const renderFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#26A69A" />
        <Text style={styles.footerLoaderText}>Loading more books...</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#26A69A" />

      {/* Header */}
      {/* <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity>
            <Icon name="chevron-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Poetry</Text>
        </View>
        <View style={styles.headerRight}>
          <Icon name="heart" size={20} color="#FF4444" />
          <Text style={styles.wishlistText}>Wishlist</Text>
        </View>
      </View> */}

      <View style={styles.container}>

  {/* 🔍 Search Bar */}
  <View style={styles.searchContainer}>
    <View style={styles.searchInputContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by title, author, or category"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
        editable={!!token}
      />
      <TouchableOpacity
        onPress={handleSearch}
        style={styles.searchButton}
        disabled={!token}
      >
        <Ionicons name="search" size={16} color="#999" />
      </TouchableOpacity>
    </View>
  </View>

  {/* ⬆️ Filter & Sort Bar (right below search box) */}
  <View style={styles.filterSortContainer}>
   <ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={styles.filterSortContainer}
>
  <TouchableOpacity
    style={[styles.filterButton, filters.bestSellers && styles.filterButtonActive]}
    onPress={() => handleFilterToggle("bestSellers")}
  >
    <Ionicons
      name={filters.bestSellers ? "star" : "star-outline"}
      size={18}
      color={filters.bestSellers ? "#fff" : "#333"}
    />
    <Text style={[styles.filterText, filters.bestSellers && { color: "#fff" }]}>
      Best Sellers
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[styles.filterButton, filters.newReleases && styles.filterButtonActive]}
    onPress={() => handleFilterToggle("newReleases")}
  >
    <Ionicons
      name={filters.newReleases ? "flame" : "flame-outline"}
      size={18}
      color={filters.newReleases ? "#fff" : "#333"}
    />
    <Text style={[styles.filterText, filters.newReleases && { color: "#fff" }]}>
      New Releases
    </Text>
  </TouchableOpacity>

{/* Available Only - show only if there are available books */}
{showAvailableFilter && (
  <TouchableOpacity
    style={[
      styles.filterButton,
      filters.availableOnly && styles.filterButtonActive, // apply active style
    ]}
    onPress={() => handleFilterToggle("availableOnly")}
  >
    <Ionicons
      name={
        filters.availableOnly
          ? "checkmark-circle"
          : "checkmark-circle-outline"
      }
      size={18}
      color={filters.availableOnly ? "#fff" : "#333"} // change color when active
    />
    <Text
      style={[
        styles.filterText,
        filters.availableOnly && { color: "#fff" }, // text color when active
      ]}
    >
      Available
    </Text>
  </TouchableOpacity>
)}



<TouchableOpacity
  style={styles.filterButton}
  onPress={handleSortToggle}
>
  <Ionicons
    name={filters.sortOrder === "asc" ? "arrow-up" : "arrow-down"}
    size={18}
    color="#333"
  />
  <Text style={styles.filterText}>
    {filters.sortOrder === "asc" ? "A-Z" : "Z-A"}
  </Text>
</TouchableOpacity>

</ScrollView>

  </View>

  {/* 📚 Book List */}
  <FlatList
  data={displayBooks} // your filtered/sorted/search list
  keyExtractor={(item) => item.id.toString()}
  renderItem={renderBookItem}
  contentContainerStyle={{ paddingBottom: 20 }}
  ListEmptyComponent={
    searchQuery ? (
      <Text style={{ textAlign: "center", marginTop: 20 }}>
        No results found
      </Text>
    ) : null
  }
  // Pull-to-refresh
  refreshing={refreshing}
  onRefresh={() => {
    setCurrentPage(1);
    fetchBooks(1, searchQuery, true, false); // reset books
  }}
  // Infinite scroll
// Infinite scroll
onEndReached={() => {
  if (!loadingMore && currentPage < totalPages) {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchFilteredBooks(nextPage, searchQuery, filters); // ✅ use current filters
  }
}}

  onEndReachedThreshold={0.5} // triggers when 50% from bottom
  ListFooterComponent={
    loadingMore ? (
      <ActivityIndicator size="small" color="#666" style={{ margin: 10 }} />
    ) : null
  }
/>

</View>


      {/* Authentication Status */}
      {!token && (
        <View style={styles.authWarning}>
          <Icon name="warning-outline" size={16} color="#FF6B35" />
          <Text style={styles.authWarningText}>
            Please login to access books
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    backgroundColor: "#26A69A",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 12,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  wishlistText: {
    color: "#FFF",
    fontSize: 14,
    marginLeft: 6,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: "#f3f3f3ff",
    marginTop: "8%",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffffff",
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 0.5,
    borderColor: "#ccc",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: "#333",
    marginLeft: 10,
  },
  searchButton: {
    // backgroundColor: "#E0E0E0",
    padding: 8,
    borderRadius: 4,
  },
  authWarning: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 16,
    borderRadius: 6,
    marginBottom: 8,
  },
  authWarningText: {
    color: "#FF6B35",
    fontSize: 12,
    marginLeft: 6,
    fontWeight: "500",
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: "#666",
    fontSize: 16,
  },
  bookItem: {
    backgroundColor: "#F8F8F8",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    flexDirection: "row",
  },
  bookImage: {
    width: 80,
    height: 120,
    borderRadius: 6,
    marginRight: 12,
  },
  bookInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  bookHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  wishlistButton: {
    padding: 4,
  },
  bookAuthor: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  starsContainer: {
    flexDirection: "row",
    marginRight: 8,
  },
  reviewCount: {
    fontSize: 10,
    color: "#999",
  },
  bookDetails: {
    marginTop: 8,
  },
  detailText: {
    fontSize: 10,
    color: "#666",
    marginBottom: 2,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  paginationButton: {
    backgroundColor: "#26A69A",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  paginationButtonDisabled: {
    backgroundColor: "#E0E0E0",
  },
  paginationButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "500",
  },
  paginationButtonTextDisabled: {
    color: "#999",
  },
  pageInfo: {
    alignItems: "center",
  },
  pageText: {
    fontSize: 14,
    color: "#333",
  },
  totalText: {
    fontSize: 10,
    color: "#999",
    marginTop: 2,
  },
  emptyListContainer: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: "#999",
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: "#BBB",
    marginTop: 8,
    textAlign: "center",
  },
  filterSortContainer: {
  flexDirection: "row",
  justifyContent: "space-around",
  paddingVertical: 10,
  backgroundColor: "#f9f9f9",
},
filterButton: {
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 8,
},
filterText: {
  marginLeft: 5,
  fontSize: 14,
  color: "#333",
},
 filterSortContainer: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    alignItems: "center",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    marginRight: 10,
  },
  filterButtonActive: {
    backgroundColor: "#26A69A",
  },
  filterText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#333",
  },

});

export default CategoryWiseBooks;
