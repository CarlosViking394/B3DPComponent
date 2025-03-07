import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { MaterialInfoCard } from './MaterialInfoCard';
import { getMaterialDescription } from '../data/materialDescriptions';
import { getMaterialResonanceData } from '../data/materialResonanceData';

interface MaterialDetailsProps {
  materialType: string;
}

export function MaterialDetails({ materialType }: MaterialDetailsProps) {
  const materialDescription = getMaterialDescription(materialType);
  const resonanceData = getMaterialResonanceData(materialType);
  
  const materialImages: Record<string, string> = {
    'PLA': 'https://images.unsplash.com/photo-1579403124614-197f69d8187b?auto=format&fit=crop&q=80&w=500',
    'ABS': 'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?auto=format&fit=crop&q=80&w=500',
    'PETG': 'https://images.unsplash.com/photo-1570283626316-b0971129b635?auto=format&fit=crop&q=80&w=500',
    'TPU': 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=500',
  };

  const materialColors: Record<string, string> = {
    'PLA': '#4CAF50',
    'ABS': '#2196F3',
    'PETG': '#9C27B0',
    'TPU': '#FF9800',
  };

  return (
    <ScrollView style={styles.container}>
      <Image 
        source={{ uri: materialImages[materialType] || materialImages['PLA'] }} 
        style={styles.materialImage} 
      />
      
      <View style={styles.content}>
        <Text style={styles.title}>{materialType}</Text>
        
        <Text style={styles.description}>
          {materialDescription || 'No description available for this material.'}
        </Text>
        
        <MaterialInfoCard 
          title="Properties"
          color={materialColors[materialType] || '#007AFF'}
          properties={[
            { name: 'Strength', value: resonanceData?.strength || 'Medium' },
            { name: 'Flexibility', value: resonanceData?.flexibility || 'Low' },
            { name: 'Heat Resistance', value: resonanceData?.heatResistance || 'Medium' },
            { name: 'Print Difficulty', value: resonanceData?.printDifficulty || 'Easy' },
          ]}
        />
        
        <MaterialInfoCard 
          title="Recommended Settings"
          color={materialColors[materialType] || '#007AFF'}
          properties={[
            { name: 'Nozzle Temp', value: resonanceData?.nozzleTemp || '200-220°C' },
            { name: 'Bed Temp', value: resonanceData?.bedTemp || '60°C' },
            { name: 'Print Speed', value: resonanceData?.printSpeed || '50-60mm/s' },
            { name: 'Layer Height', value: resonanceData?.layerHeight || '0.1-0.3mm' },
          ]}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  materialImage: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    marginBottom: 20,
  },
}); 