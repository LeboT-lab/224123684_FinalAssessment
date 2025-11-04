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
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { setUser } = useAuth();

  const validateForm = () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    if (!password) {
      Alert.alert('Error', 'Please enter your password');
      return false;
    }
    return true;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const { user, error } = await authService.signIn(email, password);
      
      if (error) {
        Alert.alert('Sign In Failed', error);
        return;
      }

      if (user) {
        setUser({
          uid: user.uid,
          email: user.email
        });
        navigation.navigate('Main');
      }
    } catch (error) {
      Alert.alert('Sign In Failed', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    Alert.alert('Google Sign In', 'Google authentication will be implemented with Firebase');
  };

  const handleAppleSignIn = () => {
    Alert.alert('Apple Sign In', 'Apple authentication will be implemented with Firebase');
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
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
          <Text style={styles.title}>Sign in</Text>

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
                placeholder="Enter your password"
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
          </View>

          <TouchableOpacity 
            style={styles.forgotPassword} 
            onPress={handleForgotPassword}
            disabled={loading}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.primaryButton, loading && styles.buttonDisabled]} 
            onPress={handleSignIn}
            disabled={loading}
          >
            <Text style={styles.primaryButtonText}>
              {loading ? 'Signing In...' : 'Sign in with Email'}
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
              onPress={handleGoogleSignIn}
              disabled={loading}
            >
              <Image 
                source={require('../../../assets/images/auth/google1.png')}
                style={styles.socialIcon}
              />
              <Text style={styles.socialButtonText}>Sign in with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.socialButton, loading && styles.buttonDisabled]} 
              onPress={handleAppleSignIn}
              disabled={loading}
            >
              <Image 
                source={require('../../../assets/images/auth/vuesax_bold_apple.png')}
                style={styles.socialIcon}
              />
              <Text style={styles.socialButtonText}>Sign in with Apple</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity onPress={handleSignUp} disabled={loading}>
              <Text style={styles.signUpLink}>Sign up</Text>
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: '#D4AF37',
    fontSize: 14,
    fontWeight: '500',
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
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  signUpText: {
    color: '#666',
    fontSize: 14,
  },
  signUpLink: {
    color: '#D4AF37',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SignInScreen;