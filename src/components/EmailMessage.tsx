
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Mail } from 'lucide-react';
import { EmailType } from '@/types/email';

interface EmailMessageProps {
  email: EmailType;
}

export const EmailMessage: React.FC<EmailMessageProps> = ({ email }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isRead, setIsRead] = useState<boolean>(email.read);

  const handleOpen = () => {
    setIsOpen(true);
    if (!isRead) {
      setIsRead(true);
      // In a real application, you would update the read status on the server
    }
  };

  return (
    <>
      <div 
        className={`py-4 px-1 cursor-pointer hover:bg-muted/40 transition-colors ${!isRead ? 'bg-accent/30' : ''}`}
        onClick={handleOpen}
      >
        <div className="flex items-start gap-3">
          <div className={`w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1 ${!isRead ? 'bg-primary/20' : ''}`}>
            <Mail className="h-4 w-4 text-primary" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex-1">
                <p className={`font-medium truncate ${!isRead ? 'font-semibold' : ''}`}>
                  {email.sender}
                </p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {formatDistanceToNow(new Date(email.date), { addSuffix: true })}
              </span>
            </div>
            
            <h4 className={`text-sm truncate mb-1 ${!isRead ? 'font-medium' : ''}`}>
              {email.subject}
            </h4>
            
            <p className="text-xs text-muted-foreground truncate">
              {email.snippet}
            </p>
          </div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-xl">{email.subject}</DialogTitle>
            <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
              <div>From: <span className="font-medium text-foreground">{email.sender}</span></div>
              <div>{new Date(email.date).toLocaleString()}</div>
            </div>
            {email.labels && email.labels.length > 0 && (
              <div className="flex gap-2 mt-2">
                {email.labels.map(label => (
                  <Badge key={label} variant="secondary">{label}</Badge>
                ))}
              </div>
            )}
          </DialogHeader>
          
          <div className="mt-4 prose prose-sm max-w-none">
            <div dangerouslySetInnerHTML={{ __html: email.body }} />
          </div>
          
          {email.attachments && email.attachments.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-2">Attachments ({email.attachments.length})</h4>
              <div className="flex flex-wrap gap-2">
                {email.attachments.map((attachment, index) => (
                  <Button key={index} variant="outline" size="sm" className="text-xs">
                    {attachment.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
