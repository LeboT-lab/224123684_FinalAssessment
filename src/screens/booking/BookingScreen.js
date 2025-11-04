import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Image
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

const BookingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { hotel } = route.params;

  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date(Date.now() + 86400000)); // Tomorrow
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [showCheckInPicker, setShowCheckInPicker] = useState(false);
  const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    calculateTotalCost();
  }, [checkInDate, checkOutDate, rooms, guests]);

  const calculateTotalCost = () => {
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (nights > 0) {
      const baseCost = nights * hotel.price * rooms;
      const serviceFee = baseCost * 0.10;
      const tax = baseCost * 0.08;
      const total = baseCost + serviceFee + tax;
      setTotalCost(total);
    } else {
      setTotalCost(0);
    }
  };

  const getNights = () => {
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const onCheckInChange = (event, selectedDate) => {
    setShowCheckInPicker(false);
    if (selectedDate) {
      setCheckInDate(selectedDate);
      if (selectedDate >= checkOutDate) {
        const newCheckOut = new Date(selectedDate);
        newCheckOut.setDate(newCheckOut.getDate() + 1);
        setCheckOutDate(newCheckOut);
      }
    }
  };

  const onCheckOutChange = (event, selectedDate) => {
    setShowCheckOutPicker(false);
    if (selectedDate && selectedDate > checkInDate) {
      setCheckOutDate(selectedDate);
    } else if (selectedDate) {
      Alert.alert('Invalid Date', 'Check-out date must be after check-in date');
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const validateBooking = () => {
    const nights = getNights();
    
    if (nights <= 0) {
      Alert.alert('Invalid Dates', 'Check-out date must be after check-in date');
      return false;
    }
    
    if (guests < 1) {
      Alert.alert('Invalid Guests', 'Please select at least 1 guest');
      return false;
    }
    
    if (rooms < 1) {
      Alert.alert('Invalid Rooms', 'Please select at least 1 room');
      return false;
    }

    return true;
  };

  const handleConfirmBooking = () => {
    if (!validateBooking()) return;

    const nights = getNights();
    const bookingDetails = {
      hotel: hotel,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      nights: nights,
      guests: guests,
      rooms: rooms,
      specialRequests: specialRequests,
      totalCost: totalCost,
      bookingDate: new Date(),
      bookingId: 'BK' + Date.now(),
    };

    Alert.alert(
      'Confirm Booking',
      `Book ${hotel.name} for ${nights} night(s) at $${totalCost.toFixed(2)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm & Pay', 
          onPress: () => completeBooking(bookingDetails)
        },
      ]
    );
  };

  const completeBooking = (bookingDetails) => {
    Alert.alert(
        'Booking Confirmed!',
        `Your booking at ${hotel.name} is confirmed.\nBooking ID: ${bookingDetails.bookingId}`,
        [
            {
                text: 'View My Bookings',
                onPress: () => navigation.navigate('MyBookings'),
            },
            {
                text: 'Back to Home',
                onPress: () => navigation.navigate('Home'),
            }
        ]
    );
  };

  const nights = getNights();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Complete Booking</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.hotelCard}>
          <Image source={hotel.image} style={styles.hotelImage} />
          <View style={styles.hotelInfo}>
            <Text style={styles.hotelName}>{hotel.name}</Text>
            <Text style={styles.hotelLocation}>{hotel.location}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>⭐ {hotel.rating}</Text>
              <Text style={styles.reviews}>({hotel.reviews} reviews)</Text>
            </View>
            <Text style={styles.price}>${hotel.price} / night</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking Details</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Check-in Date</Text>
            <TouchableOpacity 
              style={styles.dateButton}
              onPress={() => setShowCheckInPicker(true)}
            >
              <Text style={styles.dateButtonText}>{formatDate(checkInDate)}</Text>
            </TouchableOpacity>
            {showCheckInPicker && (
              <DateTimePicker
                value={checkInDate}
                mode="date"
                display="default"
                onChange={onCheckInChange}
                minimumDate={new Date()}
              />
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Check-out Date</Text>
            <TouchableOpacity 
              style={styles.dateButton}
              onPress={() => setShowCheckOutPicker(true)}
            >
              <Text style={styles.dateButtonText}>{formatDate(checkOutDate)}</Text>
            </TouchableOpacity>
            {showCheckOutPicker && (
              <DateTimePicker
                value={checkOutDate}
                mode="date"
                display="default"
                onChange={onCheckOutChange}
                minimumDate={new Date(checkInDate.getTime() + 86400000)}
              />
            )}
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Guests</Text>
              <View style={styles.counterContainer}>
                <TouchableOpacity 
                  style={styles.counterButton}
                  onPress={() => setGuests(Math.max(1, guests - 1))}
                >
                  <Text style={styles.counterText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.counterValue}>{guests}</Text>
                <TouchableOpacity 
                  style={styles.counterButton}
                  onPress={() => setGuests(guests + 1)}
                >
                  <Text style={styles.counterText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Rooms</Text>
              <View style={styles.counterContainer}>
                <TouchableOpacity 
                  style={styles.counterButton}
                  onPress={() => setRooms(Math.max(1, rooms - 1))}
                >
                  <Text style={styles.counterText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.counterValue}>{rooms}</Text>
                <TouchableOpacity 
                  style={styles.counterButton}
                  onPress={() => setRooms(rooms + 1)}
                >
                  <Text style={styles.counterText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Special Requests (Optional)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Please list any special requirements or requests..."
              placeholderTextColor="#999"
              value={specialRequests}
              onChangeText={setSpecialRequests}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Summary</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>
              ${hotel.price} × {nights} night(s) × {rooms} room(s)
            </Text>
            <Text style={styles.priceValue}>
              ${(hotel.price * nights * rooms).toFixed(2)}
            </Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Service fee</Text>
            <Text style={styles.priceValue}>
              ${(hotel.price * nights * rooms * 0.10).toFixed(2)}
            </Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Tax</Text>
            <Text style={styles.priceValue}>
              ${(hotel.price * nights * rooms * 0.08).toFixed(2)}
            </Text>
          </View>
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${totalCost.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.policySection}>
          <Text style={styles.policyTitle}>Booking Policy</Text>
          <Text style={styles.policyText}>
            • Free cancellation up to 24 hours before check-in{'\n'}
            • No prepayment needed{'\n'}
            • Credit card required for reservation{'\n'}
            • Check-in: 3:00 PM, Check-out: 11:00 AM
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerPrice}>
          <Text style={styles.footerTotal}>${totalCost.toFixed(2)}</Text>
          <Text style={styles.footerNights}>{nights} night(s)</Text>
        </View>
        <TouchableOpacity 
          style={styles.bookButton}
          onPress={handleConfirmBooking}
        >
          <Text style={styles.bookButtonText}>Confirm & Book</Text>
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
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  hotelCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  hotelImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  hotelInfo: {
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
    color: '#D4AF37',
    fontWeight: '500',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
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
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C2C2C',
  },
  section: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C2C2C',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: 8,
  },
  dateButton: {
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 16,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#2C2C2C',
  },
  row: {
    flexDirection: 'row',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 8,
  },
  counterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  counterText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  counterValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C2C2C',
    marginHorizontal: 16,
  },
  textInput: {
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#2C2C2C',
    minHeight: 80,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceValue: {
    fontSize: 14,
    color: '#2C2C2C',
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingTop: 12,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C2C2C',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  policySection: {
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 100,
  },
  policyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C2C2C',
    marginBottom: 8,
  },
  policyText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
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
  footerPrice: {
    alignItems: 'flex-start',
  },
  footerTotal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C2C2C',
  },
  footerNights: {
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

export default BookingScreen;