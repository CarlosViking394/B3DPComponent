import React, { Component } from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

// Use a class component to avoid ref issues in JSX
export class SafeTouchableOpacity extends Component<TouchableOpacityProps> {
  // Add displayName for better debugging
  static displayName = 'SafeTouchableOpacity';
  
  render() {
    return React.createElement(TouchableOpacity, this.props);
  }
} 