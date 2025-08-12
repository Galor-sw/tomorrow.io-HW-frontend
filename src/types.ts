// Weather Data Interfaces
export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  lastUpdated: string;
  coordinates?: {
    lat: number;
    lon: number;
  };
}

export interface LocationData {
  name: string;
  lat: number;
  lon: number;
}

// Tomorrow.io API Response Interface
export interface TomorrowIoWeatherResponse {
  data: {
    time: string;
    values: {
      cloudBase: number;
      cloudCeiling: number;
      cloudCover: number;
      dewPoint: number;
      freezingRainIntensity: number;
      humidity: number;
      precipitationProbability: number;
      pressureSurfaceLevel: number;
      rainIntensity: number;
      sleetIntensity: number;
      snowIntensity: number;
      temperature: number;
      temperatureApparent: number;
      uvHealthConcern: number;
      uvIndex: number;
      visibility: number;
      weatherCode: number;
      windDirection: number;
      windGust: number;
      windSpeed: number;
    };
  };
  location: {
    lat: number;
    lon: number;
    name: string;
    type: string;
  };
}

// Simple Weather Response Interface for Home component
export interface WeatherResponse {
  data: {
    time: string;
    values: {
      temperature: number;
      humidity: number;
      windSpeed: number;
    };
  };
  location: {
    name: string;
  };
}

// Backend Alert Interface
export interface BackendAlert {
  _id: string;
  userId: string;
  locationText: string;
  lat: number;
  lon: number;
  parameter: string;
  operator: string;
  threshold: number;
  description?: string;
  units: string;
  createdAt: string;
  updatedAt: string;
  state: string;
  triggerStatus: {
    status: string;
    date: string;
    _id: string;
  };
}

// Alert Interfaces
export interface Alert {
  id: string;
  location: string;
  parameter: string;
  threshold: number;
  operator: '>' | '>=' | '<' | '<=' | '=' | '!=';
  isActive: boolean;
  createdAt: string;
  description?: string;
  status?: string;
}

export interface TriggeredAlert {
  id: string;
  location: string;
  parameter: string;
  threshold: number;
  operator: 'above' | 'below';
  currentValue: number;
  triggeredAt: string;
  severity: 'low' | 'medium' | 'high';
}

// Backend Triggered Alert Interface
export interface BackendTriggeredAlert {
  _id: string;
  alertId: {
    _id: string;
    userId: string;
    locationText: string;
    lat: number;
    lon: number;
    parameter: string;
    operator: string;
    threshold: number;
    description: string;
    units: string;
    createdAt: string;
  };
  dateTriggered: string;
  alertData: {
    parameter: string;
    operator: string;
    threshold: number;
    currentValue: number;
  };
  sentMessage: {
    email: {
      sent: boolean;
    };
    phone: {
      sent: boolean;
    };
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Navigation Interfaces
export interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

// Form Data Interfaces
export interface AlertFormData {
  location: string;
  parameter: string;
  threshold: string;
  operator: '>' | '>=' | '<' | '<=' | '=' | '!=';
}

export interface ParameterOption {
  value: string;
  label: string;
}

// Component Props Interfaces
export interface AlertFormProps {
  parameters: string[];
  parametersLoading: boolean;
  isSubmitting: boolean;
  onSubmit: (formData: AlertFormData) => void;
}

export interface AlertListProps {
  alerts: Alert[];
  onToggleAlert: (id: string) => void;
  onDeleteAlert: (id: string) => void;
}

export interface ExtendedAlertListProps extends AlertListProps {
  onDeleteAlert: (id: string) => void;
  onShowDeleteConfirmation: (id: string, location: string) => void;
}

export interface DeleteConfirmationState {
  isOpen: boolean;
  alertId: string;
  alertLocation: string;
}

// Popup Interface
export interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error';
  title: string;
  message: string;
  duration?: number;
}

// Popup State Interface
export interface PopupState {
  isOpen: boolean;
  type: 'success' | 'error';
  title: string;
  message: string;
}
