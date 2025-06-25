import { toast } from "sonner";

interface FormData {
  [key: string]: string;
}

export const handleFormSubmission = async (formData: FormData, type: 'contact' | 'offer') => {
  try {
    // Create form data for direct submission
    const form = new FormData();
    
    // Add the recipient email
    form.append('_to', 'ty@tychem.net');
    
    // Add subject based on form type
    const subject = type === 'contact' 
      ? 'New Contact Form Submission from Tychem Website' 
      : `New Offer for ${formData.productName || 'Product'} from Tychem Website`;
    form.append('_subject', subject);
    
    // Add all form fields
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value);
    });

    // Add form type for identification
    form.append('form_type', type);
    
    // Add timestamp
    form.append('submitted_at', new Date().toISOString());

    // Submit directly to FormSubmit with AJAX
    const response = await fetch('https://formsubmit.co/ajax/ty@tychem.net', {
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
      throw new Error(result.message || 'Failed to send message');
    }
  } catch (error) {
    console.error('Error sending form:', error);
    toast.error("Failed to send message. Please try again or contact us directly at ty@tychem.net");
    return false;
  }
};