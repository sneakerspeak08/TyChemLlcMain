import { toast } from "sonner";

interface FormData {
  [key: string]: string;
}

export const handleFormSubmission = async (formData: FormData, type: 'contact' | 'offer') => {
  try {
    // Create form data object
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