export interface ISensorDataPost {
  latest: string; // Latest sensor reading timestamp or identifier
  elapsed: string; // Elapsed time since the last reading
  localName: string; // Local name of the sensor/device
  temperature: number; // Temperature value
  humidity: number; // Humidity value
  pressure: number; // Pressure value
  light_A: number; // Ambient light intensity
  sol: number; // Soil moisture or another environmental factor
  acc_x: number; // Accelerometer data along x-axis
  acc_y: number; // Accelerometer data along y-axis
  acc_z: number; // Accelerometer data along z-axis
  iaq: number; // Indoor air quality index
  gyro_x: number; // Gyroscope data along x-axis
  gyro_y: number; // Gyroscope data along y-axis
  gyro_z: number; // Gyroscope data along z-axis
  accuracy: number; // Accuracy level of the sensor data

  // Threshold values
  SeuilHumidity_min: number; // Minimum humidity threshold
  SeuilHumidity_max: number; // Maximum humidity threshold
  SeuilTemp_min: number; // Minimum temperature threshold
  SeuilTemp_max: number; // Maximum temperature threshold
  SeuilLum_min: number; // Minimum light intensity threshold
  SeuilLum_max: number; // Maximum light intensity threshold
  SeuilPression_min: number; // Minimum pressure threshold
  SeuilPression_max: number; // Maximum pressure threshold
  SeuilCo2_min: number; // Minimum CO2 threshold
  SeuilCo2_max: number; // Maximum CO2 threshold

  // Mean values
  MeanTemp: number; // Mean temperature over a period
  MeanHumidity: number; // Mean humidity over a period
  MeanLum: number; // Mean light intensity over a period
  MeanPress: number; // Mean pressure over a period
  MeanCo2: number; // Mean CO2 levels over a period

  // Output states
  S1: number; // Output state for S1 (0 = off, 1 = on)
  S2: number;
  S3: number;
  S4: number;
  S5: number;
  S6: number;
  S7: number;
  S8: number;
  S9: number;
  S10: number;
  S11: number;
  S12: number;
  S13: number;
  S14: number;
  S15: number;
  S16: number;

  MomentFloraison: boolean; // Indicates whether flowering has started
  a1: number; // Output atate for a1 (0 = off, 1 = on)
  a2: number;
  a3: number;
  a4: number;
  a5: number;
  a6: number;
  a7: number;
  a8: number;
  a9: number;
  a10: number;
}

export interface SensorDataGet {
  S0: number; // Command for output 0 (0 = off, 1 = on)
  S1: number; // Command for output 1
  S2: number; // Command for output 2
  S3: number; // Command for output 3
  S4: number; // Command for output 4
  S5: number; // Command for output 5
  S6: number; // Command for output 6
  S7: number; // Command for output 7
  S8: number; // Command for output 8
  S9: number; // Command for output 9
  S10: number; // Command for output 10
  S11: number; // Command for output 11
  S12: number; // Command for output 12
  S13: number; // Command for output 13
  S14: number; // Command for output 14
  S15: number; // Command for output 15

  // Threshold settings
  SeuilHumidity_min: number; // Minimum humidity threshold
  SeuilHumidity_max: number; // Maximum humidity threshold
  SeuilTemp_min: number; // Minimum temperature threshold
  SeuilTemp_max: number; // Maximum temperature threshold
  SeuilLum_min: number; // Minimum light threshold
  SeuilLum_max: number; // Maximum light threshold
  SeuilPression_min: number; // Minimum pressure threshold
  SeuilPression_max: number; // Maximum pressure threshold
  SeuilCo2_min: number; // Minimum CO2 threshold
  SeuilCo2_max: number; // Maximum CO2 threshold

  MomentFloraison: boolean; // Control flowering event
  pollinationStartTime: number; // Start time for pollination in hours (24-hour format)
  pollinationEndTime: number; // End time for pollination in hours (24-hour format)

  // Time synchronization
  year: number; // Year for time synchronization
  month: number; // Month for time synchronization
  day: number; // Day for time synchronization
  hour: number; // Hour for time synchronization
  minute: number; // Minute for time synchronization
  second: number; // Second for time synchronization
}

const dataRecive = {
  S1: { active: '101', inactive: '100' },
  S2: { active: '111', inactive: '110' },
  S3: { active: '121', inactive: '120' },
  S4: { active: '131', inactive: '130' },
  S5: { active: '141', inactive: '140' },
  S6: { active: '151', inactive: '150' },
  S7: { active: '161', inactive: '160' },
  S8: { active: '171', inactive: '170' },
  S9: { active: '181', inactive: '180' },
  S10: { active: '191', inactive: '190' },
  S11: { active: '201', inactive: '200' },
  S12: { deploy: '220', inactive: '222', reactor: '221' },
  S13: { active: '231', inactive: '230' },
  S14: { active: '241', inactive: '240' },
  S15: { active: '251', inactive: '250' },
  126: 'HumMin,HumMax,TemMin,TemMax,LumMin,LumMax,PressMin,PressMax,Co2Min,Co2Max',
  127: 'PolStartTime,PolEndTime,Periode,MomentFloraison',
  300: 'Désactiver manuelAuto S1',
  301: 'Désactiver manuelAuto S2',
  302: 'Désactiver manuelAuto S3',
  303: 'Désactiver manuelAuto S4',
  304: 'Désactiver manuelAuto S5',
  305: 'Désactiver manuelAuto S6',
  306: 'Désactiver manuelAuto S7',
  307: 'Désactiver manuelAuto S8',
  308: 'Désactiver manuelAuto S9',
  309: 'Désactiver manuelAuto S10',
  310: 'Désactiver manuelAuto S11',
  311: 'Désactiver manuelAuto S12',
  313: 'Désactiver manuelAuto S13',
  314: 'Désactiver manuelAuto S14',
  315: 'Désactiver manuelAuto S15',
  316: 'Désactiver manuelAuto S16',
};
