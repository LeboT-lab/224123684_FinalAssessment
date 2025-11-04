import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MyBookingsScreen = () => {
  const navigation = useNavigation();
  
  const [bookings, setBookings] = useState([
    {
      id: 'BK123456',
      hotel: {
        name: 'Citadines Berawa',
        location: 'Bali, Indonesia',
        image: require('../../../assets/images/hotels/Hotel1.png'),
        price: 150
      },
      checkIn: new Date('2024-12-15'),
      checkOut: new Date('2024-12-18'),
      guests: 2,
      rooms: 1,
      totalCost: 534.60,
      status: 'confirmed',
      bookingDate: new Date('2024-11-04')
    },
    {
      id: 'BK123457',
      hotel: {
        name: 'ORI Jakarta',
        location: 'Jakarta, Indonesia',
        image: require('../../../assets/images/hotels/Hotel2.png'),
        price: 89
      },
      checkIn: new Date('2024-11-20'),
      checkOut: new Date('2024-11-22'),
      guests: 1,
      rooms: 1,
      totalCost: 211.57,
      status: 'completed',
      bookingDate: new Date('2024-10-28')
    }
  ]);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return '#10B981';
      case 'completed':
        return '#6B7280';
      case 'cancelled':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmed';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const calculateNights = (checkIn, checkOut) => {
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const handleCancelBooking = (bookingId) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'Keep Booking', style: 'cancel' },
        {
          text: 'Cancel Booking',
          style: 'destructive',
          onPress: () => {
            setBookings(bookings.map(booking => 
              booking.id === bookingId 
                ? { ...booking, status: 'cancelled' }
                : booking
            ));
            Alert.alert('Booking Cancelled', 'Your booking has been cancelled successfully.');
          }
        },
      ]
    );
  };

  const handleViewDetails = (booking) => {
    Alert.alert(
      'Booking Details',
      `Booking ID: ${booking.id}\nHotel: ${booking.hotel.name}\nCheck-in: ${formatDate(booking.checkIn)}\nCheck-out: ${formatDate(booking.checkOut)}\nGuests: ${booking.guests}\nRooms: ${booking.rooms}\nTotal: $${booking.totalCost}\nStatus: ${getStatusText(booking.status)}`,
      [{ text: 'OK' }]
    );
  };

  const renderBookingCard = ({ item }) => {
    const nights = calculateNights(item.checkIn, item.checkOut);
    const isUpcoming = item.status === 'confirmed' && item.checkIn > new Date();

    return (
      <View style={styles.bookingCard}>
        <View style={styles.bookingHeader}>
          <Text style={styles.bookingId}>Booking #{item.id}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
        </View>

        <View style={styles.hotelInfo}>
          <Image source={item.hotel.image} style={styles.hotelImage} />
          <View style={styles.hotelDetails}>
            <Text style={styles.hotelName}>{item.hotel.name}</Text>
            <Text style={styles.hotelLocation}>{item.hotel.location}</Text>
            <View style={styles.bookingDates}>
              <Text style={styles.dateText}>
                {formatDate(item.checkIn)} - {formatDate(item.checkOut)}
              </Text>
              <Text style={styles.nightsText}>{nights} night(s)</Text>
            </View>
          </View>
        </View>

        <View style={styles.bookingFooter}>
          <View style={styles.priceSection}>
            <Text style={styles.totalPrice}>${item.totalCost.toFixed(2)}</Text>
            <Text style={styles.priceLabel}>Total Paid</Text>
          </View>
          
          <View style={styles.actions}>
            <TouchableOpacity 
              style={styles.detailsButton}
              onPress={() => handleViewDetails(item)}
            >
              <Text style={styles.detailsButtonText}>Details</Text>
            </TouchableOpacity>
            
            {isUpcoming && (
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => handleCancelBooking(item.id)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.bookingMeta}>
          <Text style={styles.metaText}>
            Booked on {formatDate(item.bookingDate)} • {item.guests} guest(s) • {item.rooms} room(s)
          </Text>
        </View>
      </View>
    );
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
        <Text style={styles.headerTitle}>My Bookings</Text>
        <View style={styles.placeholder} />
      </View>

      {bookings.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No Bookings Yet</Text>
          <Text style={styles.emptyStateText}>
            You haven't made any bookings yet. Start exploring luxury hotels and plan your next getaway!
          </Text>
          <TouchableOpacity 
            style={styles.exploreButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.exploreButtonText}>Explore Hotels</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={bookings}
          renderItem={renderBookingCard}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  placeholder: {
    width: 40,
  },
  listContent: {
    padding: 20,
  },
  bookingCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  bookingId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C2C2C',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
  },
  hotelInfo: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  hotelImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  hotelDetails: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  hotelName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C2C2C',
    marginBottom: 4,
  },
  hotelLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  bookingDates: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateText: {
    fontSize: 14,
    color: '#2C2C2C',
    fontWeight: '500',
  },
  nightsText: {
    fontSize: 14,
    color: '#666',
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  priceSection: {
    alignItems: 'flex-start',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C2C2C',
    marginBottom: 4,
  },
  priceLabel: {
    fontSize: 12,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  detailsButton: {
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2C2C2C',
  },
  cancelButton: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#DC2626',
  },
  bookingMeta: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  metaText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  exploreButton: {
    backgroundColor: '#D4AF37',
    paddingHorizontal: 30,
    paddingVertical: 16,
    borderRadius: 12,
  },
  exploreButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MyBookingsScreen;