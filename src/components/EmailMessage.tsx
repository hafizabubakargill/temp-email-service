
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { formatDistanceToNow } from 'date-fns';
import { Mail, Reply } from 'lucide-react';
import { EmailType } from '@/types/email';
import { useEmailContext } from '@/context/EmailContext';

interface EmailMessageProps {
  email: EmailType;
}

export const EmailMessage: React.FC<EmailMessageProps> = ({ email }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isRead, setIsRead] = useState<boolean>(email.read);
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [replyText, setReplyText] = useState<string>('');
  const [sendingReply, setSendingReply] = useState<boolean>(false);
  
  const { sendReply } = useEmailContext();

  const handleOpen = () => {
    setIsOpen(true);
    if (!isRead) {
      setIsRead(true);
      // In a real application, you would update the read status on the server
    }
  };

  const handleReply = async () => {
    if (!replyText.trim()) return;
    
    setSendingReply(true);
    try {
      await sendReply(email, replyText);
      setIsReplying(false);
      setReplyText('');
    } finally {
      setSendingReply(false);
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
            {/* Desktop version */}
            <div className="hidden md:block">
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

            {/* Mobile version */}
            <div className="block md:hidden">
              <div className="mb-1">
                <p className={`font-medium ${!isRead ? 'font-semibold' : ''}`}>
                  {email.sender.split('<')[0].trim()}
                </p>
                {email.sender.includes('<') && (
                  <p className="text-xs text-muted-foreground">
                    {email.sender.match(/<([^>]+)>/)?.[1] || ''}
                  </p>
                )}
              </div>
              
              <h4 className={`text-sm mb-1 ${!isRead ? 'font-medium' : ''}`}>
                {email.subject}
              </h4>
              
              <p className="text-xs text-muted-foreground line-clamp-2">
                {email.snippet}
              </p>
              
              <div className="mt-1">
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(email.date), { addSuffix: true })}
                </span>
              </div>
            </div>
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
              <div className="flex flex-wrap gap-2 mt-2">
                {email.labels.map(label => (
                  <Badge key={label} variant="secondary">{label}</Badge>
                ))}
              </div>
            )}
          </DialogHeader>
          
          <div className="mt-4 prose prose-sm max-w-none dark:prose-invert">
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
          
          {isReplying ? (
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-2">Reply</h4>
              <Textarea 
                placeholder="Type your reply here..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="min-h-[120px]"
              />
              <div className="flex justify-end gap-2 mt-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsReplying(false)}
                  disabled={sendingReply}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleReply}
                  disabled={!replyText.trim() || sendingReply}
                >
                  {sendingReply ? 'Sending...' : 'Send Reply'}
                </Button>
              </div>
            </div>
          ) : (
            <DialogFooter className="mt-6">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => setIsReplying(true)}
              >
                <Reply className="h-4 w-4" /> 
                Reply
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
