import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, ScrollView, Platform } from 'react-native';
import { CreditCard, X } from 'lucide-react-native';

interface PaymentMethodModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (paymentDetails: PaymentDetails) => void;
}

interface PaymentDetails {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
  billingAddress: string;
  city: string;
  postalCode: string;
  country: string;
}

export function PaymentMethodModal({ visible, onClose, onSave }: PaymentMethodModalProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  
  // Form validation
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const chunks = [];
    
    for (let i = 0; i < cleaned.length; i += 4) {
      chunks.push(cleaned.substring(i, i + 4));
    }
    
    return chunks.join(' ').substring(0, 19); // Limit to 16 digits + 3 spaces
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (cleaned.length > 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    // Card number validation
    if (!cardNumber) {
      newErrors.cardNumber = 'Card number is required';
    } else if (cardNumber.replace(/\s+/g, '').length < 16) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }
    
    // Name validation
    if (!cardName) {
      newErrors.cardName = 'Name on card is required';
    }
    
    // Expiry validation
    if (!expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!expiryDate.includes('/') || expiryDate.length < 5) {
      newErrors.expiryDate = 'Enter a valid expiry date (MM/YY)';
    }
    
    // CVV validation
    if (!cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (cvv.length < 3) {
      newErrors.cvv = 'CVV must be 3-4 digits';
    }
    
    // Address validation
    if (!billingAddress) {
      newErrors.billingAddress = 'Billing address is required';
    }
    
    // City validation
    if (!city) {
      newErrors.city = 'City is required';
    }
    
    // Postal code validation
    if (!postalCode) {
      newErrors.postalCode = 'Postal code is required';
    }
    
    // Country validation
    if (!country) {
      newErrors.country = 'Country is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({
        cardNumber,
        cardName,
        expiryDate,
        cvv,
        billingAddress,
        city,
        postalCode,
        country
      });
      
      // Clear form after saving
      setCardNumber('');
      setCardName('');
      setExpiryDate('');
      setCvv('');
      setBillingAddress('');
      setCity('');
      setPostalCode('');
      setCountry('');
      setErrors({});
      
      onClose();
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Payment Method</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.formContainer}>
            <View style={styles.cardSection}>
              <CreditCard size={32} color="#666" style={styles.cardIcon} />
              <Text style={styles.sectionTitle}>Card Details</Text>
            </View>
            
            <Text style={styles.inputLabel}>Card Number</Text>
            <TextInput
              style={[styles.input, errors.cardNumber ? styles.inputError : null]}
              value={cardNumber}
              onChangeText={(text) => setCardNumber(formatCardNumber(text))}
              placeholder="1234 5678 9012 3456"
              keyboardType="numeric"
              maxLength={19}
            />
            {errors.cardNumber && <Text style={styles.errorText}>{errors.cardNumber}</Text>}
            
            <Text style={styles.inputLabel}>Name on Card</Text>
            <TextInput
              style={[styles.input, errors.cardName ? styles.inputError : null]}
              value={cardName}
              onChangeText={setCardName}
              placeholder="John Doe"
            />
            {errors.cardName && <Text style={styles.errorText}>{errors.cardName}</Text>}
            
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.inputLabel}>Expiry Date</Text>
                <TextInput
                  style={[styles.input, errors.expiryDate ? styles.inputError : null]}
                  value={expiryDate}
                  onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                  placeholder="MM/YY"
                  keyboardType="numeric"
                  maxLength={5}
                />
                {errors.expiryDate && <Text style={styles.errorText}>{errors.expiryDate}</Text>}
              </View>
              
              <View style={styles.halfInput}>
                <Text style={styles.inputLabel}>CVV</Text>
                <TextInput
                  style={[styles.input, errors.cvv ? styles.inputError : null]}
                  value={cvv}
                  onChangeText={setCvv}
                  placeholder="123"
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                />
                {errors.cvv && <Text style={styles.errorText}>{errors.cvv}</Text>}
              </View>
            </View>
            
            <Text style={styles.sectionTitle}>Billing Address</Text>
            
            <Text style={styles.inputLabel}>Street Address</Text>
            <TextInput
              style={[styles.input, errors.billingAddress ? styles.inputError : null]}
              value={billingAddress}
              onChangeText={setBillingAddress}
              placeholder="123 Main St"
            />
            {errors.billingAddress && <Text style={styles.errorText}>{errors.billingAddress}</Text>}
            
            <Text style={styles.inputLabel}>City</Text>
            <TextInput
              style={[styles.input, errors.city ? styles.inputError : null]}
              value={city}
              onChangeText={setCity}
              placeholder="Brisbane"
            />
            {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
            
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.inputLabel}>Postal Code</Text>
                <TextInput
                  style={[styles.input, errors.postalCode ? styles.inputError : null]}
                  value={postalCode}
                  onChangeText={setPostalCode}
                  placeholder="4000"
                />
                {errors.postalCode && <Text style={styles.errorText}>{errors.postalCode}</Text>}
              </View>
              
              <View style={styles.halfInput}>
                <Text style={styles.inputLabel}>Country</Text>
                <TextInput
                  style={[styles.input, errors.country ? styles.inputError : null]}
                  value={country}
                  onChangeText={setCountry}
                  placeholder="Australia"
                />
                {errors.country && <Text style={styles.errorText}>{errors.country}</Text>}
              </View>
            </View>
          </ScrollView>
          
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Payment Method</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    maxHeight: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  formContainer: {
    padding: 20,
  },
  cardSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardIcon: {
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 15,
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 8,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#ff3b30',
    backgroundColor: '#fff8f8',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 12,
    marginBottom: 10,
    marginTop: -5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 