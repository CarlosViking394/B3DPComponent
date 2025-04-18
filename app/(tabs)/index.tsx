import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ImageBackground, Platform } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Printer, Clock, Palette, Award, Upload, ArrowRight } from 'lucide-react-native';
import { useTheme } from '../../components/ThemeContext';
import { SafeTouchableOpacity } from '../../components/SafeTouchableOpacity';

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  const handleMaterialPress = (materialType: string) => {
    router.push({
      pathname: "/materialDetails",
      params: { material: materialType }
    });
  };

  // Function that creates a touchable element with type assertions to avoid TypeScript errors
  const createTouchable = (props: any) => {
    return React.createElement(TouchableOpacity as any, props);
  };

  // Materials data
  const materials = [
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
  ];

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
            <Link href="/(tabs)/upload" asChild>
              {createTouchable({
                activeOpacity: 0.8,
                style: styles.buttonWrapper,
                children: (
                  <View style={[styles.glassButton, { 
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  }]}>
                    <Text style={[styles.heroButtonText, { color: theme.text }]}>Start Printing</Text>
                  </View>
                )
              })}
            </Link>
          </View>
        </View>
      </View>

      <View style={styles.features}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Why Choose Us?</Text>
        <View style={styles.featureGrid}>
          {[
            {
              icon: <Printer size={32} color={theme.accent} />,
              title: "High Quality",
              description: "Professional grade 3D printing with premium materials"
            },
            {
              icon: <Clock size={32} color={theme.accent} />,
              title: "Fast Turnaround",
              description: "Quick printing and delivery of your models"
            },
            {
              icon: <Palette size={32} color={theme.accent} />,
              title: "Custom Colors",
              description: "Wide range of colors and materials to choose from"
            },
            {
              icon: <Award size={32} color={theme.accent} />,
              title: "Guaranteed",
              description: "100% satisfaction guarantee on all prints"
            }
          ].map((feature, index) => (
            <View 
              key={index} 
              style={[
                styles.featureCard, 
                { backgroundColor: theme.card, ...theme.cardShadow }
              ]}
            >
              <View style={[styles.featureIconContainer, { backgroundColor: theme.accentLight }]}>
                {feature.icon}
              </View>
              <Text style={[styles.featureTitle, { color: theme.text }]}>{feature.title}</Text>
              <Text style={[styles.featureText, { color: theme.secondaryText }]}>{feature.description}</Text>
            </View>
          ))}
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
          {materials.map((material, index) => 
            React.createElement(TouchableOpacity as any, {
              key: index,
              onPress: () => handleMaterialPress(material.name),
              style: [styles.materialCard, { backgroundColor: theme.card, ...theme.cardShadow }],
              activeOpacity: 0.8,
              children: (
                <>
                  <Image source={{ uri: material.image }} style={styles.materialImage} />
                  <View style={styles.materialInfo}>
                    <Text style={[styles.materialName, { color: theme.text }]}>{material.name}</Text>
                    <Text style={[styles.materialPrice, { color: theme.accent }]}>${material.price}</Text>
                  </View>
                </>
              )
            })
          )}
        </ScrollView>
      </View>

      <View style={[styles.cta, { backgroundColor: theme.accent }]}>
        <Text style={[styles.ctaTitle, { color: theme.text }]}>Ready to Print?</Text>
        <Text style={[styles.ctaText, { color: theme.text }]}>Upload your 3D model and get an instant quote</Text>
        <Link href="/(tabs)/upload" asChild>
          {createTouchable({
            activeOpacity: 0.7,
            children: (
              <View style={[styles.ctaWhiteButton, { 
                backgroundColor: theme.card,
                borderColor: theme.border
              }]}>
                <Text style={[styles.ctaWhiteButtonText, { color: theme.accent }]}>Let's Go</Text>
                <ArrowRight size={16} color={theme.accent} style={styles.ctaButtonArrow} />
              </View>
            )
          })}
        </Link>
      </View>
    </ScrollView>
  );
}

// Add a display name for better debugging and component stack traces
HomeScreen.displayName = 'HomeScreen';

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
    marginTop: 16,
  },
  glassButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 150,
    shadowColor: 'rgba(255, 255, 255, 0.5)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  heroButtonText: {
    fontSize: 15,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
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
    width: '100%',
  },
  featureCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    maxWidth: '48%',
    flexBasis: '48%',
  },
  featureIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
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
    paddingHorizontal: 28,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 3,
    shadowColor: 'rgba(0, 136, 255, 0.3)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    minWidth: 140,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  ctaWhiteButtonText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    marginRight: 6,
  },
  ctaButtonArrow: {
    marginLeft: 2,
  },
});