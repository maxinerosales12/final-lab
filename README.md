Use Case Document
Weather Forecast Application

1. API:
  WeatherAPI: http://api.weatherapi.com/v1/forecast.xml
2. Frontend:
  React Native: The frontend is built using React Native, incorporating various components for a user-friendly experience.
3. Backend:
  Node.js with Express: The backend server fetches weather data from WeatherAPI and serves it to the frontend.
User Story:
  As a user, I want to search for the weather forecast of any city so that I can plan my activities accordingly.

Steps:
  Setup Frontend:
Develop the Application:

Search Form:   Include a text input for entering city names.
Display Area:   Show current weather and hourly forecast.
Background:   Use an image background with a semi-transparent overlay for readability.
Components Used:
  TextInput: For user input.
  TouchableOpacity: For the search button.
  ActivityIndicator: To indicate loading.
  FlatList: To display the hourly forecast.
API Integration:
Fetch Weather Data:

Make API calls to http://localhost:5000/weather?location={location} (where localhost:5000 is the backend server URL).
Parse XML responses using react-native-xml2js to extract weather details.
Handle Data:

Use state variables weatherData and hourlyData to manage the weather information.
Handle loading and error states to provide user feedback.
Display Weather Information:
Current Weather:

Show weather icon based on condition (e.g., sunny, cloudy).
Display temperature and wind speed.
Hourly Forecast:

Use a horizontal scrollable list to display hourly data.
Each item includes time, weather icon, temperature, and wind speed.
User Interaction:
Search Feature:
Users enter a city name and trigger a search.
Fetch and display weather data for the entered city.
Provide feedback with loading indicators and error messages.
Styling and Layout:
Background Image:

Use ImageBackground for setting a background image with a semi-transparent overlay.
Layout and Design:

Center content and use margins and font sizes for clarity.
Utilize ScrollView for a vertically scrollable content area.
Implementation Details:
Frontend Code:
Components: Use View, Text, TextInput, TouchableOpacity, ActivityIndicator, and FlatList.
Background: Use ImageBackground with overlay.
API Calls: Fetch data using fetch(), parse XML with parseString() from react-native-xml2js.
Styling: Apply styles using StyleSheet.create().
