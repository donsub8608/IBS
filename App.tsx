import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PressureDisplay from './components/PressureDisplay';
import CameraGrid from './components/CameraGrid';
import MainControls from './components/MainControls';
import type { PressureSensor, Valve, Pump } from './types';
import { useMockData } from './hooks/useMockData';

const App: React.FC = () => {
  const { pressures, flowRate, pump, valves, updateValve, updatePump, updatePumpSpeed } = useMockData();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          <MainControls 
            flowRate={flowRate} 
            pump={pump} 
            valves={valves}
            onValveChange={updateValve}
            onPumpToggle={updatePump}
            onPumpSpeedChange={updatePumpSpeed}
          />
        </div>
        
        <div className="lg:col-span-3">
          <CameraGrid />
        </div>

        <div className="lg:col-span-3">
          <PressureDisplay pressures={pressures} />
        </div>
      </main>
    </div>
  );
};

export default App;