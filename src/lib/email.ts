import { toast } from "sonner";

interface FormData {
  [key: string]: string;
}

export const handleFormSubmission = async (formData: FormData, type: 'contact' | 'offer') => {
  try {
    // Try Web3Forms first (fastest and most reliable)
    const success = await submitToWeb3Forms(formData, type);
    if (success) return true;

    // Fallback to Netlify Forms if Web3Forms fails
    return await submitToNetlifyForms(formData, type);
  } catch (error) {
    console.error('Error sending form:', error);
    toast.error("Failed to send message. Please try again or contact us directly at ty@tychem.net");
    return false;
  }
};

// Web3Forms - Fast and reliable (recommended)
const submitToWeb3Forms = async (formData: FormData, type: 'contact' | 'offer') => {
  try {
    const form = new FormData();
    
    // Web3Forms access key
    form.append('access_key', '1ead06e8-908d-4fab-87d8-6aed2a25e77b');
    
    // Add recipient
    form.append('email', 'ty@tychem.net');
    
    // Add subject
    const subject = type === 'contact' 
      ? 'New Contact Form Submission from Tychem Website' 
      : `New Offer for ${formData.productName || 'Product'} from Tychem Website`;
    form.append('subject', subject);
    
    // Add all form fields
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value);
    });

    // Add form type and timestamp
    form.append('form_type', type);
    form.append('submitted_at', new Date().toISOString());

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: form
    });

    const result = await response.json();

    if (response.ok && result.success) {
      toast.success(
        type === 'contact' 
          ? "Thank you for your message! We'll get back to you soon."
          : "Your offer has been sent successfully!"
      );
      return true;
    } else {
      throw new Error(result.message || 'Web3Forms failed');
    }
  } catch (error) {
    console.error('Web3Forms error:', error);
    throw error;
  }
};

// Netlify Forms - Good fallback option
const submitToNetlifyForms = async (formData: FormData, type: 'contact' | 'offer') => {
  try {
    const form = new FormData();
    
    // Netlify form name
    form.append('form-name', type === 'contact' ? 'contact' : 'offer');
    
    // Add all form fields
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value);
    });

    // Add form type and timestamp
    form.append('form_type', type);
    form.append('submitted_at', new Date().toISOString());

    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(form as any).toString()
    });

    if (response.ok) {
      toast.success(
        type === 'contact' 
          ? "Thank you for your message! We'll get back to you soon."
          : "Your offer has been sent successfully!"
      );
      return true;
    } else {
      throw new Error('Netlify Forms failed');
    }
  } catch (error) {
    console.error('Netlify Forms error:', error);
    throw error;
  }
};