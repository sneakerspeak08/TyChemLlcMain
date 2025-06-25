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
    form.append('_subject', type === 'contact' ? 'New Contact Form Submission from Tychem Website' : `New Offer for ${formData.productName || 'Product'} from Tychem Website`);
    
    // Add redirect (optional - removes FormSubmit thank you page)
    form.append('_next', window.location.origin + '/');
    
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

    // Send form using FormSubmit with proper endpoint
    const response = await fetch('https://formsubmit.co/ty@tychem.net', {
      method: 'POST',
      body: form,
      headers: {
        'Accept': 'application/json'
      }
    });

    const result = await response.json();

    if (response.ok && result.success !== false) {
      toast.success(
        type === 'contact' 
          ? "Thank you for your message! We'll get back to you soon."
          : "Your offer has been sent successfully!"
      );
      return true;
    } else {
      throw new Error(result.message || 'Failed to send message');
    }
  } catch (error) {
    console.error('Error sending form:', error);
    
    // Final fallback - try with a different approach
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