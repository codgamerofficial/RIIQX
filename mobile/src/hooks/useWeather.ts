
import { useState, useEffect } from 'react';

export interface WeatherData {
    temperature: number;
    weatherCode: number;
    condition: string;
    isDay: number;
    minTemp?: number;
    maxTemp?: number;
}

// WMO Weather interpretation codes (http://www.wmo.int/pages/prog/www/IMOP/publications/CIMO-Guide/Updates/CIMO_Guide_7th_Edition_2008.pdf)
const getWeatherCondition = (code: number): string => {
    if (code === 0) return 'Clear Sky';
    if (code === 1) return 'Mainly Clear';
    if (code === 2) return 'Partly Cloudy';
    if (code === 3) return 'Overcast';
    if (code >= 45 && code <= 48) return 'Fog';
    if (code >= 51 && code <= 55) return 'Drizzle';
    if (code >= 61 && code <= 65) return 'Rain';
    if (code >= 71 && code <= 77) return 'Snow';
    if (code >= 80 && code <= 82) return 'Showers';
    if (code >= 95 && code <= 99) return 'Thunderstorm';
    return 'Unknown';
}

export function useWeather(lat: number | null, lon: number | null) {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!lat || !lon) return;

        const fetchWeather = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,is_day&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
                );
                const data = await response.json();

                if (data.current) {
                    setWeather({
                        temperature: Math.round(data.current.temperature_2m),
                        weatherCode: data.current.weather_code,
                        condition: getWeatherCondition(data.current.weather_code),
                        isDay: data.current.is_day,
                        minTemp: Math.round(data.daily?.temperature_2m_min[0]),
                        maxTemp: Math.round(data.daily?.temperature_2m_max[0]),
                    });
                }
            } catch (err) {
                setError('Failed to fetch weather');
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
        // Refresh every 30 mins
        const interval = setInterval(fetchWeather, 30 * 60 * 1000);
        return () => clearInterval(interval);

    }, [lat, lon]);

    return { weather, loading, error };
}
