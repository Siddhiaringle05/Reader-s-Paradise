import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { colors } from "../themes/Colors";
import { fonts } from "../themes/Fonts";
import { useNavigation } from '@react-navigation/native';
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react"; 
import axios from 'axios';



// Static data for books
const booksData = [
  {
    id: '1',
    title: 'THE DA VINCI CODE',
    author: 'DAN BROWN',
    rating: 4.5,
    price: '$12.99',
    image: require('../assets/images/Storybook.png'),
    stock: 'Out of Stock'
  },
  {
    id: '2',
    title: 'The MEANING OF PRODUCING Something Useful',
    author: 'DAN BROWN',
    rating: 4.0,
    price: '$15.99',
    image: require('../assets/images/Storybook.png'),
    stock: 'In Stock'
  },
  {
    id: '3',
    title: 'YOUR STORY STARTS HERE',
    author: 'DAN BROWN',
    rating: 4.2,
    price: '$18.99',
    image: require('../assets/images/Storybook.png'),
    stock: 'In Stock'
  },
];

const bestSellingBooks = [
  {
    id: '4',
    title: 'A CONSPIRACY OF FRIENDSHIPS',
    author: 'DAN BROWN',
    rating: 4.5,
    price: 'AED 12.10',
    image: require('../assets/images/Storybook.png'),
    stock: 'In Stock'
  },
  {
    id: '5',
    title: 'ANOTHER BOOK TITLE',
    author: 'DAN BROWN',
    rating: 4.0,
    price: 'AED 15.10',
    image: require('../assets/images/Storybook.png'),
    stock: 'Out of Stock'
  },
  {
    id: '6',
    title: 'MEANING PRODUCING',
    author: 'DAN BROWN',
    rating: 4.2,
    price: 'AED 18.10',
    image: require('../assets/images/Storybook.png'),
    stock: 'In Stock'
  },
];


const BookstoreApp = () => {
  const BASE_URL="https://primabi.co"
  const navigation=useNavigation()
 const token = useSelector((state) => state.auth.token);

//console.log(token);


const [categories, setCategories] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

// Fetch categories on mount if token exists
useEffect(() => {
  if (!token) return; // don't fetch until token exists

  const fetchCategories = async () => {
    console.log("Fetching categories with token:", token);
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/Books/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched categories:", response.data);
      setCategories(response.data);
    } catch (err) {
      console.log("Error fetching categories:", err);
    }
  };
  fetchCategories();
}, [token]);

  const renderBookCard = ({ item, index }) => (
    <View style={styles.bookCard}>
      <TouchableOpacity style={styles.bookImageContainer}>
        <Image source={item.image} style={styles.bookImage} />
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </TouchableOpacity>
      
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.bookAuthor}>{item.author}</Text>
        <View style={styles.ratingRow}>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>★ {item.rating}</Text>
          </View>
        </View>
        <Text style={[styles.stockText, item.stock === 'Out of Stock' ? styles.outOfStock : styles.inStock]}>
          {item.stock}
        </Text>
      </View>
    </View>
  );

  const renderBestSellingCard = ({ item, index }) => (
    <View style={styles.bestSellingCard}>
      <TouchableOpacity style={styles.bestSellingImageContainer}>
        <Image source={item.image} style={styles.bestSellingImage} />
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </TouchableOpacity>
      
      <View style={styles.bestSellingInfo}>
        <Text style={styles.bestSellingTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.bestSellingAuthor}>{item.author}</Text>
        <View style={styles.ratingRow}>
          <Text style={styles.rating}>★ {item.rating}</Text>
        </View>
        <Text style={styles.priceText}>{item.price}</Text>
        <Text style={[styles.stockText, item.stock === 'Out of Stock' ? styles.outOfStock : styles.inStock]}>
          {item.stock}
        </Text>
      </View>
    </View>
  );

  const renderRecommendedCard = ({ item, index }) => (
    <View style={styles.recommendedCard}>
      <TouchableOpacity>
        <Image source={item.image} style={styles.recommendedImage} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by title, author, or category"
            placeholderTextColor={colors.textSecondary}
          />
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterIcon}>≡</Text>
          </TouchableOpacity>
        </View>

        {/* Categories */}
