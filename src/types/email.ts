
export interface AttachmentType {
  name: string;
  size: number;
  type: string;
}

export interface EmailType {
  id: string;
  sender: string;
  subject: string;
  body: string;
  snippet: string;
  date: string;
  read: boolean;
  labels?: string[];
  attachments?: AttachmentType[];
}
