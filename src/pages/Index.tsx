
import React from 'react';
import { HomePage } from '@/components/HomePage';
import { EmailProvider } from '@/context/EmailContext';
import { ThemeProvider } from '@/context/ThemeContext';

const Index = () => {
  return (
    <ThemeProvider>
      <EmailProvider>
        <HomePage />
      </EmailProvider>
    </ThemeProvider>
  );
};

export default Index;