<ScrollView horizontal showsHorizontalScrollIndicator={false}>
  {categories.map((category) => (
    <TouchableOpacity
      key={category.id}
      style={{ marginRight: 10, padding: 10, backgroundColor: "#eee", borderRadius: 8 }}
      onPress={() => navigation.navigate("BooksList", { categoryId: category.id })}
    >
      <Text>{category.name}</Text>
      <Text style={{ fontSize: 12, color: "#666" }}>{category.bookCount} books</Text>
    </TouchableOpacity>
  ))}
</ScrollView>


        {/* Sort and Filter Row */}
        <View style={styles.sortFilterRow}>
          <TouchableOpacity style={styles.sortButton}>
            <Text style={styles.sortText}>Sort</Text>
            <Text style={styles.sortIcon}>≡</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.filterText}>Filter</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Most Popular Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Most Popular</Text>
            <TouchableOpacity >
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={booksData}
            renderItem={renderBookCard}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        {/* Best Selling Books Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Our Best Selling Books</Text>
          <FlatList
            data={bestSellingBooks}
            renderItem={renderBestSellingCard}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        {/* Recommended Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Recommended</Text>
          <FlatList
            data={bestSellingBooks.slice(0, 3)}
            renderItem={renderRecommendedCard}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
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
  },
  
  // Header Styles
  header: {
    backgroundColor: colors.primary,
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  wishlistText: {
    color: colors.white,
    fontSize: fonts.size.small,
    fontWeight: fonts.weight.medium,
    marginLeft: 4,
  },
  
  // Search Styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop:'10%'
  },
  searchInput: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: fonts.size.small,
    color: colors.textPrimary,
    marginRight: 12,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  
  // Book Card Styles (Most Popular)
  bookCard: {
    width: 140,
    marginRight: 16,
    backgroundColor: "#C4E1E3",
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bookImageContainer: {
    position: 'relative',
    height: 180,
    backgroundColor: colors.white,
    margin: 8,
    marginBottom: 4,
    borderRadius: 8,
  },
  bookImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 8,
  },
  addButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: colors.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: colors.white,
    fontSize: fonts.size.medium,
    fontWeight: fonts.weight.bold,
  },
  bookInfo: {
    padding: 12,
    paddingTop: 8,
  },
  bookTitle: {
    fontSize: fonts.size.extraSmall,
    fontWeight: fonts.weight.bold,
    color: colors.textPrimary,
    marginBottom: 4,
    lineHeight: 16,
  },
  bookAuthor: {
    fontSize: fonts.size.extraSmall,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: fonts.size.extraSmall,
    color: '#FFD700',
    fontWeight: fonts.weight.medium,
  },
  stockText: {
    fontSize: fonts.size.extraSmall,
    fontWeight: fonts.weight.medium,
  },
  outOfStock: {
    color: '#FF6B6B',
  },
  inStock: {
    color: '#4CAF50',
  },
  
  // Best Selling Card Styles
  bestSellingCard: {
    width: 120,
    marginRight: 16,
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bestSellingImageContainer: {
    position: 'relative',
    height: 160,
    backgroundColor: colors.white,
    margin: 8,
    marginBottom: 4,
    borderRadius: 8,
  },
  bestSellingImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 8,
  },
  bestSellingInfo: {
    padding: 8,
    paddingTop: 4,
  },
  bestSellingTitle: {
    fontSize: fonts.size.extraSmall,
    fontWeight: fonts.weight.bold,
    color: colors.textPrimary,
    marginBottom: 4,
    lineHeight: 14,
  },
  bestSellingAuthor: {
    fontSize: fonts.size.extraSmall,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  priceText: {
    fontSize: fonts.size.extraSmall,
    fontWeight: fonts.weight.semiBold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  
  // Recommended Card Styles
  recommendedCard: {
    width: 100,
    height: 140,
    marginRight: 16,
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    padding: 8,
  },
  recommendedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 8,
    backgroundColor: colors.white,
  },
});

export default BookstoreApp;