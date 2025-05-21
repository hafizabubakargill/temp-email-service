
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { Copy, RefreshCw } from 'lucide-react';
import { generateRandomEmail } from '@/services/emailService';

export const EmailGenerator: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    generateNewEmail();
  }, []);

  const generateNewEmail = () => {
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      const newEmail = generateRandomEmail();
      setEmail(newEmail);
      setLoading(false);
    }, 800);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    toast.success("Email copied to clipboard!");
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <Card className="border-none shadow-lg bg-white/70 backdrop-blur-sm mb-10">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-center">Your Temporary Email Address</h2>
        <div className="flex flex-col md:flex-row gap-2">
          <div className="relative flex-1">
            <Input 
              value={email}
              readOnly
              className={`h-12 text-center font-medium ${loading ? 'opacity-50' : 'animate-pulse-shadow'}`}
            />
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-5 w-5 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={copyToClipboard} className="h-12 w-12">
                    <Copy className={`h-4 w-4 ${copied ? 'text-green-500' : 'text-muted-foreground'}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy to clipboard</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={generateNewEmail} disabled={loading} className="h-12 w-12">
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Generate new email</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-4">
          This email address will expire in 10 minutes
        </p>
      </CardContent>
    </Card>
  );
};
