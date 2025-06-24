import emailjs from '@emailjs/browser';
import { toast } from "sonner";

interface FormData {
  [key: string]: string;
}

// Initialize EmailJS with your public key
const initEmailJS = () => {
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  if (publicKey) {
    emailjs.init(publicKey);
  }
};

export const handleFormSubmission = async (formData: FormData, type: 'contact' | 'offer') => {
  try {
    // Initialize EmailJS
    initEmailJS();

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

    if (!serviceId || !templateId) {
      console.warn('EmailJS not configured, using fallback method');
      return await fallbackFormSubmission(formData, type);
    }

    // Prepare template parameters
    const templateParams = {
      from_name: formData.name || formData.contactName || 'Website Visitor',
      from_email: formData.email,
      company: formData.company || formData.companyName || 'Not specified',
      phone: formData.phone || 'Not provided',
      message: formData.message || formData.comments || 'No message provided',
      form_type: type,
      ...(type === 'offer' && {
        product_name: formData.productName,
        product_cas: formData.productCas,
        offer_price: formData.offerPrice,
      })
    };

    const response = await emailjs.send(serviceId, templateId, templateParams);

    if (response.status === 200) {
      toast.success(
        type === 'contact' 
          ? "Thank you for your message! We'll get back to you soon."
          : "Your offer has been sent successfully!"
      );
      return true;
    } else {
      throw new Error('Failed to send email');
    }
  } catch (error) {
    console.error('EmailJS error:', error);
    // Fallback to FormSubmit
    return await fallbackFormSubmission(formData, type);
  }
};

const fallbackFormSubmission = async (formData: FormData, type: 'contact' | 'offer') => {
  try {
    // Create form data object for FormSubmit
    const form = new FormData();
    
    // Add email destination
    form.append('_to', 'ty@tychem.net');
    
    // Add form type to subject
    form.append('_subject', type === 'contact' ? 'New Contact Form Submission' : `New Offer for ${formData.productName}`);
    
    // Add all form fields
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value);
    });

    // Send form using FormSubmit
    const response = await fetch('https://formsubmit.co/ajax/ty@tychem.net', {
      method: 'POST',
      body: form
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    toast.success(
      type === 'contact' 
        ? "Thank you for your message! We'll get back to you soon."
        : "Your offer has been sent successfully!"
    );

    return true;
  } catch (error) {
    console.error('Error sending form:', error);
    toast.error("Failed to send message. Please try again later.");
    return false;
  }
};