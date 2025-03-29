import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Bell, CreditCard, CircleHelp as HelpCircle, Lock, Mail, User } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { PaymentMethodModal } from '../../components/PaymentMethodModal';
import { ProfileInfoModal, ProfileData } from '../../components/ProfileInfoModal';
import { ThemeToggle } from '../../components/ThemeToggle';
import { useTheme } from '../../components/ThemeContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [savedPaymentMethods, setSavedPaymentMethods] = useState<Array<{id: string, last4: string, brand: string}>>([]);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  const handleSavePayment = (paymentDetails: any) => {
    // In a real app, you would send this to your backend
    console.log('Payment details saved:', paymentDetails);
    
    // For demo purposes, we'll just save a representation locally
    const last4 = paymentDetails.cardNumber.slice(-4);
    // Determine card brand based on first digit (simplified)
    let brand = 'Unknown';
    const firstDigit = paymentDetails.cardNumber.charAt(0);
    if (firstDigit === '4') brand = 'Visa';
    else if (firstDigit === '5') brand = 'Mastercard';
    else if (firstDigit === '3') brand = 'Amex';
    else if (firstDigit === '6') brand = 'Discover';
    
    setSavedPaymentMethods([
      ...savedPaymentMethods,
      { id: Date.now().toString(), last4, brand }
    ]);
    
    Alert.alert('Success', 'Payment method added successfully!');
  };

  const handlePaymentMethodPress = () => {
    setPaymentModalVisible(true);
  };

  const handleProfilePress = () => {
    setProfileModalVisible(true);
  };

  const handleSaveProfile = (data: ProfileData) => {
    // In a real app, you would save this to the backend
    console.log('Profile data saved:', data);
    setProfileData(data);
    Alert.alert('Success', 'Profile information updated successfully!');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.surface }]}>
      <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Settings</Text>
        <Text style={[styles.headerSubtitle, { color: theme.secondaryText }]}>Manage your account and preferences</Text>
      </View>

      {/* Account Section */}
      <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text, backgroundColor: theme.surface }]}>Account</Text>
        
        <TouchableOpacity 
          style={[styles.settingItem, { borderTopColor: theme.border }]}
          onPress={handleProfilePress}
        >
          <User size={24} color={theme.secondaryText} />
          <View style={styles.settingContent}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>Profile Information</Text>
            {profileData && (
              <Text style={[styles.settingDetail, { color: theme.secondaryText }]}>
                {profileData.fullName}
                {Object.values(profileData.emailPreferences).filter(Boolean).length > 0 && 
                  ` • ${Object.values(profileData.emailPreferences).filter(Boolean).length} email preferences`}
              </Text>
            )}
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.settingItem, { borderTopColor: theme.border }]}>
          <Lock size={24} color={theme.secondaryText} />
          <View style={styles.settingContent}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>Password & Security</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Preferences Section */}
      <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text, backgroundColor: theme.surface }]}>Preferences</Text>
        
        <TouchableOpacity style={[styles.settingItem, { borderTopColor: theme.border }]}>
          <Bell size={24} color={theme.secondaryText} />
          <View style={styles.settingContent}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>Notifications</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.settingItem, { borderTopColor: theme.border }]}
          onPress={handlePaymentMethodPress}
        >
          <CreditCard size={24} color={theme.secondaryText} />
          <View style={styles.settingContent}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>Payment Methods</Text>
            {savedPaymentMethods.length > 0 && (
              <Text style={[styles.settingDetail, { color: theme.secondaryText }]}>
                {savedPaymentMethods.length} {savedPaymentMethods.length === 1 ? 'card' : 'cards'} saved
              </Text>
            )}
          </View>
        </TouchableOpacity>

        {/* Theme Toggle */}
        <View style={[styles.settingItem, { borderTopColor: theme.border }]}>
          <ThemeToggle style={{ flex: 1 }} />
        </View>
      </View>

      {/* Support Section */}
      <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text, backgroundColor: theme.surface }]}>Support</Text>
        
        <TouchableOpacity style={[styles.settingItem, { borderTopColor: theme.border }]}>
          <HelpCircle size={24} color={theme.secondaryText} />
          <View style={styles.settingContent}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>Help Center</Text>
          </View>
        </TouchableOpacity>
      </View>

      {savedPaymentMethods.length > 0 && (
        <View style={[styles.paymentCardsSection, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text, backgroundColor: theme.surface }]}>Saved Payment Methods</Text>
          {savedPaymentMethods.map((method) => (
            <View key={method.id} style={[styles.paymentCard, { borderTopColor: theme.border }]}>
              <CreditCard size={24} color={theme.text} />
              <View style={styles.paymentCardDetails}>
                <Text style={[styles.paymentCardType, { color: theme.text }]}>{method.brand}</Text>
                <Text style={[styles.paymentCardNumber, { color: theme.secondaryText }]}>•••• {method.last4}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.signOutButton}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      {/* Modals */}
      <PaymentMethodModal
        visible={paymentModalVisible}
        onClose={() => setPaymentModalVisible(false)}
        onSave={handleSavePayment}
      />

      <ProfileInfoModal
        visible={profileModalVisible}
        onClose={() => setProfileModalVisible(false)}
        onSave={handleSaveProfile}
        initialData={profileData || undefined}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    padding: 15,
    backgroundColor: '#f9f9f9',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  settingContent: {
    flex: 1,
    marginLeft: 15,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  settingDetail: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
  },
  signOutButton: {
    margin: 20,
    padding: 15,
    backgroundColor: '#ff3b30',
    borderRadius: 10,
    alignItems: 'center',
  },
  signOutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  paymentCardsSection: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  paymentCardDetails: {
    marginLeft: 15,
  },
  paymentCardType: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  paymentCardNumber: {
    fontSize: 14,
    color: '#666',
  },
});