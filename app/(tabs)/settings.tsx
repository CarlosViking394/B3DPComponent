import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Bell, CreditCard, CircleHelp as HelpCircle, Lock, Mail, User } from 'lucide-react-native';

export default function SettingsScreen() {
  const settingsSections = [
    {
      title: 'Account',
      items: [
        { icon: <User size={24} color="#666" />, label: 'Profile Information' },
        { icon: <Mail size={24} color="#666" />, label: 'Email Preferences' },
        { icon: <Lock size={24} color="#666" />, label: 'Password & Security' },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: <Bell size={24} color="#666" />, label: 'Notifications' },
        { icon: <CreditCard size={24} color="#666" />, label: 'Payment Methods' },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: <HelpCircle size={24} color="#666" />, label: 'Help Center' },
      ],
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Manage your account and preferences</Text>
      </View>

      {settingsSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.items.map((item, itemIndex) => (
            <TouchableOpacity key={itemIndex} style={styles.settingItem}>
              {item.icon}
              <Text style={styles.settingLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}

      <TouchableOpacity style={styles.signOutButton}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
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
  settingLabel: {
    fontSize: 16,
    marginLeft: 15,
    color: '#333',
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
});