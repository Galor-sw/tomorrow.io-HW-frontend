import React, { useState, useEffect } from 'react';
import { WeatherResponse } from '../types';

const Home: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState('London');
  const [newLocation, setNewLocation] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for development
  const mockWeatherData: WeatherResponse = {
    data: {
      time: "2025-08-11T08:35:00Z",
      values: {
        temperature: 22.8,
        humidity: 51,
        windSpeed: 2.2
      }
    },
    location: {
      name: "London, England, United Kingdom"
    }
  };

  const fetchWeather = async (locationName: string) => {
    try {
      setIsUpdating(true);
      setError(null);
      
      // For development - use mock data
      // TODO: Uncomment the API call when ready to use real data
      /*
      const response = await fetch(`http://localhost:3001/api/weather/${encodeURIComponent(locationName)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: WeatherResponse = await response.json();
      setWeatherData(data);
      */
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use mock data for development with updated location name
      const updatedMockData: WeatherResponse = {
        ...mockWeatherData,
        location: {
          name: `${locationName}, England, United Kingdom`
        }
      };
      
      setWeatherData(updatedMockData);
      
    } catch (error) {
      console.error('Error fetching weather:', error);
      setError('Failed to fetch weather data');
    } finally {
      setIsUpdating(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(location);
  }, [location]);

  const handleLocationUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLocation.trim()) {
      setLocation(newLocation.trim());
      setNewLocation('');
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Getting weather data for {location}...</p>
                <p className="text-xs text-gray-400 mt-2">Using mock data for development</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center py-12">
              <p className="text-red-600">Error: {error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Current Weather</h2>
            
            {/* Location Update Form */}
            <form onSubmit={handleLocationUpdate} className="flex items-center space-x-2">
              <input
                type="text"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder="Enter location..."
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isUpdating}
              />
              <button
                type="submit"
                disabled={!newLocation.trim() || isUpdating}
                className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? 'Updating...' : 'Update'}
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Main Weather Display - Large Temperature */}
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg p-8 text-white">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">{weatherData?.location.name}</h3>
                <div className="text-6xl font-bold mb-4">{Math.round(weatherData?.data.values.temperature || 0)}°C</div>
                <div className="text-lg opacity-90">Current Temperature</div>
              </div>
            </div>

            {/* Weather Details */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">💨</span>
                    <span className="text-gray-600 font-medium">Wind Speed</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{Math.round((weatherData?.data.values.windSpeed || 0) * 3.6)} km/h</span>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">💧</span>
                    <span className="text-gray-600 font-medium">Humidity</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{Math.round(weatherData?.data.values.humidity || 0)}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-gray-600">
            <p>Last updated: {weatherData?.data.time ? new Date(weatherData.data.time).toLocaleString() : 'N/A'}</p>
            <p className="text-xs text-gray-400 mt-2">🔧 Using mock data for development</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
