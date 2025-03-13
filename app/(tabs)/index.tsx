import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Printer, Clock, Palette, Award } from 'lucide-react-native';

export default function HomeScreen() {
  const router = useRouter();

  const handleMaterialPress = (materialType: string) => {
    router.push({
      pathname: "/materialDetails",
      params: { material: materialType }
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.hero}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1631733158067-8aa489c4d0e5?auto=format&fit=crop&q=80&w=2000' }}
          style={styles.heroImage}
        />
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>3D Printing Made Simple</Text>
          <Text style={styles.heroSubtitle}>Upload, Customize, Print</Text>
          <Link href="/upload" asChild>
            <TouchableOpacity style={styles.heroButton}>
              <Text style={styles.heroButtonText}>Start Printing</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      <View style={styles.features}>
        <Text style={styles.sectionTitle}>Why Choose Us?</Text>
        <View style={styles.featureGrid}>
          <View style={styles.featureCard}>
            <Printer size={32} color="#007AFF" />
            <Text style={styles.featureTitle}>High Quality</Text>
            <Text style={styles.featureText}>Professional grade 3D printing with premium materials</Text>
          </View>
          <View style={styles.featureCard}>
            <Clock size={32} color="#007AFF" />
            <Text style={styles.featureTitle}>Fast Turnaround</Text>
            <Text style={styles.featureText}>Quick printing and delivery of your models</Text>
          </View>
          <View style={styles.featureCard}>
            <Palette size={32} color="#007AFF" />
            <Text style={styles.featureTitle}>Custom Colors</Text>
            <Text style={styles.featureText}>Wide range of colors and materials to choose from</Text>
          </View>
          <View style={styles.featureCard}>
            <Award size={32} color="#007AFF" />
            <Text style={styles.featureTitle}>Guaranteed</Text>
            <Text style={styles.featureText}>100% satisfaction guarantee on all prints</Text>
          </View>
        </View>
      </View>

      <View style={styles.materials}>
        <Text style={styles.sectionTitle}>Available Materials</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.materialScroll}>
          {[
            {
              name: 'PLA',
              image: 'https://images.unsplash.com/photo-1579403124614-197f69d8187b?auto=format&fit=crop&q=80&w=500',
              price: '25/kg'
            },
            {
              name: 'ABS',
              image: 'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?auto=format&fit=crop&q=80&w=500',
              price: '30/kg'
            },
            {
              name: 'PETG',
              image: 'https://images.unsplash.com/photo-1570283626316-b0971129b635?auto=format&fit=crop&q=80&w=500',
              price: '35/kg'
            },
            {
              name: 'TPU',
              image: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=500',
              price: '45/kg'
            }
          ].map((material, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleMaterialPress(material.name)}
              style={styles.materialCard}
            >
              <Image source={{ uri: material.image }} style={styles.materialImage} />
              <Text style={styles.materialName}>{material.name}</Text>
              <Text style={styles.materialPrice}>${material.price}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.cta}>
        <Text style={styles.ctaTitle}>Ready to Print?</Text>
        <Text style={styles.ctaText}>Upload your 3D model and get an instant quote</Text>
        <Link href="/upload" asChild>
          <TouchableOpacity style={styles.ctaButton}>
            <Text style={styles.ctaButtonText}>Upload Now</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  hero: {
    height: 400,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  heroContent: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  heroButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  heroButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  features: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -10,
  },
  featureCard: {
    width: '50%',
    padding: 10,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 5,
    color: '#333',
  },
  featureText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  materials: {
    padding: 20,
  },
  materialScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  materialCard: {
    width: 200,
    marginRight: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  materialImage: {
    width: '100%',
    height: 150,
  },
  materialName: {
    fontSize: 18,
    fontWeight: '600',
    padding: 10,
    color: '#333',
  },
  materialPrice: {
    fontSize: 16,
    color: '#007AFF',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  cta: {
    margin: 20,
    padding: 30,
    backgroundColor: '#007AFF',
    borderRadius: 15,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  ctaText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  ctaButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  ctaButtonText: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: '600',
  },
});