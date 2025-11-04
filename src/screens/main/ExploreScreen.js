import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ExploreScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [filterRating, setFilterRating] = useState(0);

  const hotelData = [
    {
      id: '1',
      name: 'Citadines Berawa',
      location: 'Bali, Indonesia',
      rating: 4.8,
      reviews: 284,
      price: 150,
      image: require('../../../assets/images/hotels/Hotel1.png'),
      description: 'Luxury beachfront resort with private pools and spa services',
      amenities: ['Free WiFi', 'Swimming Pool', 'Spa', 'Beach Access'],
    },
    {
      id: '2',
      name: 'ORI Jakarta',
      location: 'Jakarta, Indonesia',
      rating: 4.0,
      reviews: 156,
      price: 89,
      image: require('../../../assets/images/hotels/Hotel2.png'),
      description: 'Modern business hotel in the heart of Jakarta',
      amenities: ['Free WiFi', 'Business Center', 'Restaurant', 'Gym'],
    },
    {
      id: '3',
      name: 'Double Six Luxury',
      location: 'Seminyak, Bali',
      rating: 4.7,
      reviews: 342,
      price: 220,
      image: require('../../../assets/images/hotels/Hotel3.png'),
      description: 'Premium luxury resort with ocean views and fine dining',
      amenities: ['Free WiFi', 'Infinity Pool', 'Spa', 'Fine Dining', 'Beach Club'],
    },
    {
      id: '4',
      name: 'Likita Resort',
      location: 'Ubud, Bali',
      rating: 4.9,
      reviews: 198,
      price: 180,
      image: require('../../../assets/images/hotels/Hotel4.png'),
      description: 'Peaceful retreat surrounded by rice fields and nature',
      amenities: ['Free WiFi', 'Yoga Studio', 'Organic Restaurant', 'Spa'],
    },
    {
      id: '5',
      name: 'The Grand Heritage',
      location: 'Yogyakarta, Indonesia',
      rating: 4.5,
      reviews: 223,
      price: 120,
      image: require('../../../assets/images/hotels/Hotel5.png'),
      description: 'Historic luxury hotel with traditional Javanese architecture',
      amenities: ['Free WiFi', 'Heritage Tours', 'Pool', 'Cultural Shows'],
    },
    {
      id: '6',
      name: 'Oceanview Suites',
      location: 'Lombok, Indonesia',
      rating: 4.6,
      reviews: 167,
      price: 135,
      image: require('../../../assets/images/hotels/Hotel6.png'),
      description: 'Beachfront suites with private balconies and ocean views',
      amenities: ['Free WiFi', 'Private Beach', 'Water Sports', 'Restaurant'],
    },
  ];

  const filteredHotels = hotelData
    .filter(hotel => 
      hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hotel.location.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(hotel => hotel.rating >= filterRating)
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  const handleHotelPress = (hotel) => {
    navigation.navigate('HotelDetails', { hotel });
  };

  const renderHotelCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.hotelCard}
      onPress={() => handleHotelPress(item)}
    >
      <Image source={item.image} style={styles.hotelImage} />
      <View style={styles.hotelInfo}>
        <View style={styles.hotelHeader}>
          <Text style={styles.hotelName}>{item.name}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ {item.rating}</Text>
            <Text style={styles.reviews}>({item.reviews})</Text>
          </View>
        </View>
        <Text style={styles.hotelLocation}>{item.location}</Text>
        <Text style={styles.hotelDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.hotelFooter}>
          <Text style={styles.price}>${item.price}<Text style={styles.perNight}>/night</Text></Text>
          <TouchableOpacity style={styles.bookButton}>
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSectionHeader = () => (
    <View style={styles.headerSection}>
      <Text style={styles.welcomeTitle}>Discover Luxury Stays</Text>
      <Text style={styles.welcomeSubtitle}>Find your perfect getaway</Text>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search hotels or locations..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
      >
        <TouchableOpacity 
          style={[styles.filterButton, sortBy === 'default' && styles.filterButtonActive]}
          onPress={() => setSortBy('default')}
        >
          <Text style={[styles.filterText, sortBy === 'default' && styles.filterTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterButton, sortBy === 'price-low' && styles.filterButtonActive]}
          onPress={() => setSortBy('price-low')}
        >
          <Text style={[styles.filterText, sortBy === 'price-low' && styles.filterTextActive]}>
            Price: Low to High
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterButton, sortBy === 'price-high' && styles.filterButtonActive]}
          onPress={() => setSortBy('price-high')}
        >
          <Text style={[styles.filterText, sortBy === 'price-high' && styles.filterTextActive]}>
            Price: High to Low
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterButton, sortBy === 'rating' && styles.filterButtonActive]}
          onPress={() => setSortBy('rating')}
        >
          <Text style={[styles.filterText, sortBy === 'rating' && styles.filterTextActive]}>
            Top Rated
          </Text>
        </TouchableOpacity>

        {[4, 3, 2].map(rating => (
          <TouchableOpacity 
            key={rating}
            style={[styles.filterButton, filterRating === rating && styles.filterButtonActive]}
            onPress={() => setFilterRating(filterRating === rating ? 0 : rating)}
          >
            <Text style={[styles.filterText, filterRating === rating && styles.filterTextActive]}>
              {rating}+ Stars
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>
        {filteredHotels.length} Hotels Found
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredHotels}
        renderItem={renderHotelCard}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderSectionHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No hotels found</Text>
            <Text style={styles.emptyStateSubtext}>Try adjusting your search or filters</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDF7',
  },
  listContent: {
    paddingBottom: 20,
  },
  headerSection: {
    padding: 20,
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C2C2C',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#2C2C2C',
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterButton: {
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  filterButtonActive: {
    backgroundColor: '#D4AF37',
    borderColor: '#D4AF37',
  },
  filterText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#FFF',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C2C2C',
    marginBottom: 10,
  },
  hotelCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  hotelImage: {
    width: '100%',
    height: 200,
  },
  hotelInfo: {
    padding: 16,
  },
  hotelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  hotelName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C2C2C',
    flex: 1,
    marginRight: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C2C2C',
    marginRight: 4,
  },
  reviews: {
    fontSize: 12,
    color: '#666',
  },
  hotelLocation: {
    fontSize: 14,
    color: '#D4AF37',
    fontWeight: '500',
    marginBottom: 8,
  },
  hotelDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  hotelFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C2C2C',
  },
  perNight: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'normal',
  },
  bookButton: {
    backgroundColor: '#D4AF37',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  bookButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default ExploreScreen;