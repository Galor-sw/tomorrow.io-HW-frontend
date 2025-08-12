import React, { useState, useEffect, useCallback } from 'react';
import { Alert } from '../types';
// eslint-disable-next-line no-unused-vars
import type { AlertFormData, PopupState, DeleteConfirmationState } from '../types';
import Popup from './Popup';
import AlertForm from './AlertForm';
import AlertList from './AlertList';

const Alerts: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [parameters, setParameters] = useState<string[]>([]);
  const [parametersLoading, setParametersLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [popup, setPopup] = useState<PopupState>({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });

  const [deleteConfirmation, setDeleteConfirmation] = useState<DeleteConfirmationState>({
    isOpen: false,
    alertId: '',
    alertLocation: ''
  });

  const showPopup = (type: 'success' | 'error', title: string, message: string) => {
    setPopup({ isOpen: true, type, title, message });
  };

  const closePopup = () => {
    setPopup(prev => ({ ...prev, isOpen: false }));
  };

  const showDeleteConfirmation = (alertId: string, alertLocation: string) => {
    setDeleteConfirmation({
      isOpen: true,
      alertId,
      alertLocation
    });
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmation({
      isOpen: false,
      alertId: '',
      alertLocation: ''
    });
  };

  const fetchParameters = async () => {
    try {
      setParametersLoading(true);
      const response = await fetch('http://localhost:3001/api/parameters/names');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const parameterNames: string[] = await response.json();
      setParameters(parameterNames);
    } catch (error) {
      console.error('Error fetching parameters:', error);
      setParameters(['temperature', 'humidity', 'windSpeed', 'pressure']);
    } finally {
      setParametersLoading(false);
    }
  };

  const convertBackendAlert = (backendAlert: any): Alert => {
    return {
      id: backendAlert._id,
      location: backendAlert.locationText,
      parameter: backendAlert.parameter,
      threshold: backendAlert.threshold,
      operator: backendAlert.operator,
      isActive: backendAlert.state !== 'deleted',
      createdAt: new Date(backendAlert.createdAt).toLocaleString(),
      description: backendAlert.description,
      status: backendAlert.triggerStatus.status
    };
  };

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:3001/api/alerts');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const backendAlerts = await response.json();
      const convertedAlerts: Alert[] = backendAlerts.map(convertBackendAlert);
      setAlerts(convertedAlerts);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      setError('Failed to fetch alerts from server');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchParameters();
    fetchAlerts();
  }, [fetchAlerts]);

  const handleCreateAlert = async (formData: AlertFormData) => {
    setIsSubmitting(true);

    try {
      const requestBody = {
        userId: "6898cd97055022e2cea0a786", // right now we are using a hardcoded user id, but we should change it to the user id of the current user when we implement authentication
        locationText: formData.location.toLowerCase(),
        parameter: formData.parameter,
        operator: formData.operator,
        threshold: parseFloat(formData.threshold),
        description: `${formData.parameter} ${formData.operator} ${formData.threshold}`,
        units: "metric"
      };

      const response = await fetch('http://localhost:3001/api/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (response.status === 201) {
        showPopup(
          'success',
          'Alert Created Successfully!',
          `Weather alert for ${formData.location} has been created successfully.`
        );
        await fetchAlerts();
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error creating alert:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create alert';
      showPopup('error', 'Failed to Create Alert', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleAlert = async (id: string) => {
    try {
      setAlerts(alerts.map(alert => 
        alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
      ));
    } catch (error) {
      console.error('Error updating alert:', error);
      setError('Failed to update alert');
    }
  };

  const handleDeleteAlert = async (id: string) => {
    try {
      const response = await fetch('http://localhost:3001/api/alerts', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: id })
      });

      if (response.ok) {
        const result = await response.json();
        showPopup('success', 'Alert Deleted', result.message);
        await fetchAlerts(); // Refresh the alerts list
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting alert:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete alert';
      showPopup('error', 'Failed to Delete Alert', errorMessage);
    }
  };

  const activeAlertsCount = alerts.filter(alert => alert.isActive).length;
  const triggeredAlertsCount = alerts.filter(alert => alert.status === 'triggered').length;

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading alerts...</p>
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
                onClick={fetchAlerts}
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
    <>
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Weather Alerts</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                {activeAlertsCount} Active Alerts
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                {triggeredAlertsCount} Triggered Alerts
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                {alerts.length - activeAlertsCount} Inactive Alerts
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AlertForm
              parameters={parameters}
              parametersLoading={parametersLoading}
              isSubmitting={isSubmitting}
              onSubmit={handleCreateAlert}
            />
            <AlertList
              alerts={alerts}
              onToggleAlert={handleToggleAlert}
              onDeleteAlert={handleDeleteAlert}
              onShowDeleteConfirmation={showDeleteConfirmation}
            />
          </div>
        </div>
      </div>

      {/* Success/Error Popup */}
      <Popup
        isOpen={popup.isOpen}
        onClose={closePopup}
        type={popup.type}
        title={popup.title}
        message={popup.message}
      />

      {/* Delete Confirmation Popup */}
      {deleteConfirmation.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-red-600 text-lg">⚠️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Alert</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the alert for <strong>{deleteConfirmation.alertLocation}</strong>? 
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeDeleteConfirmation}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDeleteAlert(deleteConfirmation.alertId);
                  closeDeleteConfirmation();
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Alerts;
