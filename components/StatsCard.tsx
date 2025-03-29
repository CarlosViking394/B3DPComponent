import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from './ThemeContext';

interface StatsCardProps {
  title: string;
  subtitle?: string;
  value: string | number;
  suffix?: string;
  progress?: number; // 0-100
  showProgress?: boolean;
  style?: ViewStyle;
  valueColor?: string;
  size?: 'small' | 'medium' | 'large';
  labelPosition?: 'bottom' | 'right';
  icon?: React.ReactNode;
}

export function StatsCard({
  title,
  subtitle,
  value,
  suffix,
  progress,
  showProgress = false,
  style,
  valueColor,
  size = 'medium',
  labelPosition = 'bottom',
  icon
}: StatsCardProps) {
  const { theme } = useTheme();
  
  const renderProgressBar = () => {
    if (!showProgress) return null;
    
    const progressValue = progress !== undefined ? Math.min(Math.max(progress, 0), 100) : 0;
    
    return (
      <View style={[styles.progressContainer, { backgroundColor: theme.progressBackground }]}>
        <View 
          style={[
            styles.progressBar, 
            { 
              backgroundColor: theme.progressBar,
              width: `${progressValue}%`
            }
          ]} 
        />
      </View>
    );
  };
  
  const valueSize = {
    small: 18,
    medium: 36,
    large: 72
  };
  
  const titleSize = {
    small: 12,
    medium: 14,
    large: 16
  };
  
  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: theme.card,
        ...theme.cardShadow
      },
      style
    ]}>
      <View style={styles.content}>
        {labelPosition === 'bottom' ? (
          <>
            <View style={styles.header}>
              {icon && <View style={styles.iconContainer}>{icon}</View>}
              <View style={styles.valueContainer}>
                <Text style={[
                  styles.value, 
                  { 
                    color: valueColor || theme.text,
                    fontSize: valueSize[size]  
                  }
                ]}>
                  {value}{suffix && <Text style={styles.suffix}>{suffix}</Text>}
                </Text>
              </View>
            </View>
            
            <View style={styles.footer}>
              <Text style={[styles.title, { color: theme.secondaryText, fontSize: titleSize[size] }]}>
                {title}
              </Text>
              {subtitle && (
                <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
                  {subtitle}
                </Text>
              )}
            </View>
          </>
        ) : (
          <View style={styles.horizontalLayout}>
            <View style={styles.labelContainer}>
              <Text style={[styles.title, { color: theme.secondaryText, fontSize: titleSize[size] }]}>
                {title}
              </Text>
              {subtitle && (
                <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
                  {subtitle}
                </Text>
              )}
            </View>
            
            <View style={styles.valueContainer}>
              <Text style={[
                styles.value, 
                { 
                  color: valueColor || theme.text,
                  fontSize: valueSize[size]  
                }
              ]}>
                {value}{suffix && <Text style={styles.suffix}>{suffix}</Text>}
              </Text>
            </View>
          </View>
        )}
      </View>
      
      {renderProgressBar()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    margin: 8,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    marginRight: 8,
  },
  valueContainer: {
    flex: 1,
  },
  value: {
    fontWeight: '700',
  },
  suffix: {
    fontWeight: '400',
    fontSize: 16,
  },
  footer: {
    marginTop: 4,
  },
  title: {
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  progressContainer: {
    height: 4,
    width: '100%',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
  horizontalLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelContainer: {
    flex: 1,
  },
}); 