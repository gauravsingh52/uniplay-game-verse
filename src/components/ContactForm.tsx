
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MessageSquare } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface ContactFormProps {
  formData: {
    name: string;
    email: string;
    subject: string;
    message: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    subject: string;
    message: string;
  }>>;
}

export const ContactForm: React.FC<ContactFormProps> = ({ formData, setFormData }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create mailto link with form data
      const subject = encodeURIComponent(formData.subject);
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      );
      const mailtoLink = `mailto:support@unigames.com?subject=${subject}&body=${body}`;
      
      // Open email client
      window.location.href = mailtoLink;
      
      toast({
        title: "Email client opened!",
        description: "Your default email application should now open with the pre-filled message.",
      });

      // Reset form
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open email client. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDirectEmail = () => {
    window.location.href = 'mailto:support@unigames.com';
  };

  const handlePhoneContact = () => {
    window.location.href = 'tel:+1-555-UNIGAMES';
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Name *</label>
            <Input
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Your name"
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Email *</label>
            <Input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="your@email.com"
              className="w-full"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Subject *</label>
          <Input
            required
            value={formData.subject}
            onChange={(e) => setFormData({...formData, subject: e.target.value})}
            placeholder="How can we help?"
            className="w-full"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Message *</label>
          <Textarea
            required
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            placeholder="Describe your issue or question in detail..."
            rows={5}
            className="w-full resize-none"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-unigames-purple to-unigames-blue hover:from-unigames-purple/80 hover:to-unigames-blue/80"
          >
            <Mail className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Opening Email...' : 'Send via Email Client'}
          </Button>
          
          <Button 
            type="button"
            variant="outline"
            onClick={handleDirectEmail}
            className="flex-1"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Direct Email
          </Button>
          
          <Button 
            type="button"
            variant="outline"
            onClick={handlePhoneContact}
            className="flex-1"
          >
            <Phone className="h-4 w-4 mr-2" />
            Call Support
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
