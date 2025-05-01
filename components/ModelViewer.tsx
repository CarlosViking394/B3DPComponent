import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Platform } from 'react-native';
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
  const [useWebGLFallback, setUseWebGLFallback] = useState(false);

  // Create the minimal HTML for the WebView
  const getMinimalHtml = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <meta http-equiv="Content-Security-Policy" content="default-src * gap:; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src *; img-src * data: blob: android-webview-video-poster:; style-src * 'unsafe-inline';">
        <style>
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            background-color: ${theme?.cardAlt || '#2A2A2A'};
            touch-action: none;
          }
          canvas {
            width: 100%;
            height: 100%;
            display: block;
          }
          #loadingMessage {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-family: system-ui;
            text-align: center;
          }
        </style>
        <script>
          // Optimize memory for WebView
          if (window.gc) {
            window.gc();
          }
        </script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r159/three.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/three@0.159.0/examples/js/loaders/STLLoader.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/three@0.159.0/examples/js/controls/OrbitControls.min.js"></script>
      </head>
      <body>
        <div id="loadingMessage">Initializing 3D renderer...</div>
        <script>
          // Set up scene
          const scene = new THREE.Scene();
          scene.background = new THREE.Color(${theme?.cardAlt ? `"${theme.cardAlt}"` : '0x2A2A2A'});
          
          // Check if WebGL is available
          if (!THREE.WebGLRenderer.isWebGLAvailable()) {
            document.getElementById('loadingMessage').innerHTML = 'WebGL not supported on this device';
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'error',
              message: 'WebGL not supported on this device'
            }));
            return;
          }
          
          // Set up camera
          const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
          camera.position.z = 5;
          
          // Set up renderer with optimized settings
          const renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            precision: 'highp'
          });
          renderer.setSize(window.innerWidth, window.innerHeight);
          renderer.setPixelRatio(window.devicePixelRatio > 2 ? 2 : window.devicePixelRatio); // Limit pixel ratio for better performance
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
            document.getElementById('loadingMessage').style.display = 'none';
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
          
          // Process STL binary data with optimizations for Android
          function processBinarySTL(stlData) {
            document.getElementById('loadingMessage').innerHTML = 'Processing 3D model...';
            
            try {
              // Clear any existing objects to free memory
              while(scene.children.length > 0) { 
                const obj = scene.children[0];
                if(obj.type === 'Mesh' && obj.geometry) {
                  obj.geometry.dispose();
                }
                if(obj.material) {
                  if(Array.isArray(obj.material)) {
                    obj.material.forEach(mat => mat.dispose());
                  } else {
                    obj.material.dispose();
                  }
                }
                scene.remove(obj);
              }
              
              // Re-add lights after clearing scene
              scene.add(ambientLight);
              scene.add(directionalLight);
              scene.add(directionalLight2);
              
              // Force a garbage collection if available
              if (window.gc) { 
                window.gc(); 
              }
              
              // Create simplified mesh for Android
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
              
              // Create a mesh with optimized material
              const material = new THREE.MeshPhongMaterial({
                color: ${theme?.accent ? `0x${theme.accent.substring(1)}` : '0x0088ff'},
                specular: 0x111111,
                shininess: 30, // Lower shininess for better performance
                side: THREE.FrontSide, // Only render front side for performance
                flatShading: true // Better performance with flat shading
              });
              
              const mesh = new THREE.Mesh(geometry, material);
              scene.add(mesh);
              
              // Hide loading message
              document.getElementById('loadingMessage').style.display = 'none';
              
              // Send success message back to React Native
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'model_loaded',
                success: true
              }));
            } catch (e) {
              document.getElementById('loadingMessage').innerHTML = 'Error loading model: ' + e.message;
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

  // Handle WebView messages
  const handleWebViewMessage = (event: any) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      console.log("Received WebView message:", message.type);
      
      if (message.type === 'webview_ready') {
        // WebView is ready, now load the STL file
        console.log("WebView is ready, loading STL file");
        loadSTLFile();
      } else if (message.type === 'model_loaded' || message.type === 'placeholder_shown') {
        console.log("Model loaded or placeholder shown");
        setLoading(false);
      } else if (message.type === 'error') {
        console.error('WebView error:', message.message);
        setError(message.message);
        setLoading(false);
        
        // If WebGL is not supported, use fallback
        if (message.message.includes('WebGL not supported')) {
          console.log("WebGL not supported, switching to fallback");
          setUseWebGLFallback(true);
        }
      } else if (message.type === 'debug') {
        console.log("Debug from WebView:", message.message);
      } else if (message.type === 'processing_started') {
        console.log("STL processing started in WebView");
      }
    } catch (e) {
      console.error('Error handling WebView message:', e);
    }
  };

  // Load STL file when WebView is ready
  const loadSTLFile = async () => {
    console.log("loadSTLFile called with fileUri:", fileUri);
    
    if (!fileUri || fileUri === '') {
      console.log("No fileUri provided, showing placeholder");
      // If no file, show placeholder
      webViewRef.current?.injectJavaScript(`
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'show_placeholder'
        }));
        true;
      `);
      return;
    }

    try {
      // Get file info
      console.log("Checking if file exists:", fileUri);
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      console.log("File info result:", JSON.stringify(fileInfo));

      if (!fileInfo.exists) {
        console.log("File does not exist:", fileUri);
        setError('File does not exist at path: ' + fileUri);
        setLoading(false);
        setUseWebGLFallback(true);
        return;
      }

      // For very large files, we may need to limit size
      if (fileInfo.exists && 'size' in fileInfo && fileInfo.size > 50 * 1024 * 1024) {
        setError('File is too large (max 50MB)');
        setLoading(false);
        return;
      }
      
      // Start model loading process
      console.log("Starting to load STL file: " + fileUri);
      
      // Create a data URL from the file
      const base64Content = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64
      });
      
      // For Android with large files, use optimized approach with direct base64 data
      console.log("Loaded STL file, size: " + base64Content.length + " bytes encoded");
      
      // Simply provide the data directly to processBinarySTL
      webViewRef.current?.injectJavaScript(`
        try {
          document.getElementById('loadingMessage').innerHTML = 'Decoding STL data...';
          
          // Decode base64 to binary
          console.log("Starting to decode STL data");
          const binaryString = atob("${base64Content}");
          console.log("Decoded base64 data, length: " + binaryString.length);
          
          // Create byte array
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          
          // Process directly
          console.log("Processing STL data");
          processBinarySTL(bytes.buffer);
          true;
        } catch(e) {
          console.error("Error processing STL data: " + e.message);
          document.getElementById('loadingMessage').innerHTML = 'Error: ' + e.message;
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'error',
            message: 'Error processing STL data: ' + e.message
          }));
        }
      `);
    } catch (err) {
      console.error('Error reading STL file:', err);
      setError('Failed to read STL file' + (err instanceof Error ? ': ' + err.message : ''));
      setLoading(false);
      if (Platform.OS === 'android') {
        setUseWebGLFallback(true);
      }
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

  // Platform-specific initialization
  useEffect(() => {
    if (Platform.OS === 'android') {
      // For Android, add extra timeout to ensure proper initialization
      const timer = setTimeout(() => {
        if (loading) {
          console.log('Android WebView taking too long to load, using fallback');
          setUseWebGLFallback(true);
          setLoading(false);
        }
      }, 120000); // Increased to 2 minutes (120000ms) - much more time to load
      
      return () => clearTimeout(timer);
    }
  }, [loading]);

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme?.accent || '#0088ff'} />
        </View>
      )}
      
      {useWebGLFallback ? (
        // Fallback for devices that don't support WebGL
        <View style={[styles.webview, { backgroundColor: theme?.cardAlt || '#2A2A2A', justifyContent: 'center', alignItems: 'center' }]}>
          <View style={{ width: 100, height: 100, backgroundColor: theme?.accent || '#0088ff', borderRadius: 8 }} />
        </View>
      ) : (
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
          mixedContentMode="always"
          onMessage={handleWebViewMessage}
          onError={(e) => {
            console.error('WebView error:', e.nativeEvent);
            setError('WebView error: ' + e.nativeEvent.description);
            setLoading(false);
            // Force fallback on WebView error for Android
            if (Platform.OS === 'android') {
              setUseWebGLFallback(true);
            }
          }}
          renderToHardwareTextureAndroid={true}
          cacheEnabled={true}
          onShouldStartLoadWithRequest={() => true}
          // Set initial scale for better performance
          injectedJavaScriptBeforeContentLoaded={`
            // Detect WebGL support immediately on load
            function checkWebGLSupport() {
              try {
                const canvas = document.createElement('canvas');
                const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                if (!gl) {
                  // WebGL not supported, notify React Native
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'error',
                    message: 'WebGL not supported on this device'
                  }));
                  return false;
                }
                return true;
              } catch (e) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'error',
                  message: 'Error detecting WebGL: ' + e.message
                }));
                return false;
              }
            }
            checkWebGLSupport();
            true;
          `}
          // Set a large timeout for complex models
          scalesPageToFit={true}
          onLoadEnd={() => {
            console.log("WebView loaded completely");
          }}
        />
      )}
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