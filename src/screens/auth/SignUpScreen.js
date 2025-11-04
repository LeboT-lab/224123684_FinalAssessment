import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../services/firebaseConfig';
import { createUserProfile } from '../../services/userService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignUpScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSignUp = async () => {
  if (!firstName.trim() || !lastName.trim()) {
    Alert.alert('Error', 'Please enter your full name');
    return;
  }
  
  if (!email.trim()) {
    Alert.alert('Error', 'Please enter an email address');
    return;
  }
  
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email.trim())) {
    Alert.alert('Error', 'Please enter a valid email address');
    return;
  }
  
  if (!password) {
    Alert.alert('Error', 'Please enter a password');
    return;
  }
  
  if (password.length < 6) {
    Alert.alert('Error', 'Password must be at least 6 characters long');
    return;
  }
  
  if (password !== confirmPassword) {
    Alert.alert('Error', 'Passwords do not match');
    return;
  }
  
  setLoading(true);
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const user = userCredential.user;
    
    navigation.navigate('Main');
    
  } catch (error) {
    let errorMessage = 'Sign up failed. Please try again.';
    
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'This email is already registered.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address.';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password should be at least 6 characters.';
    } else {
      errorMessage = error.message;
    }
    
    Alert.alert('Sign Up Failed', errorMessage);
  } finally {
    setLoading(false);
  }
};

  const handleGoogleSignUp = () => {
    Alert.alert('Coming Soon', 'Google authentication will be available soon');
  };

  const handleAppleSignUp = () => {
    Alert.alert('Coming Soon', 'Apple authentication will be available soon');
  };

  const handleSignIn = () => {
    navigation.navigate('SignIn');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={styles.header}>
          <Image 
            source={require('../../../assets/images/auth/icon.png')}
            style={styles.logo}
          />
          <Text style={styles.appName}>Luxury Hotels</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Sign up</Text>

          <View style={styles.nameContainer}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.input}
                placeholder="First"
                placeholderTextColor="#999"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
                editable={!loading}
              />
            </View>
            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Last"
                placeholderTextColor="#999"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
                editable={!loading}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Create a password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                editable={!loading}
              />
              <TouchableOpacity 
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                <Image 
                  source={require('../../../assets/images/auth/eye-off.png')}
                  style={styles.eyeIcon}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.passwordHint}>Must be at least 6 characters</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirm your password"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                editable={!loading}
              />
              <TouchableOpacity 
                style={styles.eyeButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
              >
                <Image 
                  source={require('../../../assets/images/auth/eye-off.png')}
                  style={styles.eyeIcon}
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.primaryButton, loading && styles.buttonDisabled]} 
            onPress={handleSignUp}
            disabled={loading}
          >
            <Text style={styles.primaryButtonText}>
              {loading ? 'Creating Account...' : 'Sign up with Email'}
            </Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity 
              style={[styles.socialButton, loading && styles.buttonDisabled]} 
              onPress={handleGoogleSignUp}
              disabled={loading}
            >
              <Image 
                source={require('../../../assets/images/auth/google1.png')}
                style={styles.socialIcon}
              />
              <Text style={styles.socialButtonText}>Sign up with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.socialButton, loading && styles.buttonDisabled]} 
              onPress={handleAppleSignUp}
              disabled={loading}
            >
              <Image 
                source={require('../../../assets/images/auth/vuesax_bold_apple.png')}
                style={styles.socialIcon}
              />
              <Text style={styles.socialButtonText}>Sign up with Apple</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Already have an account? </Text>
            <TouchableOpacity onPress={handleSignIn} disabled={loading}>
              <Text style={[styles.signInLink, loading && styles.linkDisabled]}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 12,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C2C2C',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C2C2C',
    marginBottom: 30,
    textAlign: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#2C2C2C',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: '#2C2C2C',
  },
  eyeButton: {
    padding: 16,
  },
  eyeIcon: {
    width: 20,
    height: 20,
  },
  passwordHint: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    marginLeft: 4,
  },
  primaryButton: {
    backgroundColor: '#D4AF37',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E5E5',
  },
  dividerText: {
    marginHorizontal: 15,
    color: '#666',
    fontSize: 14,
  },
  socialButtonsContainer: {
    gap: 12,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 16,
  },
  socialIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  socialButtonText: {
    color: '#2C2C2C',
    fontSize: 16,
    fontWeight: '500',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  signInText: {
    color: '#666',
    fontSize: 14,
  },
  signInLink: {
    color: '#D4AF37',
    fontSize: 14,
    fontWeight: '600',
  },
  linkDisabled: {
    opacity: 0.6,
  },
});

export default SignUpScreen;