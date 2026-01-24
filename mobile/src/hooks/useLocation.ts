
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export interface LocationData {
    latitude: number;
    longitude: number;
    city: string | null;
    district: string | null;
    region: string | null;
    isoCountryCode: string | null;
}

export function useLocation() {
    const [location, setLocation] = useState<LocationData | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setErrorMsg('Permission to access location was denied');
                    setLoading(false);
                    return;
                }

                let loc = await Location.getCurrentPositionAsync({});

                // Reverse Geocode
                let address = await Location.reverseGeocodeAsync({
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude
                });

                let city = null;
                let district = null;
                let region = null;
                let isoCountryCode = null;

                if (address && address.length > 0) {
                    const first = address[0];
                    city = first.city || first.subregion || null;
                    district = first.district || first.street || null; // Fallback
                    region = first.region || null;
                    isoCountryCode = first.isoCountryCode || null;
                }

                setLocation({
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                    city,
                    district,
                    region,
                    isoCountryCode
                });
            } catch (e) {
                setErrorMsg('Error fetching location');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return { location, errorMsg, loading };
}
