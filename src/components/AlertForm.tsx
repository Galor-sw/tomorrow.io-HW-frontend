import React, { useState } from 'react';
import { AlertFormData } from '../types';
// eslint-disable-next-line no-unused-vars
import type { AlertFormProps } from '../types';
import { getParameterIcon, getParameterLabel, getParameterUnit, getOperatorLabel } from '../utils/weatherUtils';

const AlertForm: React.FC<AlertFormProps> = (props) => {
  const { parameters, parametersLoading, isSubmitting, onSubmit } = props;

  const [formData, setFormData] = useState<AlertFormData>({
    location: '',
    parameter: 'temperature',
    threshold: '',
    operator: '>'
  });

  const OPERATORS = ['>', '>=', '<', '<=', '=', '!='];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.location || !formData.threshold) return;
    
    onSubmit(formData);
    
    setFormData({
      location: '',
      parameter: 'temperature',
      threshold: '',
      operator: '>'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <span className="mr-2">➕</span>
        Create New Alert
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter city name (e.g., London, Paris, Tokyo)..."
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="parameter" className="block text-sm font-medium text-gray-700 mb-1">
            Weather Parameter
          </label>
          <select
            id="parameter"
            value={formData.parameter}
            onChange={(e) => setFormData({ ...formData, parameter: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSubmitting || parametersLoading}
          >
            {parametersLoading ? (
              <option>Loading parameters...</option>
            ) : (
              parameters.map(param => (
                <option key={param} value={param}>
                  {getParameterIcon(param)} {getParameterLabel(param)}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="operator" className="block text-sm font-medium text-gray-700 mb-1">
              Condition
            </label>
            <select
              id="operator"
              value={formData.operator}
              onChange={(e) => setFormData({ ...formData, operator: e.target.value as '>' | '>=' | '<' | '<=' | '=' | '!=' })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSubmitting}
            >
              {OPERATORS.map(operator => (
                <option key={operator} value={operator}>
                  {getOperatorLabel(operator)} ({operator})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="threshold" className="block text-sm font-medium text-gray-700 mb-1">
              Threshold ({getParameterUnit(formData.parameter)})
            </label>
            <input
              type="number"
              id="threshold"
              value={formData.threshold}
              onChange={(e) => setFormData({ ...formData, threshold: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
              required
              disabled={isSubmitting}
              step="0.1"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !formData.location || !formData.threshold || parametersLoading}
          className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Creating Alert...
            </span>
          ) : (
            'Create Alert'
          )}
        </button>
      </form>
    </div>
  );
};

export default AlertForm;
