import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';




const RegistrationForm = () => {
  const BASE_URL = 'https://primabi.co';
  // Personal Information State
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Password State
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Shipping Address State
  const [streetAddress1, setStreetAddress1] = useState('');
  const [streetAddress2, setStreetAddress2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');

  // Promo Code State
  const [promoCode, setPromoCode] = useState('');

  // OTP State
  const [emailPhone, setEmailPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [activeOtpIndex, setActiveOtpIndex] = useState(0);

  // Loading/Error State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Send OTP
  const sendOTP = () => {
    if (emailPhone.trim()) {
      setOtpSent(true);
      Alert.alert('Success', 'OTP sent to your email/phone');
    } else {
      Alert.alert('Error', 'Please enter email or phone number');
    }
  };

  // Handle OTP Input
  const handleOtpChange = (value, index) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) setActiveOtpIndex(index + 1);
  };

  // Handle OTP Backspace
  const handleOtpKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      setActiveOtpIndex(index - 1);
    }
  };

  // Handle Registration
  const handleRegistration = async () => {
    try {
      setLoading(true);
      setError('');

      const requestBody = {
        subscriptionType: 0,
      };

      if (email.trim()) requestBody.email = email.trim();
      if (firstName.trim()) requestBody.firstName = firstName.trim();
      if (lastName.trim()) requestBody.lastName = lastName.trim();
      if (phoneNumber.trim()) requestBody.phoneNumber = phoneNumber.trim();
      if (password.trim()) requestBody.password = password.trim();
      if (confirmPassword.trim()) requestBody.confirmPassword = confirmPassword.trim();
      if (streetAddress1.trim()) requestBody.streetAddress1 = streetAddress1.trim();
      if (streetAddress2.trim()) requestBody.streetAddress2 = streetAddress2.trim();
      if (city.trim()) requestBody.city = city.trim();
      if (state.trim()) requestBody.state = state.trim();
      if (zip.trim()) requestBody.zipCode = zip.trim();
      if (promoCode.trim()) requestBody.promoCode = promoCode.trim();

      console.log("Request Body:", JSON.stringify(requestBody, null, 2));

      const response = await axios.post(`${BASE_URL}/api/v1/Auth/register`, requestBody, {
        headers: { "Content-Type": "application/json" },
        timeout: 10000,
      });

      console.log("Response:", response.data);
      setLoading(false);
      Alert.alert("Success", "Registration completed successfully!");
    } catch (err) {
      setLoading(false);
      console.error("Registration error:", err);

      if (err.response) {
        const errorMessage =
          err.response.data?.message ||
          err.response.data?.error ||
          `Server Error: ${err.response.status}`;
        setError(errorMessage);
        Alert.alert("Registration Error", errorMessage);
      } else if (err.request) {
        setError("Network error");
        Alert.alert("Network Error", "Please check your internet connection and try again.");
      } else {
        setError(err.message);
        Alert.alert("Error", "Registration failed. Please try again.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Create Account</Text>

        {/* Personal Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Password Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={24} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Shipping Address Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Address</Text>
          <View style={styles.inputContainer}>
            <TextInput style={styles.input} placeholder="Street Address 1" value={streetAddress1} onChangeText={setStreetAddress1} />
          </View>
          <View style={styles.inputContainer}>
            <TextInput style={styles.input} placeholder="Street Address 2 (Optional)" value={streetAddress2} onChangeText={setStreetAddress2} />
          </View>
          <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
              <TextInput style={styles.input} placeholder="City" value={city} onChangeText={setCity} />
            </View>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
              <TextInput style={styles.input} placeholder="State" value={state} onChangeText={setState} />
            </View>
            <View style={[styles.inputContainer, { flex: 1 }]}>
              <TextInput style={styles.input} placeholder="Zip" value={zip} onChangeText={setZip} keyboardType="numeric" />
            </View>
          </View>
        </View>

        {/* Promo Code Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Promo Code (Optional)</Text>
          <View style={styles.inputContainer}>
            <TextInput style={styles.input} placeholder="Enter promo code" value={promoCode} onChangeText={setPromoCode} autoCapitalize="characters" />
          </View>
        </View>

        {/* OTP Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Verification</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter email/phone"
              value={emailPhone}
              onChangeText={setEmailPhone}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!otpSent}
            />
          </View>
          {!otpSent ? (
            <TouchableOpacity style={styles.otpButton} onPress={sendOTP}>
              <Text style={styles.otpButtonText}>Send OTP</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.otpBoxContainer}>
              <Text style={styles.otpLabel}>Enter 6-digit OTP</Text>
              <View style={styles.otpBoxes}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    style={[styles.otpBox, activeOtpIndex === index && styles.activeOtpBox]}
                    value={digit}
                    onChangeText={(value) => handleOtpChange(value, index)}
                    onKeyPress={(e) => handleOtpKeyPress(e, index)}
                    keyboardType="numeric"
                    maxLength={1}
                    textAlign="center"
                    onFocus={() => setActiveOtpIndex(index)}
                  />
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Register Button */}
        <TouchableOpacity style={styles.registerButton} onPress={handleRegistration}>
          <Text style={styles.registerButtonText}>Create Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  section: {
    marginBottom: 25,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  eyeIcon: {
    paddingHorizontal: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapContainer: {
    marginTop: 10,
  },
  mapTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 10,
    color: '#666',
  },
  map: {
    height: 200,
    borderRadius: 8,
  },
  otpBoxContainer: {
    marginTop: 15,
  },
  otpBoxes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  otpBox: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#fff',
  },
  activeOtpBox: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  otpLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#666',
  },
  otpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  otpButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  verifiedButton: {
    backgroundColor: '#34C759',
  },
  otpButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  registerButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RegistrationForm;