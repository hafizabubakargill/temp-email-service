
import React, { createContext, useState, useContext, useEffect } from 'react';
import { fetchEmails } from '@/services/emailService';
import { EmailType } from '@/types/email';
import { toast } from 'sonner';

interface EmailContextType {
  emails: EmailType[];
  setEmails: React.Dispatch<React.SetStateAction<EmailType[]>>;
  loading: boolean;
  refreshing: boolean;
  refreshEmails: () => Promise<void>;
  clearEmails: () => void;
  sendReply: (originalEmail: EmailType, replyBody: string) => Promise<void>;
  currentEmail: string | null;
  setCurrentEmail: React.Dispatch<React.SetStateAction<string | null>>;
}

const EmailContext = createContext<EmailContextType | undefined>(undefined);

export const EmailProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [emails, setEmails] = useState<EmailType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [currentEmail, setCurrentEmail] = useState<string | null>(null);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  // Load initial emails
  useEffect(() => {
    loadEmails();

    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      refreshEmails(false);
    }, 30000);

    setAutoRefreshInterval(interval);

    return () => {
      if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
      }
    };
  }, []);

  // Update auto-refresh when currentEmail changes
  useEffect(() => {
    if (autoRefreshInterval) {
      clearInterval(autoRefreshInterval);
    }

    // Only set auto-refresh if we have a current email
    if (currentEmail) {
      const interval = setInterval(() => {
        refreshEmails(false);
      }, 30000);
      
      setAutoRefreshInterval(interval);
      
      return () => {
        clearInterval(interval);
      };
    }
  }, [currentEmail]);

  const loadEmails = async () => {
    setLoading(true);
    try {
      const data = await fetchEmails();
      setEmails(data);
    } finally {
      setLoading(false);
    }
  };

  const refreshEmails = async (showToast: boolean = true) => {
    setRefreshing(true);
    try {
      const data = await fetchEmails(true);
      
      if (data.length > 0) {
        setEmails(prev => [...data, ...prev]);
        if (showToast) {
          toast.success(`${data.length} new email${data.length > 1 ? 's' : ''} received!`);
        }
      }
    } finally {
      setRefreshing(false);
    }
  };

  const clearEmails = () => {
    setEmails([]);
  };

  const sendReply = async (originalEmail: EmailType, replyBody: string): Promise<void> => {
    // Simulate sending reply
    return new Promise((resolve) => {
      setTimeout(() => {
        toast.success(`Reply sent to ${originalEmail.sender}`);
        resolve();
      }, 1000);
    });
  };

  return (
    <EmailContext.Provider value={{ 
      emails, 
      setEmails, 
      loading, 
      refreshing, 
      refreshEmails, 
      clearEmails, 
      sendReply,
      currentEmail,
      setCurrentEmail
    }}>
      {children}
    </EmailContext.Provider>
  );
};

export const useEmailContext = () => {
  const context = useContext(EmailContext);
  if (context === undefined) {
    throw new Error('useEmailContext must be used within an EmailProvider');
  }
  return context;
};
