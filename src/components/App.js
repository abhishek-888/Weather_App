import React, { useEffect, useState } from "react";
import { Container } from "@material-ui/core";
import LoadingSpinner from "./LoadingSpinner";
import Weather from "./Weather";


export default function App() {
  const [city, setCity] = useState("Delhi");
  const [currentWeather, setCurrentWeather] = useState({});
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    getWeather(city)
      .then(weather => {
        setCurrentWeather(weather);
      })
  }, [city]);

  useEffect(() => {
    getForecast(city)
      .then(data => {
        setForecast(data);
      })
  }, [city]);

  var sectionStyle = {
    backgroundColor:'gray'
  };

  if (
    (currentWeather && Object.keys(currentWeather).length) ||
    (forecast && Object.keys(forecast).length)
  ) {
    return (
        <Container 
      maxWidth="sm"
      style={ sectionStyle }
      >
        <Weather
          city={city}
          currentWeather={currentWeather}
          forecast={forecast}
          setCity={setCity}
        />
      </Container>
    );
  } else {
    return <LoadingSpinner />;
  }
}

function getWeather(city) {
  return fetch(
    `${process.env.REACT_APP_API_URL}/weather/?q=${city}&units=metric&APPID=${process.env.REACT_APP_API_KEY}`
  )
    .then(res => res.json())
    .then(weather => {
      if (Object.entries(weather).length) {
        const mappedData = mapDataToWeatherInterface(weather);
        return mappedData;
      }
    });
}

function getForecast(city) {
  return fetch(
    `${process.env.REACT_APP_API_URL}/forecast/?q=${city}&units=metric&APPID=${process.env.REACT_APP_API_KEY}`
  )
    .then(res => res.json())
    .then(result => {
      if (Object.entries(result).length) {
        const forecast = [];
        for (let i = 0; i < result.list.length; i += 8) {
          forecast.push(mapDataToWeatherInterface(result.list[i + 4]));
        }
        return forecast;
      }
    });
}

function mapDataToWeatherInterface(data) {
  const mapped = {
    city: data.name,
    country: data.sys.country,
    date: data.dt * 1000,
    humidity: data.main.humidity,
    icon_id: data.weather[0].id,
    temperature: data.main.temp,
    description: data.weather[0].description,
    wind_speed: Math.round(data.wind.speed * 3.6), 
    condition: data.cod
  };

  if (data.dt_txt) {
    mapped.dt_txt = data.dt_txt;
  }

  if (data.weather[0].icon) {
    mapped.icon = data.weather[0].icon;
  }

  if (data.main.temp_min && data.main.temp_max) {
    mapped.max = data.main.temp_max;
    mapped.min = data.main.temp_min;
  }
  Object.keys(mapped).forEach(
    key => mapped[key] === undefined && delete data[key]
  );

  return mapped;
}
