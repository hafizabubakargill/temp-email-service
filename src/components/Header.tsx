
import React from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';
import { Mail, Moon, Sun } from 'lucide-react';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md border-b bg-background/80 dark:bg-gray-900/80 py-3">
      <div className="container px-4 mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mail className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            DisposaMail
          </h1>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleTheme}
          className="rounded-full"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  );
};
