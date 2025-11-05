import React, { useState, useEffect } from 'react';
import DashboardCard from './DashboardCard';
import CameraFeed from './CameraFeed';
import type { Camera } from '../types';
import { CameraIcon, OcrIcon, SpinnerIcon, PowerIcon } from './icons';

const MAX_CAMERAS = 10;

const CameraGrid: React.FC = () => {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState<boolean>(true);
  const [readyToInitialize, setReadyToInitialize] = useState<Set<string>>(new Set());

  useEffect(() => {
    const getCameras = async () => {
      setIsDetecting(true);
      setPermissionError(null);

      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        setPermissionError("Media devices API not supported on this browser.");
        setIsDetecting(false);
        return;
      }

      let stream: MediaStream | null = null;
      try {
        // Step 1: Request permission using a minimal, non-bandwidth-intensive stream.
        // This is a "gentle" way to ask for permission without activating a full camera stream,
        // which can saturate a shared USB hub and prevent other devices from being enumerated.
        const minimalConstraints = { video: { width: 1, height: 1 }, audio: false };
        stream = await navigator.mediaDevices.getUserMedia(minimalConstraints);

        // Step 2: Enumerate devices while the permission stream is active.
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = allDevices.filter(device => device.kind === 'videoinput');

        if (videoDevices.length === 0) {
          setPermissionError("No cameras found. Please ensure your cameras are connected and not in use by another application.");
        } else {
            const cameraData: Camera[] = videoDevices.slice(0, MAX_CAMERAS).map((device, index) => ({
                deviceId: device.deviceId,
                name: device.label || `Camera ${index + 1}`,
            }));
            setCameras(cameraData);
        }
      } catch (err) {
        console.error("Error accessing media devices.", err);
        if ((err as Error).name === 'NotAllowedError' || (err as Error).name === 'PermissionDeniedError') {
             setPermissionError("Camera access denied. Please grant permission in your browser settings and refresh the page.");
        } else {
             setPermissionError("Could not access cameras. Please check connections and ensure they are not in use by another program.");
        }
      } finally {
        // Step 3: Always stop the temporary stream to release the device.
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        setIsDetecting(false);
      }
    };

    getCameras();
  }, []);

  // Stagger the initialization of cameras to prevent USB bandwidth issues
  useEffect(() => {
    if (cameras.length === 0) return;

    let delay = 0;
    // Reverted delay to 1s as requested.
    const STAGGER_DELAY_MS = 1000;

    const timeouts = cameras.map((camera) => {
        const timer = setTimeout(() => {
            setReadyToInitialize(prev => new Set(prev).add(camera.deviceId));
        }, delay);
        delay += STAGGER_DELAY_MS;
        return timer;
    });

    // Cleanup function to clear all timeouts if the component unmounts
    return () => {
        timeouts.forEach(clearTimeout);
    };
  }, [cameras]);


  const CameraPlaceholder: React.FC<{ index: number }> = ({ index }) => (
    <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 flex flex-col">
      <div className="relative aspect-video bg-gray-900 flex flex-col items-center justify-center text-gray-500">
        <CameraIcon className="w-12 h-12 opacity-20" />
        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          Camera {index}
        </div>
         <div className="absolute bottom-2 text-xs font-semibold">Offline</div>
      </div>
      <div className="p-3 flex-grow flex flex-col justify-between">
         <div className="flex flex-wrap gap-2 justify-center mt-auto pt-2">
            <button disabled className="flex-1 bg-gray-700 text-gray-500 text-xs font-bold py-2 px-2 rounded inline-flex items-center justify-center cursor-not-allowed min-w-max">
                <PowerIcon className="w-4 h-4 mr-2" />
                <span>On</span>
            </button>
            <button disabled className="flex-1 bg-gray-700 text-gray-500 text-xs font-bold py-2 px-2 rounded inline-flex items-center justify-center cursor-not-allowed min-w-max">
                <CameraIcon className="w-4 h-4 mr-2" />
                <span>Capture</span>
            </button>
            <button disabled className="flex-1 bg-gray-700 text-gray-500 text-xs font-bold py-2 px-2 rounded inline-flex items-center justify-center cursor-not-allowed min-w-max">
                <OcrIcon className="w-4 h-4 mr-2" />
                <span>OCR</span>
            </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (isDetecting) {
        return (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                <SpinnerIcon className="w-10 h-10 animate-spin text-cyan-400" />
                <p className="mt-4 text-lg font-semibold">Detecting cameras...</p>
            </div>
        );
    }

    if (permissionError) {
        return (
            <div className="text-center text-red-400 p-4 bg-red-900/50 rounded-lg">{permissionError}</div>
        );
    }
    
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: MAX_CAMERAS }).map((_, index) => {
                const camera = cameras[index];
                if (camera) {
                    return (
                        <CameraFeed 
                            key={camera.deviceId} 
                            camera={camera} 
                            isReadyToStart={readyToInitialize.has(camera.deviceId)}
                        />
                    );
                } else {
                    return <CameraPlaceholder key={index} index={index + 1} />;
                }
            })}
        </div>
    );
  };


  return (
    <DashboardCard title="Camera Feeds">
      {renderContent()}
    </DashboardCard>
  );
};

export default CameraGrid;