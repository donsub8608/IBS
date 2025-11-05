import React from 'react';
import type { Pump } from '../types';
import { PumpStatus } from '../types';
import { PowerIcon } from './icons';

interface PumpControlProps {
  pump: Pump;
  onToggle: () => void;
  onSpeedChange: (speed: number) => void;
}

const PumpControl: React.FC<PumpControlProps> = ({ pump, onToggle, onSpeedChange }) => {
  const statusColor = pump.status === PumpStatus.On ? 'bg-green-500' : pump.status === PumpStatus.Off ? 'bg-red-500' : 'bg-yellow-500';
  const buttonText = pump.status === PumpStatus.On ? 'Stop Pump' : 'Start Pump';
  const buttonColor = pump.status === PumpStatus.On ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700';

  return (
    <div className="bg-gray-900 p-4 rounded-lg flex flex-col justify-between h-full border border-gray-700">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-300">Pump Control</h3>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${statusColor} `}></div>
            <span className="font-medium text-gray-400">{pump.status}</span>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="pump-speed" className="block text-sm font-medium text-gray-400 mb-2">Pump Speed: {pump.speed}%</label>
          <input
            id="pump-speed"
            type="range"
            min="0"
            max="100"
            value={pump.speed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            disabled={pump.status !== PumpStatus.On}
          />
        </div>
      </div>
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-center py-3 px-4 text-white font-bold rounded-md transition-colors duration-200 ${buttonColor}`}
      >
        <PowerIcon className="w-5 h-5 mr-2" />
        {buttonText}
      </button>
    </div>
  );
};

export default PumpControl;