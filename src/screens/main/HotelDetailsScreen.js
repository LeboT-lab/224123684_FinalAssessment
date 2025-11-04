import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Share
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const HotelDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { hotel } = route.params;
  
  const [selectedImage, setSelectedImage] = useState(0);
  
  const hotelImages = [
    hotel.image,
    hotel.image,
    hotel.image,
    hotel.image,
  ];

  const handleBookNow = () => {
    Alert.alert(
      'Book Now',
      `Would you like to book ${hotel.name} for $${hotel.price}/night?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm Booking', 
          onPress: () => {
            Alert.alert('Success', 'Your booking has been confirmed!');
            navigation.navigate('Booking', { hotel });
          }
        },
      ]
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${hotel.name} in ${hotel.location} - $${hotel.price}/night. Rating: ${hotel.rating} ⭐`,
        url: 'https://luxuryhotels.com',
        title: hotel.name,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share hotel details');
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push('⭐');
    }
    
    if (hasHalfStar) {
      stars.push('½');
    }

    return stars.join(' ');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hotel Details</Text>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Text style={styles.shareButtonText}>Share</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Image source={hotelImages[selectedImage]} style={styles.mainImage} />
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.thumbnailContainer}
        >
          {hotelImages.map((image, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedImage(index)}
            >
              <Image 
                source={image} 
                style={[
                  styles.thumbnail,
                  selectedImage === index && styles.thumbnailSelected
                ]} 
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.content}>
          <View style={styles.hotelHeader}>
            <View style={styles.titleSection}>
              <Text style={styles.hotelName}>{hotel.name}</Text>
              <Text style={styles.hotelLocation}>{hotel.location}</Text>
            </View>
            <View style={styles.ratingSection}>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>⭐ {hotel.rating}</Text>
              </View>
              <Text style={styles.reviews}>({hotel.reviews} reviews)</Text>
            </View>
          </View>

          <View style={styles.priceSection}>
            <Text style={styles.price}>${hotel.price}</Text>
            <Text style={styles.perNight}>/ night</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{hotel.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesGrid}>
              {hotel.amenities.map((amenity, index) => (
                <View key={index} style={styles.amenityItem}>
                  <Text style={styles.amenityText}>✓ {amenity}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.featuresSection}>
            <View style={styles.featureItem}>
              <Text style={styles.featureValue}>⭐ {hotel.rating}/5</Text>
              <Text style={styles.featureLabel}>Rating</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureValue}>{hotel.reviews}+</Text>
              <Text style={styles.featureLabel}>Reviews</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureValue}>Free</Text>
              <Text style={styles.featureLabel}>Cancellation</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureValue}>24/7</Text>
              <Text style={styles.featureLabel}>Support</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.priceFooter}>
          <Text style={styles.totalPrice}>${hotel.price}</Text>
          <Text style={styles.totalLabel}>per night</Text>
        </View>
        <TouchableOpacity style={styles.bookButton} onPress={handleBookNow}>
          <Text style={styles.bookButtonText}>Book Now</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 20,
    color: '#2C2C2C',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C2C2C',
  },
  shareButton: {
    padding: 8,
  },
  shareButtonText: {
    fontSize: 16,
    color: '#D4AF37',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  mainImage: {
    width: '100%',
    height: 300,
  },
  thumbnailContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FFF',
  },
  thumbnail: {
    width: 80,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
    opacity: 0.6,
  },
  thumbnailSelected: {
    opacity: 1,
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  content: {
    padding: 20,
  },
  hotelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleSection: {
    flex: 1,
    marginRight: 10,
  },
  hotelName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C2C2C',
    marginBottom: 4,
  },
  hotelLocation: {
    fontSize: 16,
    color: '#D4AF37',
    fontWeight: '500',
  },
  ratingSection: {
    alignItems: 'flex-end',
  },
  ratingBadge: {
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  reviews: {
    fontSize: 12,
    color: '#666',
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 24,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C2C2C',
  },
  perNight: {
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C2C2C',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  amenityItem: {
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    margin: 5,
  },
  amenityText: {
    fontSize: 14,
    color: '#2C2C2C',
    fontWeight: '500',
  },
  featuresSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featureItem: {
    alignItems: 'center',
  },
  featureValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C2C2C',
    marginBottom: 4,
  },
  featureLabel: {
    fontSize: 12,
    color: '#666',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  priceFooter: {
    alignItems: 'flex-start',
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C2C2C',
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
  },
  bookButton: {
    backgroundColor: '#D4AF37',
    paddingHorizontal: 30,
    paddingVertical: 16,
    borderRadius: 12,
    flex: 0.6,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HotelDetailsScreen;