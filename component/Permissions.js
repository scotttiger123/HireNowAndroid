import { PermissionsAndroid, Platform } from 'react-native';

export const getStoragePermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to your storage to read files.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can read the storage');
      } else {
        console.log('Storage permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }
};
