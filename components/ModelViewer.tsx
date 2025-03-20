import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform, Text, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';

interface ModelViewerProps {
  fileUri: string;
}

function NativeModelViewer({ fileUri }: ModelViewerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileData, setFileData] = useState<string | null>(null);

  // Load the file data on component mount
  useEffect(() => {
    const loadFileData = async () => {
      try {
        console.log('Attempting to load file:', fileUri);
  
        if (Platform.OS === 'ios') {
          // iOS: Convert file to Base64
          const cleanUri = fileUri.replace('file://', '');
          const base64Data = await FileSystem.readAsStringAsync(cleanUri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          setFileData(`data:model/stl;base64,${base64Data}`);
          console.log('File loaded as base64 for WebView.');
        } else {
          // Android: Copy file to cacheDirectory for accessibility and convert to Base64
          const fileName = fileUri.split('/').pop();
          if (!fileName) {
            throw new Error(`Invalid fileUri, unable to extract filename: ${fileUri}`);
          }
          const newPath = FileSystem.cacheDirectory + fileName;
          await FileSystem.copyAsync({
            from: fileUri,
            to: newPath,
          });
          console.log('File copied for Android from', fileUri, 'to', newPath);
          // Convert copied file to Base64 for WebView compatibility
          const base64Data = await FileSystem.readAsStringAsync(newPath, {
            encoding: FileSystem.EncodingType.Base64,
          });
          setFileData(`data:model/stl;base64,${base64Data}`);
          console.log('File loaded as base64 for Android WebView.');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error('Error loading file:', errorMessage);
        setError(`Failed to read file: ${errorMessage}`);
        setLoading(false);
      }
    };
  
    loadFileData();
  }, [fileUri]);
  
  

  // Create a placeholder model if no file is available
  const createPlaceholderModel = () => {
    return `
      const geometry = new THREE.BoxGeometry(3, 3, 3);
      const material = new THREE.MeshPhongMaterial({
        color: 0x3d7aed,
        specular: 0x111111,
        shininess: 50
      });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      camera.position.z = 5;
    `;
  };

  // Handle file loading with error handling
  const loadModelCode = () => {
    if (!fileData) {
      return createPlaceholderModel();
    }
    
    console.log('Loading model from:', Platform.OS === 'ios' ? 'data URI' : fileData);
    
    return `
      // Show a placeholder cube while we attempt to load the model
      ${createPlaceholderModel()}
      
      // Attempt to load the STL file
      try {
        const loader = new THREE.STLLoader();
        
        ${Platform.OS === 'ios' ? `
        // For iOS, we use the data URI directly with the parse method
        const base64Data = '${fileData}'.replace('data:model/stl;base64,', '');
        const binaryString = window.atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        
        try {
          const geometry = loader.parse(bytes.buffer);
          
          // Remove the placeholder
          while(scene.children.length > 0){ 
            scene.remove(scene.children[0]); 
          }
          
          // Add lights back
          scene.add(ambientLight);
          scene.add(directionalLight);
          scene.add(backLight);
          
          geometry.center();
          
          const material = new THREE.MeshPhongMaterial({
            color: 0x3d7aed,
            specular: 0x111111,
            shininess: 50
          });
          const mesh = new THREE.Mesh(geometry, material);
          
          // Auto-scale the model
          geometry.computeBoundingBox();
          const box = geometry.boundingBox;
          const size = new THREE.Vector3();
          box.getSize(size);
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 5 / maxDim;
          mesh.scale.set(scale, scale, scale);
          
          scene.add(mesh);
          
          // Position camera
          camera.position.z = 10;
          camera.position.y = 5;
          camera.position.x = 5;
          camera.lookAt(0, 0, 0);
          
          // Signal success to React Native
          window.ReactNativeWebView.postMessage(JSON.stringify({type: 'loaded'}));
        } catch (parseError) {
          console.error('Error parsing STL data:', parseError);
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'error',
            message: 'Failed to parse STL file: ' + parseError.message
          }));
        }
        ` : `
        // For Android and web, use fetch
        console.log('Attempting to load STL from:', '${fileData}');
        
        // Use fetch to get the file data first
        fetch('${fileData}')
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.arrayBuffer();
          })
          .then(buffer => {
            try {
              // Parse the STL data from the buffer
              const geometry = loader.parse(buffer);
              
              // Remove the placeholder
              while(scene.children.length > 0){ 
                scene.remove(scene.children[0]); 
              }
              
              // Add lights back
              scene.add(ambientLight);
              scene.add(directionalLight);
              scene.add(backLight);
              
              geometry.center();
              
              const material = new THREE.MeshPhongMaterial({
                color: 0x3d7aed,
                specular: 0x111111,
                shininess: 50
              });
              const mesh = new THREE.Mesh(geometry, material);
              
              // Auto-scale the model
              geometry.computeBoundingBox();
              const box = geometry.boundingBox;
              const size = new THREE.Vector3();
              box.getSize(size);
              const maxDim = Math.max(size.x, size.y, size.z);
              const scale = 5 / maxDim;
              mesh.scale.set(scale, scale, scale);
              
              scene.add(mesh);
              
              // Position camera
              camera.position.z = 10;
              camera.position.y = 5;
              camera.position.x = 5;
              camera.lookAt(0, 0, 0);
              
              // Signal success to React Native
              window.ReactNativeWebView.postMessage(JSON.stringify({type: 'loaded'}));
            } catch (parseError) {
              console.error('Error parsing STL data:', parseError);
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'error',
                message: 'Failed to parse STL file: ' + parseError.message
              }));
            }
          })
          .catch(error => {
            console.error('Error fetching STL file:', error);
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'error',
              message: 'Failed to fetch 3D model: ' + error.message
            }));
          });
        `}
      } catch (e) {
        console.error('Exception in STL loader:', e);
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'error',
          message: 'Exception in 3D viewer: ' + e.message
        }));
      }
    `;
  };

  // If we're still loading the file data, show a loading indicator
  if (!fileData && !error) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Preparing 3D model...</Text>
      </View>
    );
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>3D Model Viewer</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/STLLoader.js"></script>
        <style>
          body { 
            margin: 0; 
            overflow: hidden;
            touch-action: none;
          }
          canvas { 
            width: 100%; 
            height: 100%; 
            display: block;
          }
          #container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
          #error {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #ff3b30;
            font-family: Arial, sans-serif;
            text-align: center;
            background: rgba(255,255,255,0.8);
            padding: 20px;
            border-radius: 8px;
            display: none;
          }
        </style>
      </head>
      <body>
        <div id="container"></div>
        <div id="error">Failed to load 3D model</div>
        <script>
          // Create scene
          const scene = new THREE.Scene();
          scene.background = new THREE.Color(0xf5f5f5);
          
          // Create camera
          const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
          
          // Create renderer
          const renderer = new THREE.WebGLRenderer({ antialias: true });
          renderer.setSize(window.innerWidth, window.innerHeight);
          document.getElementById('container').appendChild(renderer.domElement);

          // Add lights
          const ambientLight = new THREE.AmbientLight(0x404040, 1);
          scene.add(ambientLight);
          
          const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
          directionalLight.position.set(1, 1, 1);
          scene.add(directionalLight);
          
          const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
          backLight.position.set(-1, -1, -1);
          scene.add(backLight);

          // Load the model
          ${loadModelCode()}

          // Add orbit controls
          const controls = new THREE.OrbitControls(camera, renderer.domElement);
          controls.enableDamping = true;
          controls.dampingFactor = 0.05;
          controls.screenSpacePanning = true;
          controls.minDistance = 3;
          controls.maxDistance = 20;
          controls.autoRotate = true;
          controls.autoRotateSpeed = 1;

          function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
          }
          animate();

          // Handle window resize
          window.addEventListener('resize', onWindowResize, false);
          function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
          }
          
          // Handle errors
          window.addEventListener('error', function(event) {
            console.error('JS Error:', event.message);
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'error',
                message: event.message
              }));
            }
            document.getElementById('error').style.display = 'block';
            document.getElementById('error').innerText = 'Error: ' + event.message;
          });
        </script>
      </body>
    </html>
  `;

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log('Received message from WebView:', data);
      if (data.type === 'loaded') {
        setLoading(false);
      } else if (data.type === 'error') {
        setError(data.message);
        setLoading(false);
      }
    } catch (e) {
      console.error('Error parsing message:', e);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        source={{ html: htmlContent }}
        style={styles.webview}
        onMessage={handleMessage}
        onLoadEnd={() => {
          // This doesn't mean the STL is loaded, just that the HTML has loaded
          setTimeout(() => {
            if (loading) {
              setLoading(false);
            }
          }, 8000); // Timeout after 8 seconds
        }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
          setError('Failed to load viewer');
          setLoading(false);
        }}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        allowFileAccessFromFileURLs={true}
        mixedContentMode="always"
        cacheEnabled={false}
      />
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading 3D model...</Text>
        </View>
      )}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.errorSubtext}>Try uploading a different STL file</Text>
        </View>
      )}
    </View>
  );
}

// For web, we'll use the same approach for consistency
function WebModelViewer({ fileUri }: ModelViewerProps) {
  return <NativeModelViewer fileUri={fileUri} />;
}

export function ModelViewer({ fileUri }: ModelViewerProps) {
  return (
    <View style={styles.container}>
      {Platform.OS === 'web' ? (
        <WebModelViewer fileUri={fileUri} />
      ) : (
        <NativeModelViewer fileUri={fileUri} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    overflow: 'hidden',
    borderRadius: 12,
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff3b30',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});