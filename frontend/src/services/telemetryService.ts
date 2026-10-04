// Time-Series Telemetry Store (TimescaleDB / Redis Simulation)
// Keeps high-frequency sensor readings separate from relational entities

export interface TelemetryReading {
  id: string;
  sensorId: string;
  roomId: string;
  metric: 'temperature' | 'vibration' | 'current' | 'water_pressure' | 'water_level';
  value: number;
  unit: string;
  timestamp: string;
}

class TelemetryStore {
  private seriesBuffer: TelemetryReading[] = [];
  private maxBufferLength = 200;

  constructor() {
    this.seedInitialTelemetry();
  }

  private seedInitialTelemetry() {
    const metrics: ('temperature' | 'vibration' | 'current' | 'water_pressure')[] = [
      'temperature',
      'vibration',
      'current',
      'water_pressure',
    ];
    const now = Date.now();

    for (let i = 0; i < 50; i++) {
      const roomNum = ['101', '104', '201', '204', '302'][i % 5];
      const metric = metrics[i % 4];
      const baseVal =
        metric === 'temperature' ? 24 : metric === 'vibration' ? 1.5 : metric === 'current' ? 6.0 : 42;

      this.seriesBuffer.push({
        id: `TEL-${now - i * 5000}`,
        sensorId: `SENS-${metric.toUpperCase()}-${roomNum}`,
        roomId: roomNum,
        metric,
        value: parseFloat((baseVal + (Math.random() * 2 - 1)).toFixed(2)),
        unit: metric === 'temperature' ? '°C' : metric === 'vibration' ? 'RMS' : metric === 'current' ? 'A' : 'PSI',
        timestamp: new Date(now - i * 5000).toISOString(),
      });
    }
  }

  addReading(reading: Omit<TelemetryReading, 'id'>): TelemetryReading {
    const item: TelemetryReading = {
      ...reading,
      id: `TEL-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    };
    this.seriesBuffer.unshift(item);
    if (this.seriesBuffer.length > this.maxBufferLength) {
      this.seriesBuffer.pop();
    }
    return item;
  }

  getReadingsByRoom(roomId: string): TelemetryReading[] {
    return this.seriesBuffer.filter(t => t.roomId === roomId);
  }

  getLatestReadings(limit = 20): TelemetryReading[] {
    return this.seriesBuffer.slice(0, limit);
  }
}

export const telemetryStore = new TelemetryStore();
