import React, {useEffect, useState} from 'react';
import {createMonitorSource} from '../monitorSource/monitorSource';

export const Monitor = ({temperatureSource, airPressureSource, humiditySource}) => {
  const [data, setData] = useState(['N/A', 'N/A', 'N/A']);

  useEffect(() => {
    const sub = createMonitorSource([
      temperatureSource,
      airPressureSource,
      humiditySource
    ]).subscribe(value => {
      setData(value);
    });

    return () => sub.unsubscribe();
  }, [temperatureSource, airPressureSource, humiditySource]);

  const [temperature, airPressure, humidity] = data;

  return (
    <div>
      <div>
        Temperature: {temperature}
      </div>
      <div>
        Air Pressure: {airPressure}
      </div>
      <div>
        Humidity: {humidity}
      </div>
    </div>
  )
};
