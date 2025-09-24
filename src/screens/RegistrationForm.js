import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const RegistrationForm = () => {
  const BASE_URL = "https://primabi.co";
  const navigation = useNavigation();

  // Personal Information State
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Password State
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Shipping Address State
  const [streetAddress1, setStreetAddress1] = useState("");
  const [streetAddress2, setStreetAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");

  // Promo Code State
  const [promoCode, setPromoCode] = useState("");

  // Loading/Error State
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: "",
    type: "",
  });

  // Form Steps State
  const [currentStep, setCurrentStep] = useState(0);

  // Validation
  const validateStep = () => {
    let valid = true;
    const newErrors = {};

    if (currentStep === 0) {
      if (!firstName.trim()) {
        newErrors.firstName = "First name is required";
        valid = false;
      }
      if (!lastName.trim()) {
        newErrors.lastName = "Last name is required";
        valid = false;
      }
      if (!email.trim()) {
        newErrors.email = "Email is required";
        valid = false;
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = "Enter a valid email";
        valid = false;
      }
      if (!phoneNumber.trim()) {
        newErrors.phoneNumber = "Phone number is required";
        valid = false;
      }
    }

    if (currentStep === 1) {
      if (!password.trim()) {
        newErrors.password = "Password is required";
        valid = false;
      } else if (
        !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password.trim())
      ) {
        newErrors.password =
          "Password must be at least 8 characters with letters & numbers";
        valid = false;
      }
      if (!confirmPassword.trim()) {
        newErrors.confirmPassword = "Confirm password is required";
        valid = false;
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
        valid = false;
      }
    }

    if (currentStep === 2) {
      if (!streetAddress1.trim()) {
        newErrors.streetAddress1 = "Address is required";
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const nextStep = () => {
    if (validateStep()) {
      if (currentStep < 3) setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRegistration = async () => {
    if (!validateStep()) return;

    try {
      setLoading(true);

      const requestBody = {
        subscriptionType: 0,
        email: email.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber: phoneNumber.trim(),
        password: password.trim(),
        confirmPassword: confirmPassword.trim(),
        streetAddress1: streetAddress1.trim(),
        streetAddress2: streetAddress2.trim(),
        city: city.trim(),
        state: state.trim(),
        zipCode: zip.trim(),
        promoCode: promoCode.trim(),
      };

      const response = await axios.post(
        `${BASE_URL}/api/v1/Auth/register`,
        requestBody,
        {
          headers: { "Content-Type": "application/json" },
          timeout: 10000,
        }
      );

      setLoading(false);
      setSnackbar({
        visible: true,
        message: "Registration completed successfully!",
        type: "success",
      });
    } catch (err) {
      setLoading(false);
      let errorMessage = "Registration failed. Please try again.";
      if (err.response) {
        errorMessage =
          err.response.data?.message ||
          err.response.data?.error ||
          `Server Error: ${err.response.status}`;
      } else if (err.request) {
        errorMessage = "Network error. Please check your connection.";
      } else {
        errorMessage = err.message;
      }
      setSnackbar({ visible: true, message: errorMessage, type: "error" });
    }
  };

  const renderStepIndicator = () => {
    const steps = ["Personal", "Password", "Address", "Promo"];
    return (
      <View style={styles.stepIndicator}>
        {steps.map((step, index) => (
          <View key={index} style={styles.stepContainer}>
            <View
              style={[
                styles.stepCircle,
                index <= currentStep
                  ? styles.stepCircleActive
                  : styles.stepCircleInactive,
              ]}
            >
              <Text
                style={[
                  styles.stepText,
                  index <= currentStep
                    ? styles.stepTextActive
                    : styles.stepTextInactive,
                ]}
              >
                {index + 1}
              </Text>
            </View>
            <Text
              style={[
                styles.stepLabel,
                index === currentStep
                  ? styles.stepLabelActive
                  : styles.stepLabelInactive,
              ]}
            >
              {step}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  // Personal Info Step
  const renderPersonalInfo = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Personal Information</Text>
      <View style={styles.nameRow}>
        <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.inputLabel}>
            First Name <Text style={{ color: "red" }}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Your Name"
            value={firstName}
            onChangeText={setFirstName}
          />
          {errors.firstName && (
            <Text style={{ color: "red", fontSize: 12 }}>
              {errors.firstName}
            </Text>
          )}
        </View>
        <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.inputLabel}>
            Last Name <Text style={{ color: "red" }}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />
          {errors.lastName && (
            <Text style={{ color: "red", fontSize: 12 }}>
              {errors.lastName}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>
          Email Address <Text style={{ color: "red" }}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Your Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && (
          <Text style={{ color: "red", fontSize: 12 }}>{errors.email}</Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>
          Phone Number <Text style={{ color: "red" }}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Phone"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
        {errors.phoneNumber && (
          <Text style={{ color: "red", fontSize: 12 }}>
            {errors.phoneNumber}
          </Text>
        )}
      </View>
    </View>
  );

  // Password Step
  const renderPassword = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Create Password</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>
          Password <Text style={{ color: "red" }}>*</Text>
        </Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Enter Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#999"
            />
          </TouchableOpacity>
        </View>
        {errors.password && (
          <Text style={{ color: "red", fontSize: 12 }}>{errors.password}</Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>
          Confirm Password <Text style={{ color: "red" }}>*</Text>
        </Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Ionicons
              name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#999"
            />
          </TouchableOpacity>
        </View>
        {errors.confirmPassword && (
          <Text style={{ color: "red", fontSize: 12 }}>
            {errors.confirmPassword}
          </Text>
        )}
      </View>
    </View>
  );

  // Address Step
  const renderAddress = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Shipping Address</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>
          Street Address 1 <Text style={{ color: "red" }}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Street Address 1"
          value={streetAddress1}
          onChangeText={setStreetAddress1}
        />
        {errors.streetAddress1 && (
          <Text style={{ color: "red", fontSize: 12 }}>
            {errors.streetAddress1}
          </Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Street Address 2 (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Apartment, suite, etc."
          value={streetAddress2}
          onChangeText={setStreetAddress2}
        />
      </View>

      <View style={styles.addressRow}>
        <View style={[styles.inputContainer, { flex: 2, marginRight: 8 }]}>
          <Text style={styles.inputLabel}>City</Text>
          <TextInput
            style={styles.input}
            placeholder="City"
            value={city}
            onChangeText={setCity}
          />
        </View>
        <View style={[styles.inputContainer, { flex: 1, marginHorizontal: 4 }]}>
          <Text style={styles.inputLabel}>State</Text>
          <TextInput
            style={styles.input}
            placeholder="ST"
            value={state}
            onChangeText={setState}
          />
        </View>
        <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.inputLabel}>Zip</Text>
          <TextInput
            style={styles.input}
            placeholder="12345"
            value={zip}
            onChangeText={setZip}
            keyboardType="numeric"
          />
        </View>
      </View>
    </View>
  );

  const renderPromoCode = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Promo Code</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Promo Code (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter promo code"
          value={promoCode}
          onChangeText={setPromoCode}
          autoCapitalize="characters"
        />
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderPersonalInfo();
      case 1:
        return renderPassword();
      case 2:
        return renderAddress();
      case 3:
        return renderPromoCode();
      default:
        return renderPersonalInfo();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#5BA3B8" />

      {/* Snackbar */}
      {snackbar.visible && (
        <View
          style={{
            position: "absolute",
            top: 40,
            left: 20,
            right: 20,
            padding: 12,
            backgroundColor:
              snackbar.type === "success" ? "green" : "red",
            borderRadius: 8,
            zIndex: 1000,
          }}
        >
          <Text style={{ color: "#fff", textAlign: "center" }}>
            {snackbar.message}
          </Text>
        </View>
      )}

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Join Us</Text>
        <Text style={styles.headerSubtitle}>Create Free Account</Text>
      </View>

      {/* Step Indicator */}
      {renderStepIndicator()}

      {/* Form Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.formCard}>{renderCurrentStep()}</View>
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        {currentStep < 3 ? (
          <>
            {currentStep > 0 && (
              <TouchableOpacity style={styles.backButton} onPress={prevStep}>
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[
                styles.continueButton,
                currentStep === 0 && styles.continueButtonFull,
              ]}
              onPress={nextStep}
            >
              <Text style={styles.continueButtonText}>Save & Continue</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.backButton} onPress={prevStep}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.continueButton, loading && styles.buttonDisabled]}
              onPress={handleRegistration}
              disabled={loading}
            >
              <Text style={styles.continueButtonText}>
                {loading ? "Creating Account..." : "Create Account"}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Login Link */}
      <View style={styles.loginContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.loginText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefefeff',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#000',
    opacity: 0.8,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  stepContainer: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepCircleActive: {
    backgroundColor: '#5BA3B8',
  },
  stepCircleInactive: {
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  stepText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepTextActive: {
    color: '#ffffffff',
  },
  stepTextInactive: {
    color: '#FFF',
  },
  stepLabel: {
    fontSize: 10,
    textAlign: 'center',
  },
  stepLabelActive: {
    color: '#000',
    fontWeight: '600',
  },
  stepLabelInactive: {
    color: 'rgba(0,0,0,0.6)',
  },
  scrollView: {
    flex: 1,
  },
  formCard: {
    backgroundColor: '#FFF',
    margin: 20,
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    minHeight: 400,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  stepSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 16,
   paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
    color: '#333',
  },
  inputDisabled: {
    backgroundColor: '#F0F0F0',
    color: '#999',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 16,
   // paddingVertical: 14,
    backgroundColor: '#F8F9FA',
  },
  inputField: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  nameRow: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  addressRow: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    paddingHorizontal: 16,
  },
  otpButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  otpButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  otpSection: {
    marginTop: 20,
  },
  otpLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  otpBoxes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  otpBox: {
    width: 45,
    height: 50,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: '#F8F9FA',
    color: '#333',
  },
  activeOtpBox: {
    borderColor: '#5BA3B8',
    backgroundColor: '#FFF',
  },
  resendButton: {
    alignItems: 'center',
  },
  resendText: {
    color: '#5BA3B8',
    fontSize: 14,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 12,
   
  },
  backButton: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
  },
  backButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  continueButton: {
    flex: 2,
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonFull: {
    flex: 1,
  },
  continueButtonText: {
    color: '#f8fdffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  loginContainer: {
    alignItems: 'center',
    paddingBottom: 50,
  },
  loginText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default RegistrationForm;