import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { useTheme } from './ThemeContext';

interface CostCalculatorProps {
  file: {
    size: number;
    name: string;
  };
  onCostCalculated: (cost: number) => void;
  // If you want to allow batch printing logic, pass isBatch={true}
  isBatch?: boolean;
}

interface MaterialCosts {
  [key: string]: {
    price: number;
    color: string;
  };
}

interface OptionalService {
  name: string;
  price: number;
}

interface OptionalServices {
  [key: string]: OptionalService;
}

// Helper: Consider anything not 'PLA' as exotic
function isExotic(material: string) {
  return material !== 'PLA';
}

// Material definitions (you can extend these as needed)
const MATERIALS: MaterialCosts = {
  PLA:  { price: 25, color: '#4CAF50' },
  ABS:  { price: 30, color: '#2196F3' },
  PETG: { price: 35, color: '#9C27B0' },
  TPU:  { price: 45, color: '#FF9800' },
};

// Optional services with hourly rates
const OPTIONAL_SERVICES: OptionalServices = {
  MODELLING: { name: 'Modelling / Design', price: 70 },
  SUPPORT_REMOVAL: { name: 'Support Removal', price: 60 },
  PAINTING: { name: 'Painting', price: 60 },
  CLEANING: { name: 'Cleaning / Sanding', price: 60 },
};

// Fixed printing center coordinates (example: Brisbane)
const PRINT_CENTER_COORDS = {
  latitude: -27.4698,
  longitude: 153.0251,
};

// Helper functions for distance calculation
function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculates the cost based on the tiered pricing logic (or batch mode) and enforces a minimum of $30.
 */
function getTieredPrice(
  estimatedTime: number,
  materialType: string,
  materialWeight: number,
  isBatch: boolean
): number {
  let cost = 0;

  if (isBatch) {
    const hourlyRate = isExotic(materialType) ? 10 : 7;
    const batchCost = hourlyRate * estimatedTime;
    const rawMaterialCost = MATERIALS[materialType].price * materialWeight;
    cost = batchCost + rawMaterialCost;
  } else {
    if (estimatedTime < 1) {
      // Tiny
      cost = isExotic(materialType) ? 15 : 10;
    } else if (estimatedTime < 3) {
      // Small
      cost = isExotic(materialType) ? 45 : 30;
    } else if (estimatedTime < 6) {
      // Medium
      cost = isExotic(materialType) ? 90 : 60;
    } else if (estimatedTime < 10) {
      // Large
      cost = isExotic(materialType) ? 150 : 100;
    } else {
      // Over 10 hours - clamped to Large pricing (or you can opt for batch mode)
      cost = isExotic(materialType) ? 150 : 100;
    }
  }

  // Enforce a minimum price of $30
  return Math.max(cost, 30);
}

