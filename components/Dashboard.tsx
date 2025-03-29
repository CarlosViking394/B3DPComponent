import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useTheme } from './ThemeContext';
import { StatsCard } from './StatsCard';
import { CreditCard, Calendar, ArrowUpRight, Users } from 'lucide-react-native';

interface DashboardProps {
  userName?: string;
  userImage?: string;
  onPaymentPress?: () => void;
  onProfilePress?: () => void;
}

export function Dashboard({ 
  userName = 'User',
  userImage = 'https://randomuser.me/api/portraits/men/32.jpg',
  onPaymentPress,
  onProfilePress
}: DashboardProps) {
  const { theme } = useTheme();
  const [stats, setStats] = useState({
    appointments: 0,
    retention: 13,
    productivity: 45,
    newClients: 4,
    appointmentsProgress: 0
  });

  // Simulate data loading or fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        appointments: 13,
        retention: 13,
        productivity: 45,
        newClients: 4,
        appointmentsProgress: 78
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const renderAppointmentsCard = () => {
    const cardStyle = stats.appointments === 0 
      ? { backgroundColor: '#0088FF' } 
      : { backgroundColor: theme.cardAlt };
      
    const textColor = stats.appointments === 0 ? '#FFFFFF' : theme.text;
    const labelColor = stats.appointments === 0 ? 'rgba(255,255,255,0.7)' : theme.secondaryText;
    
    return (
      <StatsCard
        title="Today's schedule"
        value={stats.appointments}
        suffix=" appointments"
        showProgress={stats.appointments > 0}
        progress={stats.appointmentsProgress}
        style={{...styles.mainCard, ...cardStyle}}
        valueColor={textColor}
        size="large"
        labelPosition={stats.appointments === 0 ? 'bottom' : 'bottom'}
      />
    );
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.userName, { color: theme.text }]}>
            {userName}
          </Text>
        </View>
        <TouchableOpacity onPress={onProfilePress}>
          <Image 
            source={{ uri: userImage }} 
            style={styles.userImage} 
          />
        </TouchableOpacity>
      </View>

      {renderAppointmentsCard()}

      {stats.appointments === 0 && (
        <View style={[styles.emptyStateContainer, { backgroundColor: theme.cardAlt }]}>
          <View style={styles.emptyStateContent}>
            <Calendar size={24} color={theme.secondaryText} />
            <Text style={[styles.emptyStateText, { color: theme.secondaryText }]}>
              Want to fill your calendar?
            </Text>
          </View>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#000000' }]}
            onPress={() => console.log('Free trial')}
          >
            <Text style={styles.actionButtonText}>Free trial</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.statsRow}>
        <StatsCard
          title="Retention"
          subtitle="Past 90 days"
          value={stats.retention}
          suffix="%"
          showProgress
          progress={stats.retention}
          style={styles.halfCard}
        />
        
        <StatsCard
          title="Productivity"
          subtitle="Past 90 days"
          value={stats.productivity}
          suffix="%"
          showProgress
          progress={stats.productivity}
          style={styles.halfCard}
        />
      </View>

      {stats.appointments > 0 ? (
        <StatsCard
          title="New clients"
          subtitle="Past 90 days"
          value={stats.newClients}
          style={styles.fullWidthCard}
          icon={<ArrowUpRight size={16} color={theme.success} />}
          size="large"
        />
      ) : (
        <TouchableOpacity 
          style={[styles.paymentCard, { backgroundColor: theme.card }]}
          onPress={onPaymentPress}
        >
          <View style={styles.paymentCardContent}>
            <View>
              <Text style={[styles.paymentCardTitle, { color: theme.text }]}>Tap to Pay</Text>
              <Text style={[styles.paymentCardSubtitle, { color: theme.secondaryText }]}>
                Accept in-person payments with only an iPhone
              </Text>
            </View>
            <Image 
              source={{ uri: 'https://developer.apple.com/design/human-interface-guidelines/images/intro/platforms/platform-tap-to-pay-on-iphone_2x.png' }} 
              style={styles.paymentImage}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  mainCard: {
    width: '100%',
    marginBottom: 16,
  },
  emptyStateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  emptyStateContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyStateText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  halfCard: {
    flex: 1,
    margin: 4,
  },
  fullWidthCard: {
    width: '100%',
  },
  paymentCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginVertical: 8,
  },
  paymentCardContent: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  paymentCardSubtitle: {
    fontSize: 14,
    maxWidth: '70%',
  },
  paymentImage: {
    width: 80,
    height: 80,
  },
}); 