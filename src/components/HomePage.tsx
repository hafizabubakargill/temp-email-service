
import React from 'react';
import { EmailGenerator } from './EmailGenerator';
import { Mailbox } from './Mailbox';
import { Mail, Shield, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20">
      <div className="container px-4 py-8 mx-auto">
        {/* Header Section */}
        <header className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-3">
            DisposaMail
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create temporary email addresses that self-destruct. Protect your privacy and avoid spam.
          </p>
        </header>

        {/* Email Generator Section */}
        <EmailGenerator />

        {/* Mailbox Section */}
        <Mailbox />

        {/* Features Section */}
        <section className="mt-16 mb-12">
          <h2 className="text-2xl font-semibold text-center mb-8">Why use DisposaMail?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-none shadow-lg bg-white/70 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No Registration</h3>
                  <p className="text-muted-foreground">
                    Generate an email address instantly without signing up or providing personal information.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg bg-white/70 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Privacy Protection</h3>
                  <p className="text-muted-foreground">
                    Keep your real email address private and prevent spam from reaching your personal inbox.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg bg-white/70 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Self-Destructing</h3>
                  <p className="text-muted-foreground">
                    Emails automatically expire after a set time, leaving no trace of your temporary communications.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-muted-foreground text-sm py-6 mt-8 border-t">
          <p>© {new Date().getFullYear()} DisposaMail. All rights reserved.</p>
          <p className="mt-2">This is a demo project and not intended for production use.</p>
        </footer>
      </div>
    </div>
  );
};
