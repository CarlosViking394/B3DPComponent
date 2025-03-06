import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Platform, 
  Alert, 
  FlatList,
  SafeAreaView
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
// import { useStripe } from '@stripe/stripe-react-native';
import { Upload, FileWarning } from 'lucide-react-native';
import { ModelViewer } from '../../components/ModelViewer';
import { CostCalculator } from '../../components/CostCalculator';
import { sendAdminNotification } from '../../utils/notifications';

// Define the types of items that can be displayed in the FlatList
type ListItemType = 
  | { type: 'fileInfo', file: any }
  | { type: 'modelViewer', fileUri: string }
  | { type: 'costCalculator', file: any, onCostCalculated: (cost: number) => void }
  | { type: 'totalCost', cost: number }
  | { type: 'error', message: string };

export default function UploadScreen() {
  const [modelFile, setModelFile] = useState(null);
  const [totalCost, setTotalCost] = useState(0);
  const [error, setError] = useState('');
  const [listItems, setListItems] = useState<ListItemType[]>([]);
  // const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const handleFilePick = async () => {
    try {
      setError('');
      setListItems([]);

      // On iOS, we need to be more permissive with file types initially
      // and then validate the extension afterward
      const result = await DocumentPicker.getDocumentAsync({
        type: Platform.select({
          ios: ['*/*'], // Accept all files on iOS and validate later
          android: [
            'model/stl',
            'application/sla',
            'application/x-tgif',
            'application/vnd.ms-pki.stl',
            '*/*'
          ],
          default: [
            'application/x-tgif',
            'model/stl',
            'application/sla',
            'application/vnd.ms-pki.stl'
          ]
        }),
        copyToCacheDirectory: true,
        multiple: false
      });

      if (result.canceled) {
        return;
      }

      const file = result.assets[0];
      
      // Strict STL file validation
      const isStlFile = (fileName: string) => {
        // Case-insensitive check for .stl extension
        const stlRegex = /\.stl$/i;
        return stlRegex.test(fileName);
      };

      if (!isStlFile(file.name)) {
        setError('Please select a valid STL file (file extension must be .stl)');
        return;
      }

      // Validate file size (max 50MB)
      const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes
      if (file.size > MAX_FILE_SIZE) {
        setError('File size must be less than 50MB');
        return;
      }

      // Validate file name for safe characters
      const safeFileNameRegex = /^[a-zA-Z0-9-_. ]+$/;
      if (!safeFileNameRegex.test(file.name)) {
        setError('File name can only contain letters, numbers, spaces, and the following characters: - _ .');
        return;
      }

      // Additional validation for minimum file size
      const MIN_FILE_SIZE = 100; // 100 bytes
      if (file.size < MIN_FILE_SIZE) {
        setError('The STL file appears to be empty or invalid');
        return;
      }

      setModelFile(file);
      
      // Create list items for FlatList
      const newListItems: ListItemType[] = [
        { type: 'fileInfo', file },
        { type: 'modelViewer', fileUri: file.uri },
        { type: 'costCalculator', file, onCostCalculated: setTotalCost },
        { type: 'totalCost', cost: totalCost }
      ];
      
      setListItems(newListItems);
      
    } catch (err) {
      console.error('Error picking file:', err);
      if (Platform.OS === 'ios') {
        setError('Could not access the file. Make sure it\'s an STL file and try again.');
      } else {
        setError('Failed to load the file. Please try again.');
      }
    }
  };

  const handlePayment = async () => {
    if (!modelFile) {
      setError('Please upload a model first');
      return;
    }

    try {
      // Temporarily replaced Stripe payment with a simple alert
      // since the Stripe package is not installed
      
      /* Original Stripe code:
      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: 'your_payment_intent_secret',
        merchantDisplayName: '3D Print Service',
      });

      if (initError) {
        setError('Could not initialize payment. Please try again.');
        return;
      }

      const { error: paymentError } = await presentPaymentSheet();

      if (paymentError) {
        setError('Payment failed. Please try again.');
      } else {
      */
      
      // Simulate successful payment
      await sendAdminNotification({
        title: 'New 3D Print Order',
        body: `New order received for ${modelFile.name}`,
        data: {
          modelFile: modelFile.uri,
          cost: totalCost,
        },
      });

      setModelFile(null);
      setTotalCost(0);
      setListItems([]);
      Alert.alert(
        'Success!',
        'Your order has been placed successfully. We will start printing your model soon.',
        [{ text: 'OK' }]
      );
      
    } catch (err) {
      console.error('Payment error:', err);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  // Render different types of items in the FlatList
  const renderItem = ({ item }: { item: ListItemType }) => {
    switch (item.type) {
      case 'fileInfo':
        return (
          <View style={styles.fileInfo}>
            <Text style={styles.fileName}>File: {item.file.name}</Text>
            <Text style={styles.fileSize}>
              Size: {(item.file.size / 1024 / 1024).toFixed(2)}MB
            </Text>
          </View>
        );
      
      case 'modelViewer':
        return (
          <View style={styles.modelContainer}>
            <ModelViewer fileUri={item.fileUri} />
          </View>
        );
      
      case 'costCalculator':
        return (
          <CostCalculator
            file={item.file}
            onCostCalculated={item.onCostCalculated}
          />
        );
      
      case 'totalCost':
        return (
          <View style={styles.totalCostContainer}>
            <Text style={styles.totalCostLabel}>Total Cost:</Text>
            <Text style={styles.totalCostValue}>${item.cost.toFixed(2)}</Text>
          </View>
        );
      
      case 'error':
        return (
          <View style={styles.errorContainer}>
            <FileWarning size={20} color="#ff3b30" />
            <Text style={styles.errorText}>{item.message}</Text>
          </View>
        );
      
      default:
        return null;
    }
  };

  // Update the total cost item when it changes
  React.useEffect(() => {
    if (listItems.length > 0 && totalCost > 0) {
      const updatedItems = listItems.map(item => 
        item.type === 'totalCost' ? { ...item, cost: totalCost } : item
      );
      setListItems(updatedItems);
    }
  }, [totalCost]);

  // Update error display when error changes
  React.useEffect(() => {
    if (error) {
      // Find if there's already an error item
      const hasErrorItem = listItems.some(item => item.type === 'error');
      
      if (!hasErrorItem) {
        setListItems([...listItems, { type: 'error', message: error }]);
      } else {
        // Update existing error
        const updatedItems = listItems.map(item => 
          item.type === 'error' ? { type: 'error', message: error } : item
        );
        setListItems(updatedItems);
      }
    } else {
      // Remove error items if error is cleared
      setListItems(listItems.filter(item => item.type !== 'error'));
    }
  }, [error]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Upload Your 3D Model</Text>
        <Text style={styles.subtitle}>
          {Platform.OS === 'ios' 
            ? 'Select any STL file from your device'
            : 'We support STL files up to 50MB'}
        </Text>
      </View>

      <TouchableOpacity 
        style={[
          styles.uploadButton,
          modelFile && styles.uploadButtonActive
        ]} 
        onPress={handleFilePick}
      >
        <Upload size={24} color="#fff" />
        <Text style={styles.uploadText}>
          {modelFile ? 'Change STL File' : 'Select STL File'}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={listItems}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.type}-${index}`}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          modelFile ? (
            <TouchableOpacity
              style={styles.payButton}
              onPress={handlePayment}
              disabled={!modelFile}
            >
              <Text style={styles.payButtonText}>
                Proceed to Payment
              </Text>
            </TouchableOpacity>
          ) : null
        }
      />

      {error && listItems.length === 0 && (
        <View style={styles.errorContainer}>
          <FileWarning size={20} color="#ff3b30" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  uploadButtonActive: {
    backgroundColor: '#0056b3',
  },
  uploadText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 20,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebeb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    color: '#ff3b30',
    marginLeft: 8,
    flex: 1,
  },
  fileInfo: {
    backgroundColor: '#fff',
    padding: 16,
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
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  fileSize: {
    fontSize: 14,
    color: '#666',
  },
  modelContainer: {
    height: 250,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
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
  payButton: {
    backgroundColor: '#34C759',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  payButtonDisabled: {
    backgroundColor: '#a8e4b8',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  totalCostContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  totalCostLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalCostValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#007AFF',
  },
});