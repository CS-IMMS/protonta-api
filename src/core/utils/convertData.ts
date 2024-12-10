const convertBufferData = (bufferData: any): string => {
  // If bufferData is not already a Buffer, convert it to one
  const buffer = Buffer.isBuffer(bufferData)
    ? bufferData
    : Buffer.from(bufferData);

  // Convert the buffer to an ASCII string
  const asciiString = buffer.toString('ascii');
  return asciiString.trim();
};
//TODO: convert data to hour /3600/1000
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
    gaz: Number(dataArray[17]),
    co2: Number(dataArray[18]),
  };
};
const parseSensorDataMonitor = (dataString: string) => {
  const dataArray = dataString.split(',');
  return {
    SeuilHumidity_min: Number(dataArray[1]),
    SeuilHumidity_max: Number(dataArray[2]),
    SeuilTemp_min: Number(dataArray[3]),
    SeuilTemp_max: Number(dataArray[4]),
    SeuilLum_min: Number(dataArray[5]),
    SeuilLum_max: Number(dataArray[6]),
    SeuilPression_min: Number(dataArray[7]),
    SeuilPression_max: Number(dataArray[8]),
    SeuilCo2_min: Number(dataArray[9]),
    SeuilCo2_max: Number(dataArray[10]),

    // Mean values
    MeanTemp: Number(dataArray[11]),
    MeanHumidity: Number(dataArray[12]),
    MeanLum: Number(dataArray[13]),
    MeanPress: Number(dataArray[14]),
    MeanCo2: Number(dataArray[15]),

    // Output states
    S1: Number(dataArray[16]),
    S2: Number(dataArray[17]),
    S3: Number(dataArray[18]),
    S4: Number(dataArray[19]),
    S5: Number(dataArray[20]),
    S6: Number(dataArray[21]),
    S7: Number(dataArray[22]),
    S8: Number(dataArray[23]),
    S9: Number(dataArray[24]),
    S10: Number(dataArray[25]),
    S11: Number(dataArray[26]),
    S12: Number(dataArray[27]),
    S13: Number(dataArray[28]),
    S14: Number(dataArray[29]),
    S15: Number(dataArray[30]),
    S16: Number(dataArray[31]),
    MomentFloraison: Boolean(Number(dataArray[32])),
    a1: Number(dataArray[33]),
    a2: Number(dataArray[34]),
    a3: Number(dataArray[35]),
    a4: Number(dataArray[36]),
    a5: Number(dataArray[37]),
    a6: Number(dataArray[38]),
    a7: Number(dataArray[39]),
    a8: Number(dataArray[40]),
    a9: Number(dataArray[41]),
    a10: Number(dataArray[42]),
    PolStartTime: String(convertMillisecondsToHours(Number(dataArray[43]))),
    PolEndTime: String(convertMillisecondsToHours(Number(dataArray[44]))),
    Periode: convertMillisecondsToMinute(Number(dataArray[45])),
    ManuelAutoS1: Number(dataArray[46]),
    ManuelAutoS2: Number(dataArray[47]),
    ManuelAutoS3: Number(dataArray[48]),
    ManuelAutoS4: Number(dataArray[49]),
    ManuelAutoS5: Number(dataArray[50]),
    ManuelAutoS6: Number(dataArray[51]),
    ManuelAutoS7: Number(dataArray[52]),
    ManuelAutoS8: Number(dataArray[53]),
    ManuelAutoS9: Number(dataArray[54]),
    ManuelAutoS10: Number(dataArray[55]),
    ManuelAutoS11: Number(dataArray[56]),
    ManuelAutoS12: Number(dataArray[57]),
    ManuelAutoS13: Number(dataArray[58]),
    ManuelAutoS14: Number(dataArray[59]),
    ManuelAutoS15: Number(dataArray[60]),
    ManuelAutoS16: Number(dataArray[61]),
    MonitorTime: String(dataArray[62]),
  };
};
const convertMillisecondsToHours = (milliseconds: number): string => {
  const totalHours = Math.floor(milliseconds / (3600 * 1000));
  // const hours12 = totalHours % 12 || 12;
  // const hours = totalHours < 10 ? '0' + totalHours : totalHours;
  return totalHours.toString();
};
const convertMillisecondsToMinute = (milliseconds: number): string => {
  const totalHours = Math.floor(milliseconds / (60 * 1000));
  // const hours12 = totalHours % 12 || 12;
  // const hours = totalHours < 10 ? '0' + totalHours : totalHours;
  return totalHours.toString();
};

const convertTimeToMilliseconds = (time: string): number => {
  // if (time instanceof Date) {
  //   return time.getHours() * 3600 * 1000;
  // }

  const hours = parseInt(time);
  return hours * 3600 * 1000;
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
  convertMillisecondsToHours,
  convertTimeToMilliseconds,
  parseSensorDataCapteur,
  parseSensorDataMonitor
};

