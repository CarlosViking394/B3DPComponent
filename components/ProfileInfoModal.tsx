import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, ScrollView, Platform, Switch } from 'react-native';
import { X, Save } from 'lucide-react-native';

interface ProfileInfoModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (profileData: ProfileData) => void;
  initialData?: ProfileData;
}

export interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  emailPreferences: {
    orderUpdates: boolean;
    promotions: boolean;
    newsletter: boolean;
    printingTips: boolean;
  };
}

const DEFAULT_PROFILE_DATA: ProfileData = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  emailPreferences: {
    orderUpdates: true,
    promotions: false,
    newsletter: false,
    printingTips: true,
  }
};

export function ProfileInfoModal({ visible, onClose, onSave, initialData }: ProfileInfoModalProps) {
  const [profileData, setProfileData] = useState<ProfileData>(initialData || DEFAULT_PROFILE_DATA);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEmailPrefChange = (field: keyof ProfileData['emailPreferences'], value: boolean) => {
    setProfileData(prev => ({
      ...prev,
      emailPreferences: {
        ...prev.emailPreferences,
        [field]: value,
      }
    }));
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    // Name validation
    if (!profileData.fullName) {
      newErrors.fullName = 'Full name is required';
    }
    
    // Email validation
    if (!profileData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    // Address validation - required
    if (!profileData.address) {
      newErrors.address = 'Address is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(profileData);
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
            <Text style={styles.modalTitle}>Profile Information</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={[styles.input, errors.fullName ? styles.inputError : null]}
              value={profileData.fullName}
              onChangeText={(text) => handleInputChange('fullName', text)}
              placeholder="John Doe"
            />
            {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
            
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={[styles.input, errors.email ? styles.inputError : null]}
              value={profileData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              placeholder="john.doe@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            
            <Text style={styles.inputLabel}>Phone (optional)</Text>
            <TextInput
              style={styles.input}
              value={profileData.phone}
              onChangeText={(text) => handleInputChange('phone', text)}
              placeholder="+1 (555) 123-4567"
              keyboardType="phone-pad"
            />
            
            <Text style={styles.inputLabel}>Address</Text>
            <TextInput
              style={[styles.input, errors.address ? styles.inputError : null]}
              value={profileData.address}
              onChangeText={(text) => handleInputChange('address', text)}
              placeholder="123 Main St, Brisbane QLD 4000"
              multiline
            />
            {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
            
            <Text style={styles.sectionTitle}>Email Preferences</Text>
            
            <View style={styles.preferenceItem}>
              <View style={styles.preferenceTextContainer}>
                <Text style={styles.preferenceName}>Order Updates</Text>
                <Text style={styles.preferenceDescription}>Get notified about your 3D printing orders</Text>
              </View>
              <Switch
                value={profileData.emailPreferences.orderUpdates}
                onValueChange={(value) => handleEmailPrefChange('orderUpdates', value)}
                trackColor={{ false: '#ddd', true: '#4CAF50' }}
                thumbColor="#fff"
              />
            </View>
            
            <View style={styles.preferenceItem}>
              <View style={styles.preferenceTextContainer}>
                <Text style={styles.preferenceName}>Promotional Emails</Text>
                <Text style={styles.preferenceDescription}>Receive special offers and discounts</Text>
              </View>
              <Switch
                value={profileData.emailPreferences.promotions}
                onValueChange={(value) => handleEmailPrefChange('promotions', value)}
                trackColor={{ false: '#ddd', true: '#4CAF50' }}
                thumbColor="#fff"
              />
            </View>
            
            <View style={styles.preferenceItem}>
              <View style={styles.preferenceTextContainer}>
                <Text style={styles.preferenceName}>Newsletter</Text>
                <Text style={styles.preferenceDescription}>Monthly updates and community news</Text>
              </View>
              <Switch
                value={profileData.emailPreferences.newsletter}
                onValueChange={(value) => handleEmailPrefChange('newsletter', value)}
                trackColor={{ false: '#ddd', true: '#4CAF50' }}
                thumbColor="#fff"
              />
            </View>
            
            <View style={styles.preferenceItem}>
              <View style={styles.preferenceTextContainer}>
                <Text style={styles.preferenceName}>3D Printing Tips</Text>
                <Text style={styles.preferenceDescription}>Tips to improve your 3D printing</Text>
              </View>
              <Switch
                value={profileData.emailPreferences.printingTips}
                onValueChange={(value) => handleEmailPrefChange('printingTips', value)}
                trackColor={{ false: '#ddd', true: '#4CAF50' }}
                thumbColor="#fff"
              />
            </View>
          </ScrollView>
          
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Save size={20} color="#fff" style={styles.saveIcon} />
            <Text style={styles.saveButtonText}>Save Profile</Text>
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 10,
    marginBottom: 15,
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
    marginBottom: 10,
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
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  preferenceTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  preferenceName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  preferenceDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    margin: 20,
    borderRadius: 10,
  },
  saveIcon: {
    marginRight: 8,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 