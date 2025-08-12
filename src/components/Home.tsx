import React, { useState, useEffect } from 'react';
import { WeatherResponse } from '../types';

const Home: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState('Paris');
  const [newLocation, setNewLocation] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWeather = async (locationName: string) => {
    try {
      setIsUpdating(true);
      setError(null);
      
      const response = await fetch(`http://localhost:3001/api/weather/${encodeURIComponent(locationName)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: WeatherResponse = await response.json();
      setWeatherData(data);
      
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
              <p className="text-red-600 mb-4">Error: {error}</p>
              <button
                onClick={() => fetchWeather(location)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Retry
              </button>
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
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Current Weather</h2>
            
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

          {weatherData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Main Weather Display - Large Temperature */}
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg p-8 text-white">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">{weatherData.location.name}</h3>
                  <div className="text-6xl font-bold mb-4">{Math.round(weatherData.data.values.temperature)}°C</div>
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
                    <span className="text-2xl font-bold text-gray-900">{Math.round(weatherData.data.values.windSpeed * 3.6)} km/h</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">💧</span>
                      <span className="text-gray-600 font-medium">Humidity</span>
                    </div>
                    <span className="text-2xl font-bold text-gray-900">{Math.round(weatherData.data.values.humidity)}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 text-center text-gray-600">
            <p>Last updated: {weatherData?.data.time ? new Date(weatherData.data.time).toLocaleString() : 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
