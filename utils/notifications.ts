import * as Notifications from 'expo-notifications';

interface NotificationData {
  title: string;
  body: string;
  data?: any;
}

export async function sendAdminNotification(notification: NotificationData) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: notification.title,
        body: notification.body,
        data: notification.data,
      },
      trigger: null, // Send immediately
    });
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});