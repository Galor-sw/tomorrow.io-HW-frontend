export const getParameterIcon = (parameter: string) => {
  switch (parameter) {
    case 'temperature': return '🌡️';
    case 'temperatureApparent': return '🌡️';
    case 'humidity': return '💧';
    case 'windSpeed': return '💨';
    case 'windDirection': return '🧭';
    case 'windGust': return '💨';
    case 'pressureSurfaceLevel': return '📊';
    case 'rainIntensity': return '🌧️';
    case 'snowIntensity': return '❄️';
    case 'sleetIntensity': return '🌨️';
    case 'freezingRainIntensity': return '🧊';
    case 'precipitationProbability': return '☔';
    case 'dewPoint': return '💧';
    case 'cloudCover': return '☁️';
    case 'cloudBase': return '☁️';
    case 'cloudCeiling': return '☁️';
    case 'visibility': return '👁️';
    case 'uvIndex': return '☀️';
    case 'uvHealthConcern': return '⚠️';
    case 'weatherCode': return '🌤️';
    default: return '📋';
  }
};

export const getParameterUnit = (parameter: string) => {
  switch (parameter) {
    case 'temperature':
    case 'temperatureApparent':
    case 'dewPoint':
      return '°C';
    case 'humidity':
    case 'precipitationProbability':
    case 'cloudCover':
      return '%';
    case 'windSpeed':
    case 'windGust':
      return 'km/h';
    case 'windDirection':
      return '°';
    case 'pressureSurfaceLevel':
      return 'hPa';
    case 'rainIntensity':
    case 'snowIntensity':
    case 'sleetIntensity':
    case 'freezingRainIntensity':
      return 'mm/h';
    case 'cloudBase':
    case 'cloudCeiling':
    case 'visibility':
      return 'm';
    case 'uvIndex':
    case 'uvHealthConcern':
    case 'weatherCode':
      return '';
    default: return '';
  }
};

export const getParameterLabel = (parameter: string) => {
  switch (parameter) {
    case 'temperature': return 'Temperature (°C)';
    case 'temperatureApparent': return 'Apparent Temperature (°C)';
    case 'humidity': return 'Humidity (%)';
    case 'windSpeed': return 'Wind Speed (km/h)';
    case 'windDirection': return 'Wind Direction (°)';
    case 'windGust': return 'Wind Gust (km/h)';
    case 'pressureSurfaceLevel': return 'Surface Pressure (hPa)';
    case 'rainIntensity': return 'Rain Intensity (mm/h)';
    case 'snowIntensity': return 'Snow Intensity (mm/h)';
    case 'sleetIntensity': return 'Sleet Intensity (mm/h)';
    case 'freezingRainIntensity': return 'Freezing Rain (mm/h)';
    case 'precipitationProbability': return 'Precipitation Probability (%)';
    case 'dewPoint': return 'Dew Point (°C)';
    case 'cloudCover': return 'Cloud Cover (%)';
    case 'cloudBase': return 'Cloud Base (m)';
    case 'cloudCeiling': return 'Cloud Ceiling (m)';
    case 'visibility': return 'Visibility (m)';
    case 'uvIndex': return 'UV Index';
    case 'uvHealthConcern': return 'UV Health Concern';
    case 'weatherCode': return 'Weather Code';
    default: return parameter;
  }
};

export const getOperatorLabel = (operator: string) => {
  switch (operator) {
    case '>': return 'Greater than';
    case '>=': return 'Greater than or equal to';
    case '<': return 'Less than';
    case '<=': return 'Less than or equal to';
    case '=': return 'Equal to';
    case '!=': return 'Not equal to';
    default: return operator;
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'triggered': return 'bg-red-100 text-red-800';
    case 'not_triggered': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'triggered': return '🚨';
    case 'not_triggered': return '✅';
    default: return '⚪';
  }
};
