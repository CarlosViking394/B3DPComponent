import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { Slider } from '@rneui/themed';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CostCalculatorProps {
  file: {
    size: number;
    name: string;
  };
  onCostCalculated: (cost: number) => void;
}

interface MaterialCosts {
  [key: string]: {
    price: number;
    color: string;
  };
}

const MATERIALS: MaterialCosts = {
  PLA: { price: 25, color: '#4CAF50' },
  ABS: { price: 30, color: '#2196F3' },
  PETG: { price: 35, color: '#9C27B0' },
  TPU: { price: 45, color: '#FF9800' },
};

export function CostCalculator({ file, onCostCalculated }: CostCalculatorProps) {
  const [thickness, setThickness] = useState(0.2);
  const [material, setMaterial] = useState('PLA');
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    calculateCosts();
  }, [thickness, material, file]);

  const calculateCosts = () => {
    // Basic estimation algorithm
    const volumeEstimate = file.size / 1024; // Rough estimate based on file size
    const materialDensity = 1.24; // g/cm³ (average for PLA)
    const materialVolume = volumeEstimate * thickness;
    const materialWeight = materialVolume * materialDensity / 1000; // Convert to kg
    
    // Calculate print time (rough estimate)
    const printSpeed = 60; // mm/s
    const layerHeight = thickness;
    const estimatedTimeHours = (materialVolume / (printSpeed * layerHeight * 60)) + 0.5; // Add setup time
    
    setEstimatedTime(estimatedTimeHours);

    // Calculate total cost
    const materialCost = MATERIALS[material].price * materialWeight;
    const operatingCost = estimatedTimeHours * 10; // $10 per hour operating cost
    const totalCost = materialCost + operatingCost;

    onCostCalculated(Math.max(totalCost, 5)); // Minimum $5 charge
  };

  const MaterialButton = ({ name }: { name: string }) => (
    <TouchableOpacity
      style={[
        styles.materialButton,
        material === name && { backgroundColor: MATERIALS[name].color },
      ]}
      onPress={() => setMaterial(name)}
      accessible={true}
      accessibilityRole="button">
      <Text
        style={[
          styles.materialButtonText,
          material === name && styles.materialButtonTextSelected,
        ]}>
        {name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[
      styles.container,
      Platform.select({
        ios: {
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 16,
          paddingHorizontal: 16
        },
        android: {
          padding: 16
        },
        default: {
          padding: 20
        }
      })
    ]}>
      <Text style={styles.title}>Print Settings</Text>

      <View style={styles.setting}>
        <Text style={styles.label}>
          Layer Thickness: {thickness.toFixed(1)}mm
        </Text>
        <Slider
          value={sliderValue}
          onValueChange={(val) => {
            setSliderValue(val);
            // Convert slider value to thickness (0-100 to 0.1-1.0)
            const decimalValue = val / 100;
            setThickness(decimalValue + 0.1); // Adjust range to 0.1-1.1mm
          }}
          minimumValue={0}
          maximumValue={100}
          step={1}
          trackStyle={{ height: 5, backgroundColor: 'transparent' }}
          thumbStyle={{ height: 20, width: 20, backgroundColor: '#007AFF' }}
          minimumTrackTintColor="#007AFF"
          maximumTrackTintColor="#000000"
        />
      </View>

      <View style={styles.setting}>
        <Text style={styles.label}>Material</Text>
        <View style={styles.materialOptions}>
          {Object.keys(MATERIALS).map((materialName) => (
            <MaterialButton key={materialName} name={materialName} />
          ))}
        </View>
      </View>

      <View style={styles.estimates}>
        <View style={styles.estimateItem}>
          <Text style={styles.estimateLabel}>Estimated Print Time</Text>
          <Text style={styles.estimateValue}>
            {estimatedTime.toFixed(1)} hours
          </Text>
        </View>
        <View style={styles.estimateItem}>
          <Text style={styles.estimateLabel}>Material Cost</Text>
          <Text style={styles.estimateValue}>
            ${(MATERIALS[material].price).toFixed(2)}/kg
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
    }),
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  setting: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  materialOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  materialButton: {
    flex: 1,
    minWidth: 70,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  materialButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  materialButtonTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  estimates: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  estimateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  estimateLabel: {
    fontSize: 14,
    color: '#666',
  },
  estimateValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});