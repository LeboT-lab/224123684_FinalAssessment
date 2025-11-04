import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Alert,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ReviewsScreen = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(5);
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const [reviews, setReviews] = useState([
    {
      id: '1',
      userName: 'Jacob Johnson',
      userAvatar: require('../../../assets/images/reviews/user1.png'),
      rating: 5,
      date: '2024-11-01',
      comment: 'Absolutely stunning hotel! The service was exceptional and the rooms were spacious and clean. Will definitely come back!',
      likes: 12
    },
    {
      id: '2',
      userName: 'Mike Smith',
      userAvatar: require('../../../assets/images/reviews/user2.png'),
      rating: 4,
      date: '2024-10-28',
      comment: 'Great location and friendly staff. The pool area was amazing. Only minor issue was the WiFi speed in the rooms.',
      likes: 8
    },
    {
      id: '3',
      userName: 'William Davis',
      userAvatar: require('../../../assets/images/reviews/user3.png'),
      rating: 5,
      date: '2024-10-25',
      comment: 'Perfect getaway! The breakfast buffet was incredible and the spa services were top-notch. Highly recommend!',
      likes: 15
    }
  ]);

  const handleAddReview = () => {
    if (newReview.trim().length === 0) {
      Alert.alert('Error', 'Please write a review before submitting.');
      return;
    }

    const newReviewObj = {
      id: Date.now().toString(),
      userName: 'You',
      userAvatar: require('../../../assets/images/reviews/user-default.png'),
      rating: rating,
      date: new Date().toISOString().split('T')[0],
      comment: newReview.trim(),
      likes: 0
    };

    setReviews([newReviewObj, ...reviews]);
    setNewReview('');
    setRating(5);
    setModalVisible(false);
    setUserHasReviewed(true);
    
    Alert.alert('Success', 'Thank you for your review!');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(rating);
  };

  const renderReviewItem = ({ item }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <Image source={item.userAvatar} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.userName}</Text>
          <View style={styles.ratingDate}>
            <Text style={styles.stars}>{renderStars(item.rating)}</Text>
            <Text style={styles.date}>{formatDate(item.date)}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.reviewText}>{item.comment}</Text>
      <View style={styles.reviewFooter}>
        <TouchableOpacity style={styles.likeButton}>
          <Text style={styles.likeText}>👍 {item.likes}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderRatingSelector = () => {
    return (
      <View style={styles.ratingSelector}>
        <Text style={styles.ratingLabel}>Your Rating:</Text>
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setRating(star)}
              style={styles.starButton}
            >
              <Text style={[styles.star, star <= rating && styles.starSelected]}>
                ⭐
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.ratingText}>{rating}.0 out of 5</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reviews & Ratings</Text>
        <Text style={styles.headerSubtitle}>
          What our guests are saying
        </Text>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.overallRating}>
          <Text style={styles.ratingNumber}>4.8</Text>
          <Text style={styles.ratingStars}>⭐⭐⭐⭐⭐</Text>
          <Text style={styles.ratingCount}>{reviews.length} reviews</Text>
        </View>
        <View style={styles.ratingBreakdown}>
          <View style={styles.ratingBar}>
            <Text style={styles.ratingLabel}>5⭐</Text>
            <View style={styles.barBackground}>
              <View style={[styles.barFill, { width: '80%' }]} />
            </View>
            <Text style={styles.ratingPercent}>80%</Text>
          </View>
          <View style={styles.ratingBar}>
            <Text style={styles.ratingLabel}>4⭐</Text>
            <View style={styles.barBackground}>
              <View style={[styles.barFill, { width: '15%' }]} />
            </View>
            <Text style={styles.ratingPercent}>15%</Text>
          </View>
          <View style={styles.ratingBar}>
            <Text style={styles.ratingLabel}>3⭐</Text>
            <View style={styles.barBackground}>
              <View style={[styles.barFill, { width: '5%' }]} />
            </View>
            <Text style={styles.ratingPercent}>5%</Text>
          </View>
        </View>
      </View>

      {!userHasReviewed && (
        <TouchableOpacity 
          style={styles.addReviewButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addReviewButtonText}>+ Write a Review</Text>
        </TouchableOpacity>
      )}

      {userHasReviewed && (
        <View style={styles.thankYouMessage}>
          <Text style={styles.thankYouText}>🎉 Thanks for your review!</Text>
        </View>
      )}

      <FlatList
        data={reviews}
        renderItem={renderReviewItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.reviewsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No Reviews Yet</Text>
            <Text style={styles.emptyStateText}>
              Be the first to share your experience!
            </Text>
            <TouchableOpacity 
              style={styles.addReviewButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.addReviewButtonText}>Write First Review</Text>
            </TouchableOpacity>
          </View>
        }
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Write a Review</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            {renderRatingSelector()}

            <Text style={styles.reviewInputLabel}>Your Review</Text>
            <TextInput
              style={styles.reviewInput}
              placeholder="Share your experience with this hotel..."
              placeholderTextColor="#999"
              value={newReview}
              onChangeText={setNewReview}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.submitButton}
                onPress={handleAddReview}
              >
                <Text style={styles.submitButtonText}>Submit Review</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDF7',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C2C2C',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  summaryCard: {
    backgroundColor: '#FFF',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    flexDirection: 'row',
  },
  overallRating: {
    alignItems: 'center',
    marginRight: 30,
  },
  ratingNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C2C2C',
  },
  ratingStars: {
    fontSize: 16,
    marginVertical: 4,
  },
  ratingCount: {
    fontSize: 14,
    color: '#666',
  },
  ratingBreakdown: {
    flex: 1,
  },
  ratingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingLabel: {
    fontSize: 12,
    color: '#666',
    width: 30,
  },
  barBackground: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E5E5',
    borderRadius: 3,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#D4AF37',
    borderRadius: 3,
  },
  ratingPercent: {
    fontSize: 12,
    color: '#666',
    width: 30,
    textAlign: 'right',
  },
  addReviewButton: {
    backgroundColor: '#D4AF37',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addReviewButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  thankYouMessage: {
    backgroundColor: '#10B981',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  thankYouText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  reviewsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  reviewCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C2C2C',
    marginBottom: 4,
  },
  ratingDate: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stars: {
    fontSize: 14,
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  reviewText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  reviewFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  likeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
  },
  likeText: {
    fontSize: 12,
    color: '#666',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C2C2C',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
  },
  ratingSelector: {
    alignItems: 'center',
    marginBottom: 20,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  starButton: {
    padding: 4,
  },
  star: {
    fontSize: 32,
    opacity: 0.3,
  },
  starSelected: {
    opacity: 1,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
  },
  reviewInputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: 8,
  },
  reviewInput: {
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#2C2C2C',
    minHeight: 120,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#D4AF37',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});

export default ReviewsScreen;