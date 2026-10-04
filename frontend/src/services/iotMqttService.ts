// Real-time MQTT IoT Telemetry Simulator for ESP32 / Arduino Sensors

export interface MqttSensorMessage {
  topic: string;
  roomId: string;
  sensorType: 'temperature' | 'vibration' | 'current' | 'water_pressure' | 'water_level';
  value: number;
  unit: string;
  timestamp: string;
}

type MqttCallback = (message: MqttSensorMessage) => void;

class MqttBrokerSimulator {
  private subscribers: Map<string, Set<MqttCallback>> = new Map();
  private timer: any = null;

  subscribe(topic: string, callback: MqttCallback) {
    if (!this.subscribers.has(topic)) {
      this.subscribers.set(topic, new Set());
    }
    this.subscribers.get(topic)!.add(callback);

    if (!this.timer) {
      this.startTelemetryStream();
    }
  }

  unsubscribe(topic: string, callback: MqttCallback) {
    if (this.subscribers.has(topic)) {
      this.subscribers.get(topic)!.delete(callback);
    }
  }

  publish(message: MqttSensorMessage) {
    this.subscribers.forEach((callbacks, topic) => {
      if (topic === '#' || topic === message.topic || message.topic.startsWith(topic.replace('#', ''))) {
        callbacks.forEach(cb => cb(message));
      }
    });
  }

  private startTelemetryStream() {
    // Generate live sub-second IoT telemetry pulses
    this.timer = setInterval(() => {
      const roomNum = [101, 102, 103, 104, 201, 204, 302][Math.floor(Math.random() * 7)];
      const isAnomaly = Math.random() < 0.15;

      const message: MqttSensorMessage = {
        topic: `hostel/room/${roomNum}/telemetry`,
        roomId: `${roomNum}`,
        sensorType: 'vibration',
        value: parseFloat((isAnomaly ? 7.5 + Math.random() * 2 : 1.2 + Math.random() * 0.5).toFixed(2)),
        unit: 'RMS',
        timestamp: new Date().toISOString().substring(11, 19),
      };

      this.publish(message);
    }, 2500);
  }
}

export const mqttBroker = new MqttBrokerSimulator();
