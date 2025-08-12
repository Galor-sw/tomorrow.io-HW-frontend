import React, { useState, useEffect, useRef } from 'react';
import type { TriggeredAlert } from '../types';
// eslint-disable-next-line no-unused-vars
import type { BackendTriggeredAlert } from '../types';
import { getParameterIcon, getParameterLabel, getParameterUnit } from '../utils/weatherUtils';

const CurrentState: React.FC = () => {
  const [triggeredAlerts, setTriggeredAlerts] = useState<TriggeredAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [limit, setLimit] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const convertBackendTriggeredAlert = (backendAlert: BackendTriggeredAlert): TriggeredAlert => {
    // Add null checks to handle cases where alertId might be null
    if (!backendAlert.alertId) {
      throw new Error('Alert ID is missing from triggered alert data');
    }

    return {
      id: backendAlert._id,
      location: backendAlert.alertId.locationText || 'Unknown Location',
      parameter: backendAlert.alertData.parameter,
      threshold: backendAlert.alertData.threshold,
      operator: backendAlert.alertData.operator === '>' || backendAlert.alertData.operator === '>=' ? 'above' : 'below',
      currentValue: backendAlert.alertData.currentValue,
      triggeredAt: new Date(backendAlert.dateTriggered).toLocaleString(),
      severity: 'medium' // Default severity for display consistency
    };
  };

  const fetchWithLimit = async (limitValue: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Build URL with limit parameter
      let url: string;
      if (limitValue === 'all') {
        url = 'http://localhost:3001/api/triggered-alerts';
      } else {
        url = `http://localhost:3001/api/triggered-alerts/recent?limit=${limitValue}`;
      }
      
      console.log('Fetching URL:', url); // Debug log
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const backendTriggeredAlerts: BackendTriggeredAlert[] = await response.json();
      console.log('Received alerts:', backendTriggeredAlerts.length); // Debug log
      
      // Convert and sort by most recent first (using dateTriggered)
      const convertedAlerts: TriggeredAlert[] = backendTriggeredAlerts
        .map(alert => {
          try {
            return convertBackendTriggeredAlert(alert);
          } catch (error) {
            console.warn('Failed to convert alert:', error);
            return null;
          }
        })
        .filter((alert): alert is TriggeredAlert => alert !== null) // Filter out null alerts
        .sort((a, b) => new Date(b.triggeredAt).getTime() - new Date(a.triggeredAt).getTime());
      
      console.log('Converted alerts:', convertedAlerts.length); // Debug log
      
      setTriggeredAlerts(convertedAlerts);
      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      console.error('Error fetching triggered alerts:', error);
      setError('Failed to fetch triggered alerts from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Initial load with limit 20'); // Debug log
    fetchWithLimit('20'); // Use default limit of 20 for initial load
  }, []);

  const handleLimitChange = (e: React.FormEvent) => {
    e.preventDefault();
    const inputValue = inputRef.current?.value || '';
    if (inputValue.trim()) {
      console.log('Fetching with limit:', inputValue); // Debug log
      fetchWithLimit(inputValue);
      setLimit(''); // Clear the input after applying
    }
  };

  const handleShowAll = () => {
    console.log('Fetching all alerts'); // Debug log
    fetchWithLimit('all');
    setLimit(''); // Clear the input after showing all
  };

  const getAlertColor = () => {
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };

  const getOperatorLabel = (operator: string) => {
    switch (operator) {
      case 'above':
        return 'above';
      case 'below':
        return 'below';
      default:
        return operator;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading current alert status...</p>
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
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">Error: {error}</p>
              <button
                onClick={() => fetchWithLimit('20')} // Retry with default limit
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
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Current Alert Status</h2>
            <div className="text-sm text-gray-500">
              Last updated: {lastUpdated}
            </div>
          </div>

          {/* Modern Controls - Detached Under Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <label htmlFor="limit" className="text-sm font-semibold text-gray-700">Show:</label>
                  <input
                    id="limit"
                    type="number"
                    value={limit}
                    onChange={(e) => setLimit(e.target.value)}
                    placeholder="0"
                    min="1"
                    className="w-20 h-10 px-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white"
                    disabled={loading}
                    ref={inputRef}
                  />
                  <button
                    onClick={handleLimitChange}
                    disabled={loading || !limit.trim()}
                    className="h-10 px-6 bg-blue-500 text-white rounded-xl text-sm font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95"
                  >
                    {loading ? '...' : 'Apply'}
                  </button>
                  <button
                    onClick={handleShowAll}
                    disabled={loading}
                    className="h-10 px-6 bg-gray-500 text-white rounded-xl text-sm font-semibold hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95"
                  >
                    Show All
                  </button>
                </div>
              </div>

              {/* Active Alerts Summary - Same Line */}
              {triggeredAlerts.length > 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-2">
                        <span className="text-red-600 text-xs">⚠️</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Active Alerts</span>
                      </div>
                    </div>
                    <div className="text-right ml-3">
                      <div className="text-xl font-bold text-gray-900">{triggeredAlerts.length}</div>
                      <div className="text-xs text-gray-500">triggered</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {triggeredAlerts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">All Clear</h3>
              <p className="text-gray-600">No alerts are currently triggered.</p>
              <p className="text-sm text-gray-500 mt-2">System is monitoring all active alerts.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Individual Alert Details */}
              {triggeredAlerts.map((alert, index) => (
                <div
                  key={alert.id}
                  className={`border rounded-lg p-4 ${getAlertColor()}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="mr-2">{getParameterIcon(alert.parameter)}</span>
                        <h3 className="font-semibold capitalize">{alert.location}</h3>
                        {index === 0 && (
                          <span className="ml-2 px-2 py-1 rounded text-xs font-medium bg-blue-500 text-white">
                            MOST RECENT
                          </span>
                        )}
                      </div>
                      <p className="text-sm mb-1">
                        {getParameterLabel(alert.parameter)} is {getOperatorLabel(alert.operator)} {alert.threshold} {getParameterUnit(alert.parameter)}
                      </p>
                      <p className="text-sm font-medium">
                        Current value: {alert.currentValue} {getParameterUnit(alert.parameter)}
                      </p>
                      <p className="text-xs opacity-75 mt-1">
                        Triggered at: {alert.triggeredAt}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        {alert.currentValue}
                      </div>
                      <div className="text-xs opacity-75">
                        vs {alert.threshold}
                      </div>
                      <div className="text-xs opacity-75 mt-1">
                        {getParameterUnit(alert.parameter)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Refresh Button */}
          <div className="mt-6 text-center">
            <button
              onClick={() => fetchWithLimit('20')} // Refresh with default limit
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Refresh Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentState;
