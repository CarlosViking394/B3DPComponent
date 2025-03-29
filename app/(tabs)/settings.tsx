import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Bell, CreditCard, CircleHelp as HelpCircle, Lock, Mail, User } from 'lucide-react-native';
import { PaymentMethodModal } from '../../components/PaymentMethodModal';

export default function SettingsScreen() {
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [savedPaymentMethods, setSavedPaymentMethods] = useState<Array<{id: string, last4: string, brand: string}>>([]);

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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Manage your account and preferences</Text>
      </View>

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <TouchableOpacity style={styles.settingItem}>
          <User size={24} color="#666" />
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Profile Information</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <Mail size={24} color="#666" />
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Email Preferences</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <Lock size={24} color="#666" />
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Password & Security</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Preferences Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <TouchableOpacity style={styles.settingItem}>
          <Bell size={24} color="#666" />
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Notifications</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={handlePaymentMethodPress}
        >
          <CreditCard size={24} color="#666" />
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Payment Methods</Text>
            {savedPaymentMethods.length > 0 && (
              <Text style={styles.settingDetail}>
                {savedPaymentMethods.length} {savedPaymentMethods.length === 1 ? 'card' : 'cards'} saved
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* Support Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        
        <TouchableOpacity style={styles.settingItem}>
          <HelpCircle size={24} color="#666" />
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Help Center</Text>
          </View>
        </TouchableOpacity>
      </View>

      {savedPaymentMethods.length > 0 && (
        <View style={styles.paymentCardsSection}>
          <Text style={styles.sectionTitle}>Saved Payment Methods</Text>
          {savedPaymentMethods.map((method) => (
            <View key={method.id} style={styles.paymentCard}>
              <CreditCard size={24} color="#333" />
              <View style={styles.paymentCardDetails}>
                <Text style={styles.paymentCardType}>{method.brand}</Text>
                <Text style={styles.paymentCardNumber}>•••• {method.last4}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.signOutButton}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      <PaymentMethodModal
        visible={paymentModalVisible}
        onClose={() => setPaymentModalVisible(false)}
        onSave={handleSavePayment}
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