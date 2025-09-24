import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  StyleSheet,
  SafeAreaView,
  StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { MaterialIcons } from "@expo/vector-icons";

const ShoppingCartScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [totalBooks, setTotalBooks] = useState(0);
  const [status, setStatus] = useState(1); // Changed from 0 to 1 - API might not accept 0
  const token = useSelector((state) => state.auth.token);
  
  const pageSize = 60;
  const BASE_URL = 'https://primabi.co';

  // Calculate totals from orders
  const calculateTotals = () => {
    let subtotal = 0;
    let booksCount = 0;
    
    orders.forEach(order => {
      order.books.forEach(book => {
        subtotal += 39.5; // Using the price from your image
        booksCount++;
      });
    });
    
    const discount = subtotal * 0.15; // 15% discount
    const deliveryCharges = subtotal > 100 ? 0 : 2; // Free delivery over 100
    const total = subtotal - discount + deliveryCharges;
    
    return {
      subtotal: subtotal.toFixed(2),
      discount: discount.toFixed(2),
      deliveryCharges: deliveryCharges.toFixed(2),
      total: total.toFixed(2),
      booksCount
    };
  };

  const fetchOrders = async (pageNum = 1, isRefresh = false) => {
    if (loading && !isRefresh) return;
    
    setLoading(true);
    
    try {
      // Debug logging
      console.log('Making API request with:');
      console.log('URL:', `${BASE_URL}/api/v1/Orders/my-orders`);
      console.log('Params:', { status, page: pageNum, pageSize });
      console.log('Token:', token ? 'Token present' : 'No token');
      
      // Prepare params - try different approaches based on validation error
      const requestParams = {
        page: pageNum,
        pageSize: pageSize
      };
      
      // Only add status if it's a valid value (1-7, not 0)
      if (status >= 1 && status <= 7) {
        requestParams.status = status;
      }
      
      const response = await axios.get(`${BASE_URL}/api/v1/Orders/my-orders`, {
        params: requestParams,
        timeout: 10000,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      console.log('API Response:', response.status, response.data);
      
      const result = response.data;
      
      if (result.success && result.data?.orders) {
        const newOrders = result.data.orders;
        
        if (isRefresh || pageNum === 1) {
          setOrders(newOrders);
        } else {
          setOrders(prevOrders => [...prevOrders, ...newOrders]);
        }
        
        // Check if there's more data
        setHasMoreData(newOrders.length === pageSize);
        
        // Count total books
        let totalBooksCount = 0;
        newOrders.forEach(order => {
          totalBooksCount += order.totalBooks;
        });
        setTotalBooks(isRefresh || pageNum === 1 ? totalBooksCount : totalBooks + totalBooksCount);
      } else {
        setHasMoreData(false);
        // If no data and it's the first page, try without status parameter
        if (pageNum === 1 && status !== null) {
          console.log('No data found, retrying without status parameter...');
          setStatus(null);
          return;
        }
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      let errorMessage = 'Failed to fetch orders. Please try again.';
      
      if (error.response) {
        // Server responded with error status
        errorMessage = `Server Error: ${error.response.status}`;
        if (error.response.data?.message) {
          errorMessage += ` - ${error.response.data.message}`;
        } else if (error.response.data?.title) {
          errorMessage += ` - ${error.response.data.title}`;
        } else if (error.response.data?.error) {
          errorMessage += ` - ${error.response.data.error}`;
        } else if (typeof error.response.data === 'string') {
          errorMessage += ` - ${error.response.data}`;
        }
        
        // Handle validation errors specifically
        if (error.response.status === 400 && error.response.data?.errors) {
          console.log('Validation errors:', error.response.data.errors);
          
          // If status validation failed, try without status
          if (error.response.data.errors.status && status !== null) {
            console.log('Status validation failed, retrying without status...');
            setStatus(null);
            return;
          }
          
          // Show validation error details
          const validationErrors = Object.keys(error.response.data.errors).map(key => 
            `${key}: ${error.response.data.errors[key].join(', ')}`
          ).join('; ');
          errorMessage += ` - Validation errors: ${validationErrors}`;
        }
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'Network error. Please check your connection.';
        console.log('Network error - no response received');
      } else if (error.code === 'ECONNABORTED') {
        // Request timeout
        errorMessage = 'Request timeout. Please try again.';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders(1, true);
  }, [status]);

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    setHasMoreData(true);
    fetchOrders(1, true);
  };

  const loadMoreData = () => {
    if (!loading && hasMoreData) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchOrders(nextPage);
    }
  };

  const handleScroll = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 100;
    
    if (isCloseToBottom) {
      loadMoreData();
    }
  };

 const removeBook = (orderId, itemId) => {
  Alert.alert(
    'Remove Book',
    'Are you sure you want to remove this book?',
    [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Remove', 
        style: 'destructive',
        onPress: () => {
          setOrders(prevOrders => 
            prevOrders.map(order => {
              if (order.orderId === orderId) {
                return {
                  ...order,
                  books: order.books.filter(book => book.itemId !== itemId)
                };
              }
              return order;
            })
          );
        }
      }
    ]
  );
};


  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'returned': return '#4CAF50';
      default: return '#757575';
    }
  };

  const totals = calculateTotals();

  const renderBookItem = (book, orderId) => (
    <View key={`${orderId}-${book.itemId}`} style={styles.bookItem}>
      <Image 
        source={{ uri: book.imageUrl }} 
        style={styles.bookImage}
        resizeMode="cover"
      />
      <View style={styles.bookDetails}>
        <Text style={styles.bookTitle} numberOfLines={2}>
          {book.title}
        </Text>
        <Text style={styles.bookAuthor}>
          By {book.authors.join(', ')}
        </Text>
        <View style={styles.quantityContainer}>
          <Text style={styles.quantityLabel}>QTY</Text>
          <TouchableOpacity style={styles.quantityButton}>
            <Text style={styles.quantityText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>1</Text>
          <TouchableOpacity style={styles.quantityButton}>
            <Text style={styles.quantityText}>+</Text>
          </TouchableOpacity>
        </View>
   <TouchableOpacity 
  style={styles.removeButton}
  onPress={() => removeBook(orderId, book.itemId)}
>
  <MaterialIcons name="delete" size={20} color="#fff" />
  <Text style={styles.removeButtonText}>Remove</Text>
</TouchableOpacity>
      </View>
    </View>
  );

  const renderBorrowedBooks = () => {
    const borrowedBooks = [];
    orders.forEach(order => {
      order.books.forEach(book => {
        if (book.status === 'Delivered' || book.status === 'Returned') {
          borrowedBooks.push({
            title: book.title,
            author: book.authors[0],
            status: book.status,
            returnDate: book.returnDate,
            expectedReturnDate: book.expectedReturnDate
          });
        }
      });
    });

    return borrowedBooks.map((book, index) => (
      <View key={index} style={styles.borrowedBookItem}>
        <Text style={styles.borrowedBookNumber}>{index + 1}.</Text>
        <Text style={styles.borrowedBookTitle}>
          {book.title} – {book.author}
        </Text>
        <Text style={[styles.borrowedBookStatus, { color: getStatusColor(book.status) }]}>
          {book.status}
        </Text>
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#56A6AD" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
        <TouchableOpacity style={styles.wishlistButton}>
          <Icon name="favorite" size={24} color="#ff4757" />
          <Text style={styles.wishlistText}>Wishlist</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Cart Header */}
        <View style={styles.cartHeader}>
          <Text style={styles.cartTitle}>Your cart</Text>
          <View style={styles.bookCountBadge}>
            <Text style={styles.bookCountText}>{totals.booksCount} Books</Text>
          </View>
        </View>

        {/* Cart Items */}
        {orders.map(order => 
          order.books.map(book => renderBookItem(book, order.orderId))
        )}

        {/* Loading indicator for pagination */}
        {loading && page > 1 && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#5DADE2" />
          </View>
        )}

        {/* Borrowed Books Section */}
        <View style={styles.borrowedSection}>
          <View style={styles.borrowedHeader}>
            <Text style={styles.borrowedTitle}>Borrowed Books List</Text>
            <Text style={styles.returnStatus}>Return Status</Text>
          </View>
          {renderBorrowedBooks()}
          {renderBorrowedBooks().length > 0 && (
            <View style={styles.returnNotice}>
              <Icon name="info" size={16} color="#FF9800" />
              <Text style={styles.returnNoticeText}>
                Please return your borrowed books before placing a new order
              </Text>
            </View>
          )}
        </View>

        {/* Order Summary */}
        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Sub Total</Text>
            <Text style={styles.summaryValue}>AED {totals.subtotal}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Discount</Text>
            <Text style={styles.summaryValue}>AED {totals.discount}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Charges</Text>
            <Text style={styles.summaryValue}>AED {totals.deliveryCharges}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>AED {totals.total}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerInfo}>
          <Text style={styles.footerBooksCount}>{totals.booksCount} Books in cart</Text>
          <Text style={styles.footerTotal}>AED {totals.total}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.checkoutButtonText}>Checkout</Text>
        </TouchableOpacity>
      </View>

      {/* Loading overlay */}
      {loading && page === 1 && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#5DADE2" />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#56A6AD',
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginLeft: 16,
  },
  wishlistButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wishlistText: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 14,
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
  },
  cartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  cartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  bookCountBadge: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  bookCountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  bookItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  bookImage: {
    width: 80,
    height: 100,
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
  },
  bookDetails: {
    flex: 1,
    marginLeft: 12,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  bookPrice: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  quantityLabel: {
    fontSize: 14,
    color: '#333',
    marginRight: 8,
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  quantityText: {
    fontSize: 16,
    color: '#333',
  },
  quantity: {
    fontSize: 14,
    color: '#333',
    marginHorizontal: 8,
  },
  removeButton: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "red",
  justifyContent:"center",
  paddingVertical: 6,
  borderRadius: 6,
  width:'40%'
},
removeButtonText: {
  color: "#fff",
  marginLeft: 6, // spacing between icon and text
  fontSize: 14,
  fontWeight: "bold",
},

  removeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  borrowedSection: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    marginTop: 8,
  },
  borrowedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  borrowedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  returnStatus: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  borrowedBookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  borrowedBookNumber: {
    fontSize: 14,
    color: '#333',
    marginRight: 8,
  },
  borrowedBookTitle: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  borrowedBookStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  returnNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 8,
    backgroundColor: '#fff3cd',
    borderRadius: 4,
  },
  returnNoticeText: {
    fontSize: 12,
    color: '#856404',
    marginLeft: 8,
    flex: 1,
  },
  summarySection: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 8,
    borderTopColor: '#f0f0f0',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#333',
  },
  summaryValue: {
    fontSize: 16,
    color: '#333',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    marginTop: 8,
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerInfo: {
    flex: 1,
  },
  footerBooksCount: {
    fontSize: 14,
    color: '#333',
  },
  footerTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  checkoutButton: {
    backgroundColor: '#56A6AD',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ShoppingCartScreen;