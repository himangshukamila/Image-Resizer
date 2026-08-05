import { useEffect } from 'react';
import { useImageStore } from '../store/useImageStore';

export function useTheme() {
  const theme = useImageStore((state) => state.theme);
  const setTheme = useImageStore((state) => state.setTheme);

  useEffect(() => {
    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return { theme, setTheme, toggleTheme };
}
