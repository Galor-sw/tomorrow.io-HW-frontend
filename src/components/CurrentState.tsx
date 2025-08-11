import React, { useState, useEffect, useCallback } from 'react';
import type { TriggeredAlert } from '../types';
// eslint-disable-next-line no-unused-vars
import type { BackendTriggeredAlert } from '../types';
import { getParameterIcon, getParameterLabel, getParameterUnit } from '../utils/weatherUtils';

const CurrentState: React.FC = () => {
  const [triggeredAlerts, setTriggeredAlerts] = useState<TriggeredAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const convertBackendTriggeredAlert = (backendAlert: BackendTriggeredAlert): TriggeredAlert => {
    return {
      id: backendAlert._id,
      location: backendAlert.alertId.locationText,
      parameter: backendAlert.alertData.parameter,
      threshold: backendAlert.alertData.threshold,
      operator: backendAlert.alertData.operator === '>' || backendAlert.alertData.operator === '>=' ? 'above' : 'below',
      currentValue: backendAlert.alertData.currentValue,
      triggeredAt: new Date(backendAlert.dateTriggered).toLocaleString(),
      severity: 'medium' // Default severity for display consistency
    };
  };

  const fetchTriggeredAlerts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch triggered alerts from backend using the correct endpoint
      const response = await fetch('http://localhost:3001/api/triggered-alerts');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const backendTriggeredAlerts: BackendTriggeredAlert[] = await response.json();
      
      // Convert and sort by most recent first (using dateTriggered)
      const convertedAlerts: TriggeredAlert[] = backendTriggeredAlerts
        .map(convertBackendTriggeredAlert)
        .sort((a, b) => new Date(b.triggeredAt).getTime() - new Date(a.triggeredAt).getTime());
      
      setTriggeredAlerts(convertedAlerts);
      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      console.error('Error fetching triggered alerts:', error);
      setError('Failed to fetch triggered alerts from server');
      
      // Fallback to mock data for development
      const mockAlerts: TriggeredAlert[] = [
        {
          id: '1',
          location: 'Tel Aviv',
          parameter: 'temperature',
          threshold: 30,
          operator: 'above',
          currentValue: 32,
          triggeredAt: new Date().toLocaleString(),
          severity: 'medium'
        },
        {
          id: '2',
          location: 'Jerusalem',
          parameter: 'humidity',
          threshold: 80,
          operator: 'above',
          currentValue: 85,
          triggeredAt: new Date(Date.now() - 300000).toLocaleString(), // 5 minutes ago
          severity: 'medium'
        }
      ];
      
      setTriggeredAlerts(mockAlerts);
      setLastUpdated(new Date().toLocaleString());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTriggeredAlerts();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchTriggeredAlerts, 30000);
    
    return () => clearInterval(interval);
  }, [fetchTriggeredAlerts]);

  const getAlertColor = () => {
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };

  const getAlertIcon = () => {
    return '🔵';
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
                onClick={fetchTriggeredAlerts}
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

          {triggeredAlerts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">All Clear</h3>
              <p className="text-gray-600">No alerts are currently triggered.</p>
              <p className="text-sm text-gray-500 mt-2">System is monitoring all active alerts.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <span className="text-blue-600 text-lg mr-2">⚠️</span>
                  <span className="text-blue-800 font-medium">
                    {triggeredAlerts.length} alert{triggeredAlerts.length !== 1 ? 's' : ''} currently triggered
                  </span>
                </div>
              </div>

              {triggeredAlerts.map((alert, index) => (
                <div
                  key={alert.id}
                  className={`border rounded-lg p-4 ${getAlertColor()}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="mr-2">{getAlertIcon()}</span>
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
              onClick={fetchTriggeredAlerts}
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
