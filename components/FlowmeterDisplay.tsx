import React from 'react';
import { WaveIcon } from './icons';

interface FlowmeterDisplayProps {
  flowRate: number;
}

const FlowmeterDisplay: React.FC<FlowmeterDisplayProps> = ({ flowRate }) => {
  return (
    <div className="bg-gray-900 p-6 rounded-lg h-full flex flex-col justify-center items-center border border-gray-700">
      <h3 className="text-lg font-semibold text-gray-400 mb-2 flex items-center">
        <WaveIcon className="w-5 h-5 mr-2 text-blue-400" />
        Main Flowmeter
      </h3>
      <p className="text-6xl font-mono font-bold text-blue-300 tracking-wider">
        {flowRate.toFixed(1)}
      </p>
      <p className="text-lg text-gray-500">L/min</p>
    </div>
  );
};

export default FlowmeterDisplay;