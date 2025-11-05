import React from 'react';
import DashboardCard from './DashboardCard';
import type { PressureSensor } from '../types';

interface PressureDisplayProps {
  pressures: PressureSensor[];
}

const PressureGauge: React.FC<{ sensor: PressureSensor }> = ({ sensor }) => {
    const percentage = (sensor.value / 1000) * 100;
    
    return (
        <div className="bg-gray-900 p-4 rounded-lg text-center border border-gray-700">
            <h4 className="text-sm font-medium text-gray-400 truncate">{sensor.name}</h4>
            <p className="text-2xl font-mono text-teal-300 my-2">{sensor.value.toFixed(1)}</p>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div 
                    className="bg-teal-400 h-2.5 rounded-full" 
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
             <p className="text-xs text-gray-500 mt-1">{sensor.unit}</p>
        </div>
    );
}


const PressureDisplay: React.FC<PressureDisplayProps> = ({ pressures }) => {
  return (
    <DashboardCard title="Pressure Sensors">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        {pressures.map(sensor => (
          <PressureGauge key={sensor.id} sensor={sensor} />
        ))}
      </div>
    </DashboardCard>
  );
};

export default PressureDisplay;