import { useEffect } from 'react';
import { ResizerApp } from './pages/ResizerApp';

export function App() {
  useEffect(() => {
    // Prevent default browser/webpage pinch zooming via Ctrl/Cmd + Wheel or Touch gestures
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
      }
    };

    const handleGesture = (e: Event) => {
      e.preventDefault();
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('gesturestart', handleGesture);
    window.addEventListener('gesturechange', handleGesture);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('gesturestart', handleGesture);
      window.removeEventListener('gesturechange', handleGesture);
    };
  }, []);

  return <ResizerApp />;
}

export default App;
