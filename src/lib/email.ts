import { toast } from "sonner";

interface FormData {
  [key: string]: string;
}

export const handleFormSubmission = async (formData: FormData, type: 'contact' | 'offer') => {
  try {
    // Create form data object for FormSubmit
    const form = new FormData();
    
    // Add email destination
    form.append('_to', 'ty@tychem.net');
    
    // Add form type to subject
    form.append('_subject', type === 'contact' ? 'New Contact Form Submission from Tychem Website' : `New Offer for ${formData.productName || 'Product'} from Tychem Website`);
    
    // Disable captcha for better UX
    form.append('_captcha', 'false');
    
    // Add all form fields with proper formatting
    form.append('Name', formData.name || formData.contactName || 'Not provided');
    form.append('Email', formData.email || 'Not provided');
    form.append('Company', formData.company || formData.companyName || 'Not provided');
    form.append('Phone', formData.phone || 'Not provided');
    form.append('Message', formData.message || formData.comments || 'No message provided');
    form.append('Form Type', type);
    
    if (type === 'offer') {
      form.append('Product Name', formData.productName || 'Not specified');
      form.append('Product CAS', formData.productCas || 'Not specified');
      form.append('Offer Price', formData.offerPrice || 'Not specified');
    }

    // Send form using FormSubmit
    const response = await fetch('https://formsubmit.co/ty@tychem.net', {
      method: 'POST',
      body: form
    });

    if (response.ok) {
      toast.success(
        type === 'contact' 
          ? "Thank you for your message! We'll get back to you soon."
          : "Your offer has been sent successfully!"
      );
      return true;
    } else {
      throw new Error('Failed to send message');
    }
  } catch (error) {
    console.error('Error sending form:', error);
    
    // Fallback - open email client
    try {
      const mailtoLink = `mailto:ty@tychem.net?subject=${encodeURIComponent(
        type === 'contact' ? 'Contact Form Submission' : `Offer for ${formData.productName || 'Product'}`
      )}&body=${encodeURIComponent(
        `Name: ${formData.name || formData.contactName || 'Not provided'}\n` +
        `Email: ${formData.email || 'Not provided'}\n` +
        `Company: ${formData.company || formData.companyName || 'Not provided'}\n` +
        `Phone: ${formData.phone || 'Not provided'}\n` +
        `Message: ${formData.message || formData.comments || 'No message provided'}\n` +
        (type === 'offer' ? `\nProduct: ${formData.productName || 'Not specified'}\nOffer Price: ${formData.offerPrice || 'Not specified'}` : '')
      )}`;
      
      window.location.href = mailtoLink;
      
      toast.success("Opening your email client to send the message.");
      return true;
    } catch (mailtoError) {
      console.error('Mailto fallback failed:', mailtoError);
      toast.error("Unable to send message. Please contact us directly at ty@tychem.net");
      return false;
    }
  }
};