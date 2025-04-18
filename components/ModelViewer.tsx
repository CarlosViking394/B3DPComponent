import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { useTheme } from './ThemeContext';
import * as FileSystem from 'expo-file-system';

// Props for the ModelViewer component
interface ModelViewerProps {
  fileUri?: string;
  title?: string;
  subtitle?: string;
}

/**
 * ModelViewer component that uses WebView with Three.js to render actual STL files
 */
export const ModelViewer: React.FC<ModelViewerProps> = ({
  fileUri = '',
}) => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [webViewKey, setWebViewKey] = useState(0);

  // Create the minimal HTML for the WebView
  const getMinimalHtml = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            background-color: ${theme?.cardAlt || '#2A2A2A'};
          }
          canvas {
            width: 100%;
            height: 100%;
            display: block;
          }
        </style>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/STLLoader.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
      </head>
      <body>
        <script>
          // Set up scene
          const scene = new THREE.Scene();
          scene.background = new THREE.Color(${theme?.cardAlt ? `"${theme.cardAlt}"` : '0x2A2A2A'});
          
          // Set up camera
          const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
          camera.position.z = 5;
          
          // Set up renderer
          const renderer = new THREE.WebGLRenderer({ antialias: true });
          renderer.setSize(window.innerWidth, window.innerHeight);
          document.body.appendChild(renderer.domElement);
          
          // Add lights
          const ambientLight = new THREE.AmbientLight(0x404040);
          scene.add(ambientLight);
          
          const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
          directionalLight.position.set(1, 1, 1);
          scene.add(directionalLight);
          
          const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
          directionalLight2.position.set(-1, -1, -1);
          scene.add(directionalLight2);
          
          // Add OrbitControls
          const controls = new THREE.OrbitControls(camera, renderer.domElement);
          controls.enableDamping = true;
          controls.dampingFactor = 0.25;
          
          // Animation loop
          function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
          }
          
          // Handle window resize
          window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
          });
          
          // Create placeholder cube - used when no STL file is available
          function createPlaceholder() {
            try {
              const geometry = new THREE.BoxGeometry(2, 2, 2);
              const material = new THREE.MeshPhongMaterial({ 
                color: ${theme?.accent ? `0x${theme.accent.substring(1)}` : '0x0088ff'}, 
                transparent: true, 
                opacity: 0.8 
              });
              
              const cube = new THREE.Mesh(geometry, material);
              scene.add(cube);
              
              // Animate the cube rotation
              function animateCube() {
                requestAnimationFrame(animateCube);
                cube.rotation.x += 0.005;
                cube.rotation.y += 0.01;
              }
              
              animateCube();
              
              // Notify React Native
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'placeholder_shown'
              }));
            } catch (e) {
              console.error('Error creating placeholder:', e);
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'error',
                message: 'Failed to create placeholder: ' + e.message
              }));
            }
          }
          
          // Process STL binary data
          function processBinarySTL(stlData) {
            try {
              // Clear any existing objects
              while(scene.children.length > 0) { 
                const obj = scene.children[0];
                if(obj.dispose) obj.dispose();
                scene.remove(obj);
              }
              
              // Re-add lights after clearing scene
              scene.add(ambientLight);
              scene.add(directionalLight);
              scene.add(directionalLight2);
              
              // Parse STL data
              const loader = new THREE.STLLoader();
              const geometry = loader.parse(stlData);
              
              // Center the geometry
              geometry.center();
              
              // Compute bounding box for scaling
              geometry.computeBoundingBox();
              if (geometry.boundingBox) {
                const size = new THREE.Vector3();
                geometry.boundingBox.getSize(size);
                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 3 / maxDim;
                geometry.scale(scale, scale, scale);
              }
              
              // Create a mesh with the geometry
              const material = new THREE.MeshPhongMaterial({
                color: ${theme?.accent ? `0x${theme.accent.substring(1)}` : '0x0088ff'},
                specular: 0x111111,
                shininess: 200,
                side: THREE.DoubleSide
              });
              
              const mesh = new THREE.Mesh(geometry, material);
              scene.add(mesh);
              
              // Send success message back to React Native
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'model_loaded',
                success: true
              }));
            } catch (e) {
              console.error('Error processing STL:', e);
              // Send error message back to React Native
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'error',
                message: 'Failed to process STL: ' + e.message
              }));
              
              // Show placeholder as fallback
              createPlaceholder();
            }
          }
          
          // Communication handler to receive STL data from React Native
          window.addEventListener('message', function(event) {
            try {
              const message = JSON.parse(event.data);
              
              if (message.type === 'stl_data') {
                // Decode base64 to binary array
                const binaryString = atob(message.data);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                  bytes[i] = binaryString.charCodeAt(i);
                }
                processBinarySTL(bytes.buffer);
              } else if (message.type === 'show_placeholder') {
                createPlaceholder();
              }
            } catch (e) {
              // Send error message back to React Native
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'error',
                message: e.message
              }));
              
              // Try to show placeholder as fallback
              try {
                createPlaceholder();
              } catch (innerError) {
                console.error('Failed to create placeholder:', innerError);
              }
            }
          });
          
          // Start animation loop
          animate();
          
          // Tell React Native the WebView is ready
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'webview_ready'
          }));
        </script>
      </body>
      </html>
    `;
  };

  // Handler for WebView messages
  const handleWebViewMessage = (event: any) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      
      if (message.type === 'webview_ready') {
        // WebView is ready, now load the STL file
        loadSTLFile();
      } else if (message.type === 'model_loaded' || message.type === 'placeholder_shown') {
        setLoading(false);
      } else if (message.type === 'error') {
        console.error('WebView error:', message.message);
        setError(message.message);
        setLoading(false);
      }
    } catch (e) {
      console.error('Error handling WebView message:', e);
    }
  };

  // Load STL file when WebView is ready
  const loadSTLFile = async () => {
    if (!fileUri) {
      // If no file, show placeholder
      webViewRef.current?.injectJavaScript(`
        window.postMessage(JSON.stringify({
          type: 'show_placeholder'
        }), '*');
        true;
      `);
      return;
    }

    try {
      // Get file info
      const fileInfo = await FileSystem.getInfoAsync(fileUri);

      // For very large files, we may need to limit size
      if (fileInfo.exists && 'size' in fileInfo && fileInfo.size > 50 * 1024 * 1024) {
        setError('File is too large (max 50MB)');
        setLoading(false);
        return;
      }
      
      // Read the file as base64
      const base64Content = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64
      });
      
      // Send data to WebView
      webViewRef.current?.injectJavaScript(`
        window.postMessage(JSON.stringify({
          type: 'stl_data',
          data: '${base64Content}'
        }), '*');
        true;
      `);
    } catch (err) {
      console.error('Error reading STL file:', err);
      setError('Failed to read STL file');
      setLoading(false);
    }
  };

  // Reference to the WebView
  const webViewRef = React.useRef<WebView>(null);

  // Reset WebView if there's an error
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setWebViewKey(prev => prev + 1);
        setError(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme?.accent || '#0088ff'} />
        </View>
      )}
      
      <WebView
        key={webViewKey}
        ref={webViewRef}
        style={styles.webview}
        source={{ html: getMinimalHtml() }}
        originWhitelist={['*']}
        scrollEnabled={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        allowFileAccessFromFileURLs={true}
        onMessage={handleWebViewMessage}
        onError={(e) => {
          console.error('WebView error:', e.nativeEvent);
          setError('WebView error: ' + e.nativeEvent.description);
          setLoading(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  }
});