export function CostCalculator({ file, onCostCalculated, isBatch = false }: CostCalculatorProps) {
  const { theme } = useTheme();
  const [material, setMaterial] = useState('PLA');
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [eta, setEta] = useState('N/A');
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedServices, setSelectedServices] = useState<{[key: string]: boolean}>({
    MODELLING: false,
    SUPPORT_REMOVAL: false,
    PAINTING: false,
    CLEANING: false,
  });
  const [serviceHours, setServiceHours] = useState<{[key: string]: number}>({
    MODELLING: 1,
    SUPPORT_REMOVAL: 1,
    PAINTING: 1,
    CLEANING: 1,
  });
  // Simulated dimensions for the object (in real app, these would come from the file)
  const [objectDimensions, setObjectDimensions] = useState({
    width: Math.round(Math.random() * 100 + 50), // 50-150mm
    height: Math.round(Math.random() * 100 + 50), // 50-150mm
    depth: Math.round(Math.random() * 100 + 50), // 50-150mm
  });
  const insets = useSafeAreaInsets();
  const thickness = 0.2; // Fixed layer thickness

  // Request and store the user's location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Location permission not granted');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude });
    })();
  }, []);

  // Recalculate costs (and ETA) whenever relevant parameters change
  useEffect(() => {
    calculateCosts();
  }, [material, file, isBatch, userLocation, selectedServices]);

  const calculateCosts = () => {
    // Estimate volume and material weight (basic approximation)
    const volumeEstimate = file.size / 1024; // approximate volume
    const materialDensity = 1.24; // density (e.g., for PLA)
    const materialVolume = volumeEstimate * thickness;
    const materialWeight = (materialVolume * materialDensity) / 1000; // weight in kg

    // Estimate print time (in hours)
    const printSpeed = 60; // mm/s
    const estimatedTimeHours = Math.max(1, materialVolume / (printSpeed * thickness * 60) + 0.7);
    setEstimatedTime(estimatedTimeHours);

    // Calculate tiered cost
    let totalCost = getTieredPrice(estimatedTimeHours, material, materialWeight, isBatch);
    
    // Add costs for selected optional services
    Object.keys(selectedServices).forEach(service => {
      if (selectedServices[service]) {
        totalCost += OPTIONAL_SERVICES[service].price * serviceHours[service];
      }
    });
    
    onCostCalculated(totalCost);

    // Calculate ETA based on user's location
    if (userLocation) {
      const distance = getDistanceFromLatLonInKm(
        userLocation.latitude,
        userLocation.longitude,
        PRINT_CENTER_COORDS.latitude,
        PRINT_CENTER_COORDS.longitude
      );
      // Assume a shipping speed of 50 km per day (this is an example; adjust as needed)
      const shippingDays = Math.ceil(distance / 50);
      // Convert print time from hours to days (using 24 hours per day)
      const printDays = estimatedTimeHours / 24;
      const totalDays = printDays + shippingDays + 1; // Adding 1 extra day
      setEta(`${totalDays.toFixed(1)} days`);
    } else {
      setEta('N/A');
    }
  };

  return (
    <View
      style={[
        styles.container,
        { 
          backgroundColor: theme.card,
          ...theme.cardShadow 
        },
        Platform.select({
          ios: {
            paddingTop: insets.top + 16,
            paddingBottom: insets.bottom + 16,
            paddingHorizontal: 16,
          },
          android: {
            padding: 16,
          },
          default: {
            padding: 20,
          },
        }),
      ]}
    >
      <Text style={[styles.title, { color: theme.text }]}>Print Settings</Text>
      
      {/* Object Features Section */}
      <Text style={[styles.subTitle, { color: theme.secondaryText }]}>Object Features</Text>
      <View style={[styles.objectFeatures, { backgroundColor: theme.cardAlt }]}>
        <View style={styles.featureItem}>
          <Text style={[styles.featureLabel, { color: theme.secondaryText }]}>File Name</Text>
          <Text style={[styles.featureValue, { color: theme.text }]}>{file.name}</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={[styles.featureLabel, { color: theme.secondaryText }]}>File Size</Text>
          <Text style={[styles.featureValue, { color: theme.text }]}>{(file.size / 1024 / 1024).toFixed(2)} MB</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={[styles.featureLabel, { color: theme.secondaryText }]}>Dimensions</Text>
          <Text style={[styles.featureValue, { color: theme.text }]}>
            {objectDimensions.width} × {objectDimensions.height} × {objectDimensions.depth} mm
          </Text>
        </View>
      </View>

      {/* Material Selection */}
      <View style={styles.setting}>
        <Text style={[styles.label, { color: theme.secondaryText }]}>Material</Text>
        <View style={styles.materialOptions}>
          {Object.keys(MATERIALS).map((matName) => (
            <TouchableOpacity
              key={matName}
              style={[
                styles.materialButton,
                { backgroundColor: theme.inputBackground },
                material === matName && {
                  backgroundColor: MATERIALS[matName].color,
                },
              ]}
              onPress={() => setMaterial(matName)}
            >
              <Text
                style={[
                  styles.materialButtonText,
                  { color: theme.text },
                  material === matName && styles.materialButtonTextSelected,
                ]}
              >
                {matName}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Optional Services */}
      <View style={styles.setting}>
        <Text style={[styles.label, { color: theme.secondaryText }]}>Optional Services</Text>
        {Object.keys(OPTIONAL_SERVICES).map((serviceKey) => (
          <View key={serviceKey} style={styles.serviceRow}>
            <TouchableOpacity
              style={[
                styles.checkbox,
                { borderColor: theme.border },
                selectedServices[serviceKey] && { 
                  backgroundColor: theme.accent,
                  borderColor: theme.accent 
                },
              ]}
              onPress={() => {
                setSelectedServices({
                  ...selectedServices,
                  [serviceKey]: !selectedServices[serviceKey],
                });
                calculateCosts();
              }}
            >
              {selectedServices[serviceKey] && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
            <Text style={[styles.serviceText, { color: theme.text }]}>
              {OPTIONAL_SERVICES[serviceKey].name} = ${OPTIONAL_SERVICES[serviceKey].price} per hour
            </Text>
          </View>
        ))}
      </View>

      {/* Display Estimated Print Time, ETA, and Material Cost */}
      <View style={[styles.estimates, { backgroundColor: theme.cardAlt }]}>
        <View style={styles.estimateItem}>
          <Text style={[styles.estimateLabel, { color: theme.secondaryText }]}>Estimated Print Time</Text>
          <Text style={[styles.estimateValue, { color: theme.text }]}>
            {estimatedTime.toFixed(1)} hours
          </Text>
        </View>
        <View style={styles.estimateItem}>
          <Text style={[styles.estimateLabel, { color: theme.secondaryText }]}>Estimated Arrival</Text>
          <Text style={[styles.estimateValue, { color: theme.text }]}>{eta}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  setting: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
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
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  materialButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  materialButtonTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  estimates: {
    marginTop: 16,
    padding: 12,
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
  },
  estimateValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkmark: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  serviceText: {
    fontSize: 14,
  },
  objectFeatures: {
    padding: 12,
    borderRadius: 8,
  },
  featureItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureLabel: {
    fontSize: 14,
  },
  featureValue: {
    fontSize: 14,
    fontWeight: '600',
  },
});
