import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ImageBackground, Platform } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Printer, Clock, Palette, Award, Upload, ArrowRight } from 'lucide-react-native';
import { useTheme } from '../../components/ThemeContext';

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  const handleMaterialPress = (materialType: string) => {
    router.push({
      pathname: "/materialDetails",
      params: { material: materialType }
    });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.hero}>
        <Image 
          source={require('../../assets/images/printing.webp')}
          style={styles.heroImage}
        />
        <View style={[styles.heroOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={styles.heroContent}>
            <Text style={[styles.heroTitle, { color: theme.text }]}>3D Printing Made Simple</Text>
            <Text style={[styles.heroSubtitle, { color: theme.text }]}>Upload, Customize, Print</Text>
            <Link href="/upload" asChild>
              <TouchableOpacity 
                activeOpacity={0.8}
                style={styles.buttonWrapper}
              >
                <View style={styles.glassButtonContainer}>
                  <View style={styles.glassButton}>
                    <View style={styles.glassInner}>
                      <View style={styles.glassHighlight} />
                      <Text style={[styles.heroButtonText, { color: theme.text }]}>Start Printing</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>

      <View style={styles.features}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Why Choose Us?</Text>
        <View style={styles.featureGrid}>
          <View style={[styles.featureCard, { backgroundColor: theme.card, ...theme.cardShadow }]}>
            <View style={[styles.featureIconContainer, { backgroundColor: theme.accentLight }]}>
              <Printer size={32} color={theme.accent} />
            </View>
            <Text style={[styles.featureTitle, { color: theme.text }]}>High Quality</Text>
            <Text style={[styles.featureText, { color: theme.secondaryText }]}>Professional grade 3D printing with premium materials</Text>
          </View>
          <View style={[styles.featureCard, { backgroundColor: theme.card, ...theme.cardShadow }]}>
            <View style={[styles.featureIconContainer, { backgroundColor: theme.accentLight }]}>
              <Clock size={32} color={theme.accent} />
            </View>
            <Text style={[styles.featureTitle, { color: theme.text }]}>Fast Turnaround</Text>
            <Text style={[styles.featureText, { color: theme.secondaryText }]}>Quick printing and delivery of your models</Text>
          </View>
          <View style={[styles.featureCard, { backgroundColor: theme.card, ...theme.cardShadow }]}>
            <View style={[styles.featureIconContainer, { backgroundColor: theme.accentLight }]}>
              <Palette size={32} color={theme.accent} />
            </View>
            <Text style={[styles.featureTitle, { color: theme.text }]}>Custom Colors</Text>
            <Text style={[styles.featureText, { color: theme.secondaryText }]}>Wide range of colors and materials to choose from</Text>
          </View>
          <View style={[styles.featureCard, { backgroundColor: theme.card, ...theme.cardShadow }]}>
            <View style={[styles.featureIconContainer, { backgroundColor: theme.accentLight }]}>
              <Award size={32} color={theme.accent} />
            </View>
            <Text style={[styles.featureTitle, { color: theme.text }]}>Guaranteed</Text>
            <Text style={[styles.featureText, { color: theme.secondaryText }]}>100% satisfaction guarantee on all prints</Text>
          </View>
        </View>
      </View>

      <View style={styles.materials}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Available Materials</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.materialScroll}
          contentContainerStyle={styles.materialScrollContent}
        >
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
              style={[styles.materialCard, { backgroundColor: theme.card, ...theme.cardShadow }]}
              activeOpacity={0.8}
            >
              <Image source={{ uri: material.image }} style={styles.materialImage} />
              <View style={styles.materialInfo}>
                <Text style={[styles.materialName, { color: theme.text }]}>{material.name}</Text>
                <Text style={[styles.materialPrice, { color: theme.accent }]}>${material.price}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={[styles.cta, { backgroundColor: theme.accent }]}>
        <Text style={[styles.ctaTitle, { color: theme.text }]}>Ready to Print?</Text>
        <Text style={[styles.ctaText, { color: theme.text }]}>Upload your 3D model and get an instant quote</Text>
        <Link href="/upload" asChild>
          <TouchableOpacity activeOpacity={0.7}>
            <View style={[styles.ctaWhiteButton, { 
              backgroundColor: theme.card,
              shadowColor: theme.accent,
              borderColor: theme.border
            }]}>
              <Text style={[styles.ctaWhiteButtonText, { color: theme.accent }]}>Let's Go</Text>
              <ArrowRight size={18} color={theme.accent} style={styles.ctaButtonArrow} />
            </View>
          </TouchableOpacity>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hero: {
    height: 400,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    resizeMode: 'cover',
  },
  heroOverlay: {
    position: 'absolute',
    width: '100%', 
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContent: {
    width: '100%',
    padding: 25,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  buttonWrapper: {
    transform: [{ scale: 1.0 }],
  },
  glassButtonContainer: {
    marginTop: 12,
    transform: [{ perspective: 1000 }],
    position: 'relative',
  },
  glassButton: {
    paddingHorizontal: 22,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 140,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(10px) saturate(160%) contrast(110%)',
      },
    }),
    shadowColor: 'rgba(255, 255, 255, 0.5)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
    position: 'relative',
  },
  glassInner: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  glassHighlight: {
    position: 'absolute',
    top: -12,
    left: -12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    transform: [{ rotate: '45deg' }],
  },
  heroButtonText: {
    fontSize: 14,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    letterSpacing: 0.5,
  },
  features: {
    padding: 20,
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: -8,
  },
  featureCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  featureIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 8,
    textAlign: 'center',
  },
  featureText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  materials: {
    padding: 20,
    marginVertical: 10,
  },
  materialScroll: {
    marginHorizontal: -20,
  },
  materialScrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  materialCard: {
    width: 220,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 8,
  },
  materialImage: {
    width: '100%',
    height: 160,
  },
  materialInfo: {
    padding: 12,
  },
  materialName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  materialPrice: {
    fontSize: 16,
    fontWeight: '500',
  },
  cta: {
    margin: 20,
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ctaText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  ctaWhiteButton: {
    paddingHorizontal: 30,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 6,
    shadowColor: '#0088FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    minWidth: 160,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.9)',
    transform: [{ translateY: 0 }],
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  ctaButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaButtonIcon: {
    marginRight: 8,
  },
  ctaButtonText: {
    fontSize: 22,
    fontWeight: '700',
  },
  ctaWhiteButtonText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginRight: 6,
  },
  ctaButtonArrow: {
    marginLeft: 2,
  },
  ctaButton: {
    paddingHorizontal: 32,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 6,
    shadowColor: 'rgba(0, 136, 255, 0.5)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    minWidth: 200,
    borderWidth: 2,
    transform: [{ translateY: 0 }],
  },
});