import React from 'react';
import type { Valve } from '../types';

interface ValveControlProps {
  valve: Valve;
  onPositionChange: (position: number) => void;
}

const ValveControl: React.FC<ValveControlProps> = ({ valve, onPositionChange }) => {
  return (
    <div className="bg-gray-900 p-3 rounded-lg flex flex-col items-center justify-center border border-gray-700">
      <h4 className="text-sm font-semibold text-gray-400 mb-2">{valve.name}</h4>
      <p className="font-mono text-xl text-cyan-300 mb-2">{valve.position}%</p>
      <input
        type="range"
        min="0"
        max="100"
        value={valve.position}
        onChange={(e) => onPositionChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
};

export default ValveControl;