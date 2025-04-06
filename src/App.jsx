import React, { useState, useEffect } from 'react';
import './App.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import 'bootstrap/dist/css/bootstrap.min.css';
import imgNotFound from './icons/no-result.svg';
import LocationOnIcon from '@mui/icons-material/LocationOn'; // أيقونة للخطأ
export const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    getLocation();
  }, []);

  // 📍 جلب الموقع الجغرافي
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          fetchWeather(`${lat},${lon}`);
        },
        () => {
          console.error("Couldn't get location. Please enter a city manually.");
          setError(true);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setError(true);
    }
  };

  // 🔥 جلب بيانات الطقس
  const fetchWeather = async (query) => {
    try {
      const response = await fetch(
        `http://api.weatherapi.com/v1/forecast.json?key=5990decd0fce447d85d134026232008&q=${query}&days=5`
      );
      const data = await response.json();

      if (data.error) {
        setError(true);
        setWeatherData(null);
      } else {
        setError(false);
        setWeatherData(data);
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError(true);
      setWeatherData(null);
    }
  };

  // ✨ البحث عن مدينة بالاسم
  const handleSearch = (event) => {
    if (event.key === 'Enter') {
      fetchWeather(event.target.value);
    }
  };

  return (
    <div className='container'>
      <div className='row'>
        <div className='col-lg-6 col-md-6 col-sm-12 weather position-relative p-5'>
          {/* 🔍 صندوق البحث مع أيقونة الموقع */}
          <Box className='search-box w-100'>
            <TextField
              fullWidth
              placeholder='Enter city...'
              variant='filled'
              onKeyPress={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon style={{ color: '#fff' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position='end'>
                    <LocationOnIcon
                      style={{ color: '#fff', cursor: 'pointer' }}
                      onClick={getLocation}
                    />
                  </InputAdornment>
                ),
                style: { color: '#fff' }
              }}
            />
          </Box>

          {/* 🌍 عرض بيانات الطقس */}
          {error ? (
            <div className='text-center mt-4'>
              <img src={imgNotFound} alt='Not Found' style={{ width: '100px' }} />
              <p style={{ color: 'white' }}>City not found</p>
            </div>
          ) : (
            weatherData && (
              <>
                <div className='text-center mt-4'>
                  <img src={weatherData.current.condition.icon} alt='' style={{ width: '100px' }} />
                  <h2 style={{ color: 'white' }}>{weatherData.location.name}</h2>
                  <p style={{ color: 'white' }}>{weatherData.current.temp_c}°C</p>
                </div>
                <hr style={{ background: 'white', color: 'white' }} />

                {/* 📅 توقعات الطقس لـ 5 أيام */}
                <div className='row text-center mt-4'>
                  {weatherData.forecast.forecastday.map((day, index) => (
                    <div key={index} className='col-12 col-md-4 mb-3'>
                      <p style={{ color: 'white', fontWeight: 'bold' }}>
                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' })}
                      </p>
                      <img src={day.day.condition.icon} alt='' style={{ width: '60px' }} />
                      <p style={{ color: 'white' }}>{day.day.avgtemp_c}°C</p>
                    </div>
                  ))}
                </div>
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
};