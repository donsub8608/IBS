import { useState, useEffect, useCallback } from 'react';
import type { PressureSensor, Valve, Pump } from '../types';
import { PumpStatus } from '../types';

const INITIAL_PRESSURES: PressureSensor[] = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  name: `Pressure Sensor ${i + 1}`,
  value: 750,
  unit: 'kPa',
}));

const INITIAL_VALVES: Valve[] = Array.from({ length: 4 }, (_, i) => ({
  id: i + 1,
  name: `Valve ${i + 1}`,
  position: 0,
}));

const INITIAL_PUMP: Pump = {
  status: PumpStatus.Off,
  speed: 0,
};

export const useMockData = () => {
  const [pressures, setPressures] = useState<PressureSensor[]>(INITIAL_PRESSURES);
  const [flowRate, setFlowRate] = useState<number>(0);
  const [pump, setPump] = useState<Pump>(INITIAL_PUMP);
  const [valves, setValves] = useState<Valve[]>(INITIAL_VALVES);

  useEffect(() => {
    const interval = setInterval(() => {
      setPressures(prevPressures =>
        prevPressures.map(sensor => ({
          ...sensor,
          value: parseFloat((750 + (Math.random() - 0.5) * 50).toFixed(1)),
        }))
      );
      if (pump.status === PumpStatus.On) {
        setFlowRate(parseFloat((pump.speed * 1.5 + (Math.random() - 0.5) * 10).toFixed(1)));
      } else {
        setFlowRate(0);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [pump.status, pump.speed]);

  const updateValve = useCallback((id: number, position: number) => {
    setValves(prevValves =>
      prevValves.map(v => (v.id === id ? { ...v, position } : v))
    );
  }, []);

  const updatePump = useCallback(() => {
    setPump(prevPump => ({
      ...prevPump,
      status: prevPump.status === PumpStatus.On ? PumpStatus.Off : PumpStatus.On,
    }));
  }, []);

  const updatePumpSpeed = useCallback((speed: number) => {
    setPump(prevPump => ({ ...prevPump, speed }));
  }, []);

  return { pressures, flowRate, pump, valves, updateValve, updatePump, updatePumpSpeed };
};