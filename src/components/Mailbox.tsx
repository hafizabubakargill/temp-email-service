
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Inbox, RefreshCw } from 'lucide-react';
import { EmailMessage } from './EmailMessage';
import { fetchEmails } from '@/services/emailService';
import { EmailType } from '@/types/email';

export const Mailbox: React.FC = () => {
  const [emails, setEmails] = useState<EmailType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    loadEmails();
  }, []);

  const loadEmails = async () => {
    setLoading(true);
    try {
      // Simulate API call delay
      const data = await fetchEmails();
      setEmails(data);
    } finally {
      setLoading(false);
    }
  };

  const refreshEmails = async () => {
    setRefreshing(true);
    try {
      // Simulate API call delay
      const data = await fetchEmails(true);
      setEmails((prev) => [...data, ...prev]);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <Card className="shadow-lg border-none bg-white/70 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Inbox className="h-5 w-5" />
            <span>Inbox</span>
            {emails.length > 0 && (
              <span className="inline-flex items-center justify-center h-5 w-5 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                {emails.length}
              </span>
            )}
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={refreshEmails}
            disabled={refreshing}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
      </CardHeader>
      <Separator />
      
      <Tabs defaultValue="all">
        <div className="px-4 py-2">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
            <TabsTrigger value="unread" className="flex-1">Unread</TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent>
          <TabsContent value="all" className="m-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="h-8 w-8 border-t-2 border-b-2 border-primary rounded-full animate-spin mb-4"></div>
                <p className="text-muted-foreground">Loading your messages...</p>
              </div>
            ) : emails.length > 0 ? (
              <div className="divide-y">
                {emails.map((email) => (
                  <EmailMessage key={email.id} email={email} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Inbox className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">Your inbox is empty</h3>
                <p className="text-muted-foreground max-w-sm">
                  New messages will appear here. Use this email address to receive messages.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="unread" className="m-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="h-8 w-8 border-t-2 border-b-2 border-primary rounded-full animate-spin mb-4"></div>
                <p className="text-muted-foreground">Loading your messages...</p>
              </div>
            ) : emails.filter(e => !e.read).length > 0 ? (
              <div className="divide-y">
                {emails.filter(e => !e.read).map((email) => (
                  <EmailMessage key={email.id} email={email} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Inbox className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No unread messages</h3>
                <p className="text-muted-foreground max-w-sm">
                  You've read all your messages. Check the "All" tab to see your message history.
                </p>
              </div>
            )}
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};
