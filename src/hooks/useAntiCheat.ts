import { useState, useEffect, useCallback } from 'react';
import { FlaggedEvent, AntiCheatSettings } from '../types/exam';

export const useAntiCheat = (
  settings: AntiCheatSettings, 
  onViolation: (event: FlaggedEvent) => void,
  isActive: boolean = true
) => {
  const [violations, setViolations] = useState<FlaggedEvent[]>([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);
  const [faceDetected, setFaceDetected] = useState(true);

  const addViolation = useCallback((type: FlaggedEvent['type'], details?: string) => {
    const event: FlaggedEvent = {
      type,
      timestamp: new Date(),
      details,
    };
    setViolations(prev => [...prev, event]);
    onViolation(event);
  }, [onViolation]);

  // Focus loss detection
  useEffect(() => {
    if (!settings.detectFocusLoss || !isActive) return;

    const handleFocusLoss = () => addViolation('focus-loss', 'Window lost focus');
    const handleVisibilityChange = () => {
      if (document.hidden) {
        addViolation('tab-switch', 'Tab switched or window minimized');
      }
    };

    window.addEventListener('blur', handleFocusLoss);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('blur', handleFocusLoss);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [settings.detectFocusLoss, addViolation]);

  // Right-click prevention
  useEffect(() => {
    if (!settings.preventRightClick || !isActive) return;

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      addViolation('right-click', 'Right-click attempted');
    };

    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, [settings.preventRightClick, addViolation]);

  // Copy prevention
  useEffect(() => {
    if (!settings.preventCopy || !isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'a')) {
        e.preventDefault();
        addViolation('copy-attempt', `${e.key.toUpperCase()} key combination blocked`);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [settings.preventCopy, addViolation]);

  // Webcam monitoring
  const startWebcamMonitoring = useCallback(async () => {
    if (!settings.webcamMonitoring || !isActive) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 },
        audio: false 
      });
      setWebcamStream(stream);
    } catch (error) {
      addViolation('face-not-detected', 'Failed to access webcam');
    }
  }, [settings.webcamMonitoring, isActive, addViolation]);

  const stopWebcamMonitoring = useCallback(() => {
    if (webcamStream) {
      webcamStream.getTracks().forEach(track => track.stop());
      setWebcamStream(null);
    }
  }, [webcamStream]);

  // Face detection (simplified - in production use face-api.js)
  useEffect(() => {
    if (!settings.faceDetection || !webcamStream || !isActive) return;

    const interval = setInterval(() => {
      // Simulate face detection - in real app, use face-api.js
      const faceDetected = Math.random() > 0.1; // 90% chance face is detected
      
      if (!faceDetected && faceDetected !== false) {
        addViolation('face-not-detected', 'No face detected in webcam');
        setFaceDetected(false);
      } else if (faceDetected) {
        setFaceDetected(true);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [settings.faceDetection, webcamStream, isActive, addViolation]);
  // Full screen mode
  const enterFullScreen = useCallback(() => {
    if (!settings.fullScreenMode) return;
    
    document.documentElement.requestFullscreen?.().then(() => {
      setIsFullScreen(true);
    }).catch(console.error);
  }, [settings.fullScreenMode]);

  const exitFullScreen = useCallback(() => {
    document.exitFullscreen?.().then(() => {
      setIsFullScreen(false);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  return {
    violations,
    isFullScreen,
    webcamStream,
    faceDetected,
    enterFullScreen,
    exitFullScreen,
    startWebcamMonitoring,
    stopWebcamMonitoring,
  };
};