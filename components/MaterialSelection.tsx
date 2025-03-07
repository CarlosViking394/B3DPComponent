import { useRouter } from 'expo-router';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Card } from '@rneui/base';

export default function MaterialSelection() {
  const router = useRouter();

  const handleMaterialPress = (materialType: string) => {
    router.push({
      pathname: "/materialDetails",
      params: { material: materialType }
    });
  };

  return (
    <View style={styles.container}>
      {materials.map((material, index) => (
        <TouchableOpacity
          key={index}
          style={styles.materialCard}
          onPress={() => handleMaterialPress(material.type)}
        >
          <Card>
            <Card.Title>{material.type}</Card.Title>
            <Card.Divider />
            <View>
              <Text>Price per gram: ${material.pricePerGram}</Text>
              <Text>Density: {material.density} g/cm³</Text>
            </View>
          </Card>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  materialCard: {
    marginBottom: 10,
  },
  // ... your other styles
}); 