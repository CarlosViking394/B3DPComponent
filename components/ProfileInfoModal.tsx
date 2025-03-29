import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, ScrollView, Platform, Switch } from 'react-native';
import { X, Save } from 'lucide-react-native';
import { useTheme } from './ThemeContext';

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
  const { theme } = useTheme();
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
      <View style={[styles.centeredView, { backgroundColor: theme.modalBackground }]}>
        <View style={[styles.modalView, { backgroundColor: theme.card }]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Profile Information</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={theme.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.formContainer}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Personal Information</Text>
            
            <Text style={[styles.inputLabel, { color: theme.secondaryText }]}>Full Name</Text>
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: theme.inputBackground, 
                  borderColor: errors.fullName ? theme.error : theme.border,
                  color: theme.text,
                }
              ]}
              value={profileData.fullName}
              onChangeText={(text) => handleInputChange('fullName', text)}
              placeholder="John Doe"
              placeholderTextColor={theme.secondaryText}
            />
            {errors.fullName && <Text style={[styles.errorText, { color: theme.error }]}>{errors.fullName}</Text>}
            
            <Text style={[styles.inputLabel, { color: theme.secondaryText }]}>Email</Text>
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: theme.inputBackground, 
                  borderColor: errors.email ? theme.error : theme.border,
                  color: theme.text,
                }
              ]}
              value={profileData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              placeholder="john.doe@example.com"
              placeholderTextColor={theme.secondaryText}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && <Text style={[styles.errorText, { color: theme.error }]}>{errors.email}</Text>}
            
            <Text style={[styles.inputLabel, { color: theme.secondaryText }]}>Phone (optional)</Text>
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: theme.inputBackground, 
                  borderColor: theme.border,
                  color: theme.text,
                }
              ]}
              value={profileData.phone}
              onChangeText={(text) => handleInputChange('phone', text)}
              placeholder="+1 (555) 123-4567"
              placeholderTextColor={theme.secondaryText}
              keyboardType="phone-pad"
            />
            
            <Text style={[styles.inputLabel, { color: theme.secondaryText }]}>Address</Text>
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: theme.inputBackground, 
                  borderColor: errors.address ? theme.error : theme.border,
                  color: theme.text,
                }
              ]}
              value={profileData.address}
              onChangeText={(text) => handleInputChange('address', text)}
              placeholder="123 Main St, Brisbane QLD 4000"
              placeholderTextColor={theme.secondaryText}
              multiline
            />
            {errors.address && <Text style={[styles.errorText, { color: theme.error }]}>{errors.address}</Text>}
            
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Email Preferences</Text>
            
            <View style={[styles.preferenceItem, { borderBottomColor: theme.border }]}>
              <View style={styles.preferenceTextContainer}>
                <Text style={[styles.preferenceName, { color: theme.text }]}>Order Updates</Text>
                <Text style={[styles.preferenceDescription, { color: theme.secondaryText }]}>Get notified about your 3D printing orders</Text>
              </View>
              <Switch
                value={profileData.emailPreferences.orderUpdates}
                onValueChange={(value) => handleEmailPrefChange('orderUpdates', value)}
                trackColor={{ false: '#767577', true: theme.accent }}
                thumbColor="#fff"
              />
            </View>
            
            <View style={[styles.preferenceItem, { borderBottomColor: theme.border }]}>
              <View style={styles.preferenceTextContainer}>
                <Text style={[styles.preferenceName, { color: theme.text }]}>Promotional Emails</Text>
                <Text style={[styles.preferenceDescription, { color: theme.secondaryText }]}>Receive special offers and discounts</Text>
              </View>
              <Switch
                value={profileData.emailPreferences.promotions}
                onValueChange={(value) => handleEmailPrefChange('promotions', value)}
                trackColor={{ false: '#767577', true: theme.accent }}
                thumbColor="#fff"
              />
            </View>
            
            <View style={[styles.preferenceItem, { borderBottomColor: theme.border }]}>
              <View style={styles.preferenceTextContainer}>
                <Text style={[styles.preferenceName, { color: theme.text }]}>Newsletter</Text>
                <Text style={[styles.preferenceDescription, { color: theme.secondaryText }]}>Monthly updates and community news</Text>
              </View>
              <Switch
                value={profileData.emailPreferences.newsletter}
                onValueChange={(value) => handleEmailPrefChange('newsletter', value)}
                trackColor={{ false: '#767577', true: theme.accent }}
                thumbColor="#fff"
              />
            </View>
            
            <View style={[styles.preferenceItem, { borderBottomColor: theme.border }]}>
              <View style={styles.preferenceTextContainer}>
                <Text style={[styles.preferenceName, { color: theme.text }]}>3D Printing Tips</Text>
                <Text style={[styles.preferenceDescription, { color: theme.secondaryText }]}>Tips to improve your 3D printing</Text>
              </View>
              <Switch
                value={profileData.emailPreferences.printingTips}
                onValueChange={(value) => handleEmailPrefChange('printingTips', value)}
                trackColor={{ false: '#767577', true: theme.accent }}
                thumbColor="#fff"
              />
            </View>
          </ScrollView>
          
          <TouchableOpacity style={[styles.saveButton, { backgroundColor: theme.accent }]} onPress={handleSave}>
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