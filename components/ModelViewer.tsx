import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

interface ModelViewerProps {
  fileUri: string;
}

function NativeModelViewer({ fileUri }: ModelViewerProps) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>3D Model Viewer</title>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/STLLoader.js"></script>
        <style>
          body { margin: 0; }
          canvas { width: 100%; height: 100%; }
        </style>
      </head>
      <body>
        <div id="container"></div>
        <script>
          const scene = new THREE.Scene();
          scene.background = new THREE.Color(0xffffff);
          
          const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
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
          const loader = new THREE.STLLoader();
          loader.load('${fileUri}', function(geometry) {
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
          });

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
        </script>
      </body>
    </html>
  `;

  return (
    <WebView
      source={{ html: htmlContent }}
      style={styles.webview}
      onError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.warn('WebView error: ', nativeEvent);
      }}
    />
  );
}

function WebModelViewer({ fileUri }: ModelViewerProps) {
  // For web, we'll use the same WebView approach for consistency
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
});