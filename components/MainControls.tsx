import React from 'react';
import FlowmeterDisplay from './FlowmeterDisplay';
import PumpControl from './PumpControl';
import ValveControl from './ValveControl';
import DashboardCard from './DashboardCard';
import type { Pump, Valve } from '../types';

interface MainControlsProps {
    flowRate: number;
    pump: Pump;
    valves: Valve[];
    onValveChange: (id: number, position: number) => void;
    onPumpToggle: () => void;
    onPumpSpeedChange: (speed: number) => void;
}

const MainControls: React.FC<MainControlsProps> = ({ flowRate, pump, valves, onValveChange, onPumpToggle, onPumpSpeedChange }) => {
    return (
        <DashboardCard title="System Overview & Controls">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <FlowmeterDisplay flowRate={flowRate} />
                </div>
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <PumpControl 
                      pump={pump} 
                      onToggle={onPumpToggle} 
                      onSpeedChange={onPumpSpeedChange} 
                    />
                    <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                        {valves.map(valve => (
                            <ValveControl 
                                key={valve.id} 
                                valve={valve}
                                onPositionChange={(pos) => onValveChange(valve.id, pos)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </DashboardCard>
    );
};

export default MainControls;