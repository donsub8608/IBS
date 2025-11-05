import React, { useState, useRef, useEffect } from 'react';
import type { Camera } from '../types';
import { getOcrFromImage } from '../services/geminiService';
import { OcrIcon, CameraIcon, PowerIcon, SpinnerIcon } from './icons';

interface CameraFeedProps {
  camera: Camera;
  isReadyToStart: boolean;
}

const CameraFeed: React.FC<CameraFeedProps> = ({ camera, isReadyToStart }) => {
  const [ocrResult, setOcrResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const constraints = {
            video: {
              deviceId: { exact: camera.deviceId },
              // Reverted resolution to manage bandwidth.
              width: { ideal: 320 },
              height: { ideal: 240 },
              // Limit the frame rate to further reduce bandwidth. 15fps is sufficient for monitoring.
              frameRate: { ideal: 15 },
            },
          };
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error(`Error accessing camera ${camera.deviceId}:`, err);
          setError('Camera failed to start. This may be due to a hardware issue or insufficient USB bandwidth for multiple HD streams.');
          setIsActive(false);
        }
      }
    };

    const stopCamera = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };

    if (isActive && isReadyToStart) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [camera.deviceId, isActive, isReadyToStart]);


  const handleToggleActive = () => {
    setIsActive(!isActive);
    setError(null);
    setOcrResult('');
    setIsLoading(false);
  };

  const handleOcr = async () => {
    if (!videoRef.current || videoRef.current.readyState < 2) {
        setError('Video feed not ready.');
        return;
    };
    
    setIsLoading(true);
    setError(null);
    setOcrResult('');

    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (!context) {
          throw new Error("Could not get canvas context");
      }
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const base64Image = canvas.toDataURL('image/png').split(',')[1];
      if (!base64Image) {
           throw new Error("Could not get base64 image data from canvas");
      }

      const result = await getOcrFromImage(base64Image);
      setOcrResult(result);
    } catch (err) {
      setError('Failed to get OCR result.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCapture = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const link = document.createElement('a');
    link.download = `${camera.name.replace(/\s/g, '_')}_capture.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 flex flex-col">
      <div className="relative aspect-video bg-gray-900">
        {!isReadyToStart ? (
           <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
             <SpinnerIcon className="w-8 h-8 animate-spin text-cyan-400" />
             <div className="mt-2 text-xs font-semibold">Initializing...</div>
           </div>
        ) : isActive ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
            <CameraIcon className="w-12 h-12 opacity-20" />
            <div className="mt-2 text-xs font-semibold">Camera Off</div>
          </div>
        )}
        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          {camera.name}
        </div>
      </div>
      <div className="p-3 flex-grow flex flex-col justify-between">
        {isLoading && <div className="text-center text-sm text-cyan-400">Performing OCR...</div>}
        {error && <div className="text-center text-sm text-red-400">{error}</div>}
        {ocrResult && (
          <div className="bg-gray-900 p-2 rounded text-center my-2">
            <p className="text-sm font-semibold text-gray-300">OCR Result:</p>
            <p className="text-md font-mono text-green-400">{ocrResult}</p>
          </div>
        )}
        <div className="flex flex-wrap gap-2 justify-center mt-auto pt-2">
          <button 
            onClick={handleToggleActive} 
            disabled={!isReadyToStart}
            className={`flex-1 ${isActive ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'} text-white text-xs font-bold py-2 px-2 rounded inline-flex items-center justify-center transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed min-w-max`}
          >
            <PowerIcon className="w-4 h-4 mr-2" />
            <span>{isActive ? 'Off' : 'On'}</span>
          </button>
          <button 
            onClick={handleCapture} 
            disabled={!isActive || !isReadyToStart}
            className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-700 disabled:cursor-not-allowed disabled:text-gray-500 text-white text-xs font-bold py-2 px-2 rounded inline-flex items-center justify-center transition-colors min-w-max">
            <CameraIcon className="w-4 h-4 mr-2" />
            <span>Capture</span>
          </button>
          <button
            onClick={handleOcr}
            disabled={isLoading || !isActive || !isReadyToStart}
            className="flex-1 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-900 disabled:cursor-not-allowed text-white text-xs font-bold py-2 px-2 rounded inline-flex items-center justify-center transition-colors min-w-max"
          >
            <OcrIcon className="w-4 h-4 mr-2" />
            <span>OCR</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CameraFeed;