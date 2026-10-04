import React, { useState, useEffect } from 'react';
import { mqttBroker, type MqttSensorMessage } from '../services/iotMqttService';

export interface RoomState3D {
  roomNumber: string;
  floor: number;
  occupancy: number;
  maxCapacity: number;
  status: 'Occupied' | 'Available' | 'Maintenance' | 'Emergency';
  temperature: number;
  electricityKw: number;
  waterPressurePsi: number;
}

const mock3DRooms: RoomState3D[] = [
  { roomNumber: '101', floor: 1, occupancy: 2, maxCapacity: 2, status: 'Occupied', temperature: 23.5, electricityKw: 1.2, waterPressurePsi: 45 },
  { roomNumber: '102', floor: 1, occupancy: 2, maxCapacity: 2, status: 'Occupied', temperature: 24.1, electricityKw: 0.9, waterPressurePsi: 44 },
  { roomNumber: '103', floor: 1, occupancy: 0, maxCapacity: 2, status: 'Available', temperature: 26.0, electricityKw: 0.1, waterPressurePsi: 46 },
  { roomNumber: '104', floor: 1, occupancy: 1, maxCapacity: 2, status: 'Maintenance', temperature: 28.2, electricityKw: 2.8, waterPressurePsi: 22 },
  { roomNumber: '201', floor: 2, occupancy: 2, maxCapacity: 2, status: 'Occupied', temperature: 22.8, electricityKw: 1.5, waterPressurePsi: 42 },
  { roomNumber: '202', floor: 2, occupancy: 2, maxCapacity: 2, status: 'Occupied', temperature: 23.9, electricityKw: 1.1, waterPressurePsi: 43 },
  { roomNumber: '203', floor: 2, occupancy: 2, maxCapacity: 2, status: 'Occupied', temperature: 24.5, electricityKw: 1.3, waterPressurePsi: 41 },
  { roomNumber: '204', floor: 2, occupancy: 2, maxCapacity: 2, status: 'Emergency', temperature: 34.0, electricityKw: 4.2, waterPressurePsi: 10 },
  { roomNumber: '301', floor: 3, occupancy: 2, maxCapacity: 2, status: 'Occupied', temperature: 23.0, electricityKw: 1.0, waterPressurePsi: 40 },
  { roomNumber: '302', floor: 3, occupancy: 2, maxCapacity: 2, status: 'Occupied', temperature: 25.1, electricityKw: 1.7, waterPressurePsi: 38 },
  { roomNumber: '303', floor: 3, occupancy: 0, maxCapacity: 2, status: 'Available', temperature: 25.5, electricityKw: 0.05, waterPressurePsi: 40 },
  { roomNumber: '304', floor: 3, occupancy: 2, maxCapacity: 2, status: 'Occupied', temperature: 23.7, electricityKw: 1.4, waterPressurePsi: 39 },
];

export const DigitalTwin3D: React.FC = () => {
  const [rooms, setRooms] = useState<RoomState3D[]>(mock3DRooms);
  const [selectedFloor, setSelectedFloor] = useState<number>(0);
  const [activeLayer, setActiveLayer] = useState<'occupancy' | 'temperature' | 'electricity' | 'water'>('occupancy');
  const [selectedRoom, setSelectedRoom] = useState<RoomState3D | null>(mock3DRooms[0]);
  const [mqttPulse, setMqttPulse] = useState<string>('Connected to Broker');

  useEffect(() => {
    const handleMqttMessage = (msg: MqttSensorMessage) => {
      setMqttPulse(`MQTT Pulse: ${msg.topic} = ${msg.value} ${msg.unit}`);
      setRooms(prevRooms =>
        prevRooms.map(r => (r.roomNumber === msg.roomId ? { ...r, temperature: parseFloat((r.temperature + (Math.random() * 0.4 - 0.2)).toFixed(1)) } : r))
      );
    };

    mqttBroker.subscribe('#', handleMqttMessage);
    return () => mqttBroker.unsubscribe('#', handleMqttMessage);
  }, []);

  const displayedRooms = selectedFloor === 0 ? rooms : rooms.filter(r => r.floor === selectedFloor);

  const getRoomColor = (room: RoomState3D) => {
    if (room.status === 'Emergency') return '#e53e3e';
    if (room.status === 'Maintenance') return '#ed8936';

    switch (activeLayer) {
      case 'temperature':
        return room.temperature > 27 ? '#fc8181' : room.temperature > 24 ? '#f6ad55' : '#68d391';
      case 'electricity':
        return room.electricityKw > 2.0 ? '#f6ad55' : room.electricityKw > 1.0 ? '#63b3ed' : '#bcee6d';
      case 'water':
        return room.waterPressurePsi < 30 ? '#fc8181' : '#4fd1c5';
      case 'occupancy':
      default:
        return room.status === 'Available' ? '#48bb78' : '#4299e1';
    }
  };

  return (
    <div style={{ backgroundColor: '#1a202c', color: '#fff', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #2d3748' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#63b3ed' }}>🏢 Live 3D Digital Twin Model</h3>
          <div style={{ fontSize: '0.8rem', color: '#4ade80', fontFamily: 'monospace', marginTop: '0.2rem' }}>
            ⚡ {mqttPulse}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: '#2d3748', padding: '0.25rem', borderRadius: '0.5rem' }}>
          {(['occupancy', 'temperature', 'electricity', 'water'] as const).map(layer => (
            <button
              key={layer}
              onClick={() => setActiveLayer(layer)}
              style={{
                padding: '0.4rem 0.8rem',
                borderRadius: '0.375rem',
                border: 'none',
                backgroundColor: activeLayer === layer ? '#4299e1' : 'transparent',
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              {layer === 'electricity' ? '⚡ Power' : layer === 'water' ? '💧 Water' : layer === 'temperature' ? '🌡️ Temp' : '👥 Occupancy'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {[0, 1, 2, 3].map(floor => (
          <button
            key={floor}
            onClick={() => setSelectedFloor(floor)}
            style={{
              padding: '0.4rem 1rem',
              borderRadius: '0.5rem',
              border: selectedFloor === floor ? '2px solid #63b3ed' : '1px solid #4a5568',
              backgroundColor: selectedFloor === floor ? '#2b6cb0' : '#2d3748',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {floor === 0 ? 'All Floors View' : `Floor ${floor}`}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
        <div
          style={{
            backgroundColor: '#0d1117',
            borderRadius: '0.75rem',
            padding: '2rem',
            minHeight: '380px',
            border: '1px solid #30363d',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {displayedRooms.map(room => {
            const color = getRoomColor(room);
            const isSelected = selectedRoom?.roomNumber === room.roomNumber;
            return (
              <div
                key={room.roomNumber}
                onClick={() => setSelectedRoom(room)}
                style={{
                  backgroundColor: '#161b22',
                  border: isSelected ? '2px solid #63b3ed' : '1px solid #30363d',
                  borderRadius: '0.6rem',
                  padding: '1rem',
                  cursor: 'pointer',
                  boxShadow: `0 4px 14px ${color}33`,
                  transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', backgroundColor: color }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#f0f6fc' }}>Room {room.roomNumber}</span>
                  {room.status === 'Emergency' && <span style={{ fontSize: '0.8rem' }}>🔥</span>}
                  {room.status === 'Maintenance' && <span style={{ fontSize: '0.8rem' }}>🔧</span>}
                </div>

                <div style={{ fontSize: '0.75rem', color: '#8b949e', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <div>Floor {room.floor}</div>
                  {activeLayer === 'occupancy' && <div>Beds: {room.occupancy}/{room.maxCapacity}</div>}
                  {activeLayer === 'temperature' && <div>Temp: {room.temperature}°C</div>}
                  {activeLayer === 'electricity' && <div>Load: {room.electricityKw} kW</div>}
                  {activeLayer === 'water' && <div>Pressure: {room.waterPressurePsi} PSI</div>}
                </div>
              </div>
            );
          })}
        </div>

        {selectedRoom && (
          <div style={{ backgroundColor: '#161b22', borderRadius: '0.75rem', padding: '1.25rem', border: '1px solid #30363d' }}>
            <h4 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: '#58a6ff', fontWeight: 700 }}>
              Telemetry: Room {selectedRoom.roomNumber}
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #21262d', paddingBottom: '0.4rem' }}>
                <span style={{ color: '#8b949e' }}>Status</span>
                <strong style={{ color: getRoomColor(selectedRoom) }}>{selectedRoom.status}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #21262d', paddingBottom: '0.4rem' }}>
                <span style={{ color: '#8b949e' }}>Occupancy</span>
                <span>{selectedRoom.occupancy} / {selectedRoom.maxCapacity} Residents</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #21262d', paddingBottom: '0.4rem' }}>
                <span style={{ color: '#8b949e' }}>Ambient Temp</span>
                <span style={{ color: selectedRoom.temperature > 27 ? '#f85149' : '#3fb950' }}>{selectedRoom.temperature}°C</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #21262d', paddingBottom: '0.4rem' }}>
                <span style={{ color: '#8b949e' }}>Power Draw</span>
                <span>{selectedRoom.electricityKw} kW</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#8b949e' }}>Water Pressure</span>
                <span>{selectedRoom.waterPressurePsi} PSI</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
