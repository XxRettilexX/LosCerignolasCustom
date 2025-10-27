import { Platform, Dimensions } from 'react-native';

export type DeviceType = 'web' | 'tablet' | 'mobile';

const isTablet = () => {
  const { width, height } = Dimensions.get('window');
  const smallerDimension = Math.min(width, height);
  // A common heuristic for tablets is a smaller dimension > 600
  return smallerDimension > 600;
};

export const getDeviceType = (): DeviceType => {
  if (Platform.OS === 'web') {
    // On web, we could use window width, but for now let's assume 'web' is for desktop
    return 'web';
  }
  // For native, check if it's a tablet based on dimensions
  return isTablet() ? 'tablet' : 'mobile';
};