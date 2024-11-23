const convertBufferData = (bufferData: any): string => {
  // If bufferData is not already a Buffer, convert it to one
  const buffer = Buffer.isBuffer(bufferData)
    ? bufferData
    : Buffer.from(bufferData);

  // Convert the buffer to an ASCII string
  const asciiString = buffer.toString('ascii');
  return asciiString.trim();
};
const parseData = (data: string) => {
  const date = new Date(new Date().getTime() + Number(data) * 1000);
  return date.toISOString();
};
const parseSensorDataCapteur = (dataString: string) => {
  const dataArray = dataString.split(',');
  return {
    latest: parseData(dataArray[1]),
    elapsed: parseData(dataArray[2]),
    localName: dataArray[3],
    temperature: Number(dataArray[4]),
    humidity: Number(dataArray[5]),
    pressure: Number(dataArray[6]),
    light_A: Number(dataArray[7]),
    sol: Number(dataArray[8]),
    acc_x: Number(dataArray[9]),
    acc_y: Number(dataArray[10]),
    acc_z: Number(dataArray[11]),
    iaq: Number(dataArray[12]),
    gyro_x: Number(dataArray[13]),
    gyro_y: Number(dataArray[14]),
    gyro_z: Number(dataArray[15]),
    accuracy: Number(dataArray[16]),
  };
};
const parseSensorDataMonitor = (dataString: string) => {
  const dataArray = dataString.split(',');
  return {
    SeuilHumidity_min: Number(dataArray[1]),
    SeuilHumidity_max: Number(dataArray[2]),
    SeuilTemp_min: Number(dataArray[2]),
    SeuilTemp_max: Number(dataArray[3]),
    SeuilLum_min: Number(dataArray[4]),
    SeuilLum_max: Number(dataArray[5]),
    SeuilPression_min: Number(dataArray[6]),
    SeuilPression_max: Number(dataArray[7]),
    SeuilCo2_min: Number(dataArray[8]),
    SeuilCo2_max: Number(dataArray[9]),

    // Mean values
    MeanTemp: Number(dataArray[10]),
    MeanHumidity: Number(dataArray[11]),
    MeanLum: Number(dataArray[12]),
    MeanPress: Number(dataArray[13]),
    MeanCo2: Number(dataArray[14]),

    // Output states
    S1: Number(dataArray[15]),
    S2: Number(dataArray[16]),
    S3: Number(dataArray[17]),
    S4: Number(dataArray[18]),
    S5: Number(dataArray[19]),
    S6: Number(dataArray[20]),
    S7: Number(dataArray[21]),
    S8: Number(dataArray[22]),
    S9: Number(dataArray[23]),
    S10: Number(dataArray[24]),
    S11: Number(dataArray[25]),
    S12: Number(dataArray[26]),
    S13: Number(dataArray[27]),
    S14: Number(dataArray[28]),
    S15: Number(dataArray[29]),
    S16: Number(dataArray[30]),
    MomentFloraison: Boolean(Number(dataArray[31])),
    a1: Number(dataArray[32]),
    a2: Number(dataArray[33]),
    a3: Number(dataArray[34]),
    a4: Number(dataArray[35]),
    a5: Number(dataArray[36]),
    a6: Number(dataArray[37]),
    a7: Number(dataArray[38]),
    a8: Number(dataArray[39]),
    a9: Number(dataArray[40]),
    a10: Number(dataArray[41]),
    pollinationStartTime: parseData(dataArray[42]),
    pollinationEndTime: parseData(dataArray[43]),
    PeriodePol: parseData(dataArray[44]),
    ManuelAutoS1: Number(dataArray[45]),
    ManuelAutoS2: Number(dataArray[46]),
    ManuelAutoS3: Number(dataArray[47]),
    ManuelAutoS4: Number(dataArray[48]),
    ManuelAutoS5: Number(dataArray[49]),
    ManuelAutoS6: Number(dataArray[50]),
    ManuelAutoS7: Number(dataArray[51]),
    ManuelAutoS8: Number(dataArray[52]),
    ManuelAutoS9: Number(dataArray[53]),
    ManuelAutoS10: Number(dataArray[54]),
    ManuelAutoS11: Number(dataArray[55]),
    ManuelAutoS12: Number(dataArray[56]),
    ManuelAutoS13: Number(dataArray[57]),
    ManuelAutoS14: Number(dataArray[58]),
    ManuelAutoS15: Number(dataArray[59]),
    ManuelAutoS16: Number(dataArray[60]),
    MonitorTime: String(dataArray[61]),
  };
};

interface IMonitorData {
  type: string;
  data: number[];
}
type LogValueType =
  | 'active'
  | 'inactive'
  | 'true'
  | 'false'
  | 'reactor'
  | 0
  | 1
  | boolean;

export {
  IMonitorData,
  LogValueType,
  convertBufferData,
  parseSensorDataCapteur,
  parseSensorDataMonitor
};

