import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../services/firebaseConfig';
import { authService } from '../../services/authService';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState({
    name: '',
    email: '',
    profilePhoto: require('../../../assets/images/profile/profile-pic.png'),
  });

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser({
        name: currentUser.displayName || 'User',
        email: currentUser.email || 'No email',
        profilePhoto: require('../../../assets/images/profile/profile-pic.png'),
      });
    }
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await authService.signOut();
            navigation.navigate('SignIn');
          }
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image source={user.profilePhoto} style={styles.avatar} />
            <View style={styles.onlineIndicator} />
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <View style={styles.memberBadge}>
            <Text style={styles.memberBadgeText}>🌟 Premium Member</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Bookings</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>⭐</Text>
            <Text style={styles.statLabel}>New</Text>
          </View>
        </View>

        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>✏️ Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>🚪 Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🎯 Personal Information</Text>
            <View style={styles.sectionIcon}>👤</View>
          </View>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>{user.name}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Member Status</Text>
              <Text style={[styles.infoValue, styles.premiumText]}>Premium</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📅 Recent Bookings</Text>
            <View style={styles.sectionIcon}>🏨</View>
          </View>
          <View style={styles.emptyBookings}>
            <Text style={styles.emptyEmoji}>🛎️</Text>
            <Text style={styles.emptyText}>No bookings yet</Text>
            <Text style={styles.emptySubtext}>
              Start exploring luxury hotels and plan your next getaway!
            </Text>
            <TouchableOpacity style={styles.exploreButton}>
              <Text style={styles.exploreButtonText}>Discover Hotels 🌟</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.funFacts}>
          <Text style={styles.funFactsTitle}>Did You Know? 💫</Text>
          <Text style={styles.funFact}>You're just one booking away from your next adventure!</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDF7',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 40,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4CAF50',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  userEmail: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 15,
  },
  memberBadge: {
    backgroundColor: 'rgba(255,215,0,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.5)',
  },
  memberBadgeText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: -25,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 10,
  },
  actionsSection: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#D4AF37',
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  editButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF6B6B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  logoutButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 25,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C2C2C',
  },
  sectionIcon: {
    fontSize: 24,
  },
  infoGrid: {
    gap: 20,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#2C2C2C',
    fontWeight: '600',
  },
  premiumText: {
    color: '#D4AF37',
    fontWeight: 'bold',
  },
  emptyBookings: {
    alignItems: 'center',
    padding: 20,
  },
  emptyEmoji: {
    fontSize: 50,
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  exploreButton: {
    backgroundColor: '#D4AF37',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  exploreButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  funFacts: {
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    margin: 20,
    padding: 25,
    borderRadius: 25,
    alignItems: 'center',
  },
  funFactsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
  },
  funFact: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default ProfileScreen;