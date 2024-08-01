import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, ActivityIndicator, ScrollView, Image, Dimensions, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import { parseString } from 'react-native-xml2js';
import { MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const weatherIcons = {
  sunny: '☀️',
  partlyCloudy: '⛅️',
  cloudy: '☁️',
  rainy: '🌧️',
  snowy: '❄️',
  windy: '🌬️',
  foggy: '🌁',
  drizzly: '🌦️',
  hail: '🌨️',
  thunderstorm: '⛈️',
  tornado: '🌪️',
  dusty: '🌫️',
};

const getSimpleCondition = (condition) => {
  const conditionLower = condition.toLowerCase();
  if (conditionLower.includes('sunny')) return 'Sunny';
  if (conditionLower.includes('partly cloudy')) return 'Partly Cloudy';
  if (conditionLower.includes('cloudy')) return 'Cloudy';
  if (conditionLower.includes('rain')) return 'Rainy';
  if (conditionLower.includes('snow')) return 'Snowy';
  if (conditionLower.includes('wind')) return 'Windy';
  if (conditionLower.includes('mist') || conditionLower.includes('fog')) return 'Foggy';
  if (conditionLower.includes('drizzle')) return 'Drizzly';
  if (conditionLower.includes('hail')) return 'Hail';
  if (conditionLower.includes('thunderstorm')) return 'Thunderstorm';
  if (conditionLower.includes('tornado')) return 'Tornado';
  if (conditionLower.includes('dust')) return 'Dusty';
  return 'Unknown';
};

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('London');
  const [search, setSearch] = useState('London');

  const fetchWeather = (location) => {
    setLoading(true);
    // Replace 'http://localhost:5000' with your backend server URL
    fetch(`http://localhost:5000/weather?location=${location}`)
      .then(response => response.text())
      .then(text => {
        parseString(text, { explicitArray: false }, (err, result) => {
          if (err) {
            console.error('XML parse error:', err);
            setError(`XML parse error: ${err.message}`);
          } else {
            console.log('Parsed data:', result);
            setWeatherData(result.root);
            setHourlyData(result.root.forecast.forecastday.hour);
            setError(null);
          }
          setLoading(false);
        });
      })
      .catch((error) => {
        console.error('Fetch error:', error);
        setError(`Fetch error: ${error.message}`);
        setLoading(false);
      });
  };
  
  useEffect(() => {
    fetchWeather(query);
  }, [query]);

  const handleSearch = () => {
    setQuery(search);
  };

  const renderWeatherIcon = (condition) => {
    const simpleCondition = getSimpleCondition(condition);
    return weatherIcons[simpleCondition.toLowerCase()] || '🌫️'; // Default to fog if condition is unknown
  };

  const renderHourlyItem = ({ item }) => (
    <View style={styles.hourlyItem}>
      <Text style={styles.hour}>{item.time.split(' ')[1]}</Text>
      <Text style={styles.hourlyIcon}>{renderWeatherIcon(item.condition.text)}</Text>
      <Text style={styles.hourlyInfo}>Temp: {item.temp_c}°C</Text>
      <Text style={styles.hourlyInfo}>Wind: {item.wind_kph} kph</Text>
    </View>
  );

  return (
    <ImageBackground source={require('./assets/w2.jpg')} style={styles.backgroundImage}>
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.innerContainer}>
          {weatherData && (
            <Text style={styles.title}>Weather in {weatherData.location.name}</Text>
          )}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter location"
              value={search}
              onChangeText={setSearch}
            />
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <MaterialIcons name="search" size={24} color="white" />
            </TouchableOpacity>
          </View>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : weatherData ? (
            <>
              <Text style={styles.weatherIcon}>{renderWeatherIcon(weatherData.current.condition.text)}</Text>
              <Text style={styles.info}>Temperature: {weatherData.current.temp_c}°C</Text>
              <Text style={styles.info}>Condition: {getSimpleCondition(weatherData.current.condition.text)}</Text>
              <Text style={styles.info}>Wind Speed: {weatherData.current.wind_kph} kph</Text>
              <Text style={styles.hourlyTitle}>Hourly Forecast</Text>
              <FlatList
                data={hourlyData}
                renderItem={renderHourlyItem}
                keyExtractor={(item) => item.time}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.hourlyList}
              />
            </>
          ) : null}
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width,
    height,
    position: 'absolute',
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width,
    height,
    backgroundColor: 'rgba(3, 9, 6, 0.5)', // Semi-transparent overlay for blur effect
  },
  innerContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 8,
    marginRight: 10,
    width: '70%',
    backgroundColor: 'white',
    borderRadius: 5,
  },
  searchButton: {
    backgroundColor: '#007BFF',
    padding: 7,
    borderRadius: 55
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    color: 'white',
    marginTop: 70,
  },
  weatherIcon: {
    fontSize: 50,
    marginBottom: 10,
    textAlign: 'center',
    marginTop: 40,
  },
  info: {
    fontSize: 19,
    marginBottom: 10,
    textAlign: 'center',
    color: 'white',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
  hourlyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 50,
    marginBottom: 10,
    textAlign: 'center',
    color: 'white',
  },
  hourlyList: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  hourlyItem: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  hour: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  hourlyIcon: {
    fontSize: 30,
    marginBottom: 5,
  },
  hourlyInfo: {
    fontSize: 14,
    color: 'white',
  },
});

export default App;
