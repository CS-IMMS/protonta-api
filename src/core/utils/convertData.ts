import { ISensorDataPost } from 'src/monitor/interfaces/monitor.interface';

const bufferData = {
  type: 'Buffer',
  data: [
    55, 55, 55, 48, 52, 44, 49, 52, 57, 54, 44, 73, 49, 44, 51, 54, 52, 55, 44,
    50, 55, 48, 57, 44, 57, 56, 55, 55, 44, 48, 44, 49, 57, 44, 50, 53, 44, 48,
    44, 50, 52, 44, 48, 44, 48, 44, 48, 44, 48, 44, 48, 44, 48, 44, 48, 44, 49,
    44, 48, 44, 48, 46, 48, 48, 44, 48, 46, 48, 48, 44, 48, 46, 48, 48, 44, 48,
    46, 48, 48, 44, 48, 46, 48, 48, 44, 48, 46, 48, 48, 44, 52, 48, 54, 57, 44,
    50, 48, 53, 50, 44, 50, 56, 48, 48, 56, 44, 57, 50, 49, 55, 44, 48, 13, 10,
  ],
};

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
const parseSensorData = (dataString: string): ISensorDataPost => {
  const dataArray = dataString.split(',');
  console.log(dataArray[0]);
  const date = new Date(new Date().getTime() + Number(dataArray[0]) * 1000);
  console.log(date.toISOString());
  return {
    latest: parseData(dataArray[0]),
    elapsed: parseData(dataArray[1]),
    localName: dataArray[2],
    temperature: Number(dataArray[3]),
    humidity: Number(dataArray[4]),
    pressure: Number(dataArray[5]),
    light_A: Number(dataArray[6]),
    sol: Number(dataArray[7]),
    acc_x: Number(dataArray[8]),
    acc_y: Number(dataArray[9]),
    acc_z: Number(dataArray[10]),
    iaq: Number(dataArray[11]),
    gyro_x: Number(dataArray[12]),
    gyro_y: Number(dataArray[13]),
    gyro_z: Number(dataArray[14]),
    accuracy: Number(dataArray[15]),

    // Threshold values
    SeuilHumidity_min: Number(dataArray[16]),
    SeuilHumidity_max: Number(dataArray[17]),
    SeuilTemp_min: Number(dataArray[18]),
    SeuilTemp_max: Number(dataArray[19]),
    SeuilLum_min: Number(dataArray[20]),
    SeuilLum_max: Number(dataArray[21]),
    SeuilPression_min: Number(dataArray[22]),
    SeuilPression_max: Number(dataArray[23]),
    SeuilCo2_min: Number(dataArray[24]),
    SeuilCo2_max: Number(dataArray[25]),

    // Mean values
    MeanTemp: Number(dataArray[26]),
    MeanHumidity: Number(dataArray[27]),
    MeanLum: Number(dataArray[28]),
    MeanPress: Number(dataArray[29]),
    MeanCo2: Number(dataArray[30]),

    // Output states
    S1: Number(dataArray[31]),
    S2: Number(dataArray[32]),
    S3: Number(dataArray[33]),
    S4: Number(dataArray[34]),
    S5: Number(dataArray[35]),
    S6: Number(dataArray[36]),
    S7: Number(dataArray[37]),
    S8: Number(dataArray[38]),
    S9: Number(dataArray[39]),
    S10: Number(dataArray[40]),
    S11: Number(dataArray[41]),
    S12: Number(dataArray[42]),
    S13: Number(dataArray[43]),
    S14: Number(dataArray[44]),
    S15: Number(dataArray[45]),
    S16: Number(dataArray[46]),

    MomentFloraison: Boolean(Number(dataArray[47])),
    a1: Number(dataArray[48]),
    a2: Number(dataArray[49]),
    a3: Number(dataArray[50]),
    a4: Number(dataArray[51]),
    a5: Number(dataArray[52]),
    a6: Number(dataArray[53]),
    a7: Number(dataArray[54]),
    a8: Number(dataArray[55]),
    a9: Number(dataArray[56]),
    a10: Number(dataArray[57]),
  };
};

interface IMonitorData {
  type: string;
  data: number[];
}

export { convertBufferData, IMonitorData, parseSensorData };
