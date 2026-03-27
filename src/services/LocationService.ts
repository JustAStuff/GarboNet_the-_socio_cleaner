import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

export interface LocationData {
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: number;
}

export class LocationService {
    /**
     * Request location permissions for Android
     */
    static async requestPermissions(): Promise<boolean> {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
                ]);

                return (
                    granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED &&
                    granted['android.permission.ACCESS_COARSE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
                );
            } catch (err) {
                console.warn('Permission request error:', err);
                return false;
            }
        }
        return true; // iOS permissions are handles via App Delegate or Plist usually, but this app is for your Android phone.
    }

    /**
     * Get current device location with high accuracy
     */
    static async getCurrentLocation(): Promise<LocationData> {
        const hasPermission = await this.requestPermissions();
        if (!hasPermission) {
            throw new Error('Location permission denied');
        }

        return new Promise((resolve, reject) => {
            Geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        timestamp: position.timestamp,
                    });
                },
                (error) => {
                    // If high accuracy fails, try with low accuracy as fallback
                    if (error.code === 3) { // Timeout
                        this.getLowAccuracyLocation().then(resolve).catch(reject);
                    } else {
                        reject(error);
                    }
                },
                {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 10000,
                    showLocationDialog: true,
                    forceRequestLocation: true,
                }
            );
        });
    }

    private static async getLowAccuracyLocation(): Promise<LocationData> {
        return new Promise((resolve, reject) => {
            Geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        timestamp: position.timestamp,
                    });
                },
                (error) => reject(error),
                {
                    enableHighAccuracy: false,
                    timeout: 15000,
                    maximumAge: 30000,
                }
            );
        });
    }
}
