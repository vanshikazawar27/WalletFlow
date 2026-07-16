import * as LocalAuthentication from 'expo-local-authentication';
import { useCallback, useEffect, useState } from 'react';

interface BiometricState {
  isSupported: boolean;
  isEnrolled: boolean;
  biometricType: 'fingerprint' | 'face' | 'iris' | 'none';
}

export const useBiometrics = () => {
  const [state, setState] = useState<BiometricState>({
    isSupported: false,
    isEnrolled: false,
    biometricType: 'none',
  });

  useEffect(() => {
    const checkBiometrics = async () => {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (hasHardware && isEnrolled) {
        const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
        let biometricType: BiometricState['biometricType'] = 'fingerprint';
        if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          biometricType = 'face';
        } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.IRIS)) {
          biometricType = 'iris';
        }
        setState({ isSupported: hasHardware, isEnrolled, biometricType });
      } else {
        setState({ isSupported: hasHardware, isEnrolled, biometricType: 'none' });
      }
    };

    checkBiometrics();
  }, []);

  const authenticate = useCallback(async (): Promise<boolean> => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Confirm your identity',
        cancelLabel: 'Use Password',
        fallbackLabel: 'Use Password',
        disableDeviceFallback: false,
      });
      return result.success;
    } catch {
      return false;
    }
  }, []);

  return {
    ...state,
    authenticate,
    isAvailable: state.isSupported && state.isEnrolled,
  };
};
