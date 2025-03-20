<WebView
  // ... other props
  onMessage={event => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'error') {
        // Handle error appropriately
        console.error(data.message);
      }
    } catch (e) {
      console.error('Failed to parse WebView message:', e);
    }
  }}
  javaScriptEnabled={true}
  domStorageEnabled={true}
  allowFileAccess={true}
/>
