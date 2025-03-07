import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Property {
  name: string;
  value: string;
}

interface MaterialInfoCardProps {
  title: string;
  color: string;
  properties: Property[];
}

export function MaterialInfoCard({ title, color, properties }: MaterialInfoCardProps) {
  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <Text style={styles.cardTitle}>{title}</Text>
      
      {properties.map((prop, index) => (
        <View key={index} style={styles.propertyRow}>
          <Text style={styles.propertyName}>{prop.name}</Text>
          <Text style={styles.propertyValue}>{prop.value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  propertyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  propertyName: {
    fontSize: 14,
    color: '#666',
  },
  propertyValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
});