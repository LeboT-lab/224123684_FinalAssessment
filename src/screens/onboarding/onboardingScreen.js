import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const OnboardingScreen = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigation = useNavigation();

  const onboardingData = [
    {
      id: 1,
      title: 'Find The Best Luxury Hotels',
      description: 'Discover premium hotels with world-class amenities and exceptional service',
      image: require('../../../assets/images/onboarding/Onboarding1.png'),
    },
    {
      id: 2,
      title: 'Easy Booking Process',
      description: 'Book your dream stay in just a few taps with our seamless booking system',
      image: require('../../../assets/images/onboarding/Onboarding2.png'),
    },
    {
      id: 3,
      title: 'Manage Your Stays',
      description: 'View your bookings, leave reviews, and manage your travel plans effortlessly',
      image: require('../../../assets/images/onboarding/Onboarding3.png'),
    },
  ];

  const handleNext = () => {
    if (currentSlide < onboardingData.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigation.navigate('SignIn');
    }
  };

  const handleSkip = () => {
    navigation.navigate('SignIn');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <View style={styles.imageContainer}>
        <View style={styles.imageWrapper}>
          <Image 
            source={onboardingData[currentSlide].image} 
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>{onboardingData[currentSlide].title}</Text>
        <Text style={styles.description}>{onboardingData[currentSlide].description}</Text>

        <View style={styles.pagination}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentSlide === index && styles.activeDot,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {currentSlide === onboardingData.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDF7',
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  skipText: {
    color: '#B38B59',
    fontSize: 16,
    fontWeight: '500',
  },
  imageContainer: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
    paddingHorizontal: 20,
  },
  imageWrapper: {
    width: '100%',
    height: '80%',
    borderRadius: 20,
    shadowColor: '#D4AF37',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    backgroundColor: '#FFF',
    padding: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  contentContainer: {
    flex: 0.4,
    paddingHorizontal: 40,
    paddingBottom: 60,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 30,
    color: '#2C2C2C',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 24,
    marginBottom: 30,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E5E5E5',
    marginHorizontal: 6,
  },
  activeDot: {
    backgroundColor: '#D4AF37',
    width: 30,
  },
  button: {
    backgroundColor: '#D4AF37',
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#D4AF37',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

export default OnboardingScreen;