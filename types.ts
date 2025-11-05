export interface PressureSensor {
  id: number;
  name: string;
  value: number;
  unit: string;
}

export interface Camera {
  deviceId: string;
  name: string;
}

export interface Valve {
  id: number;
  name: string;
  position: number; // 0-100
}

export enum PumpStatus {
  Off = 'Off',
  On = 'On',
  Fault = 'Fault',
}

export interface Pump {
  status: PumpStatus;
  speed: number; // 0-100
}
