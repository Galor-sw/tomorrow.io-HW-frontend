import React from 'react';
// eslint-disable-next-line no-unused-vars
import type { Alert, AlertListProps, ExtendedAlertListProps } from '../types';
import { getParameterIcon, getParameterLabel, getParameterUnit, getStatusColor, getStatusIcon } from '../utils/weatherUtils';

const AlertList: React.FC<ExtendedAlertListProps> = (props) => {
  const { alerts, onToggleAlert, onShowDeleteConfirmation } = props;

  if (alerts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="mr-2">📋</span>
          Saved Alerts (0)
        </h2>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-gray-500 text-lg mb-2">No alerts found</p>
          <p className="text-gray-400 text-sm">Create your first weather alert using the form</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <span className="mr-2">📋</span>
        Saved Alerts ({alerts.length})
      </h2>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {alerts.map(alert => (
          <div key={alert.id} className={`border rounded-lg p-4 transition-all duration-200 ${
            alert.status === 'triggered'
              ? 'border-red-200 bg-red-50' 
              : alert.isActive
              ? 'border-green-200 bg-green-50'
              : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">{getParameterIcon(alert.parameter)}</span>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg capitalize">{alert.location}</h3>
                  <p className="text-sm text-gray-600">
                    {getParameterLabel(alert.parameter)} {alert.operator} {alert.threshold} {getParameterUnit(alert.parameter)}
                  </p>
                  {alert.description && (
                    <p className="text-sm text-gray-500 italic">&ldquo;{alert.description}&rdquo;</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Created: {alert.createdAt}</p>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(alert.status || 'unknown')}`}>
                  {getStatusIcon(alert.status || 'unknown')} {alert.status ? alert.status.replace('_', ' ') : 'unknown'}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onToggleAlert(alert.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      alert.isActive
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {alert.isActive ? '🟢 Active' : '⚪ Inactive'}
                  </button>
                  <button
                    onClick={() => onShowDeleteConfirmation(alert.id, alert.location)}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 hover:bg-red-200 transition-colors"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertList;
