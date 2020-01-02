import React, {useEffect, useState} from 'react';
import {EventEmitter} from 'events';
import {startMockDataSource} from './mockDataSource';
import {Monitor} from './Monitor/Monitor';

function App() {
  const [emitters] = useState([
    new EventEmitter(),
    new EventEmitter(),
    new EventEmitter()
  ]);

  useEffect(() => {
    const stopAll = [
      {
        valueRange: [500, 700],
        timeRange: [0, 200]
      },
      {
        valueRange: [900, 1000],
        timeRange: [200, 300]
      },
      {
        valueRange: [1200, 1500],
        timeRange: [500, 5000]
      }
    ].map(({valueRange, timeRange}, index) => startMockDataSource(emitters[index], valueRange, timeRange));

    return () => stopAll.forEach(stop => stop());
  }, [emitters]);

  const [temperature, airPressure, humidity] = emitters;

  return (
    <Monitor temperatureSource={temperature}
             airPressureSource={airPressure}
             humiditySource={humidity}/>
  );
}

export default App;
