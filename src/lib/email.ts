import { toast } from "sonner";

interface FormData {
  [key: string]: string;
}

export const handleFormSubmission = async (formData: FormData, type: 'contact' | 'offer') => {
  try {
    // Create mailto link for instant email client opening
    const subject = type === 'contact' 
      ? 'Contact Form Submission from Tychem Website' 
      : `Offer for ${formData.productName || 'Product'} from Tychem Website`;
    
    const body = type === 'contact' 
      ? `Name: ${formData.name || 'Not provided'}
Email: ${formData.email || 'Not provided'}
Company: ${formData.company || 'Not provided'}
Phone: ${formData.phone || 'Not provided'}

Message:
${formData.message || 'No message provided'}

---
Sent from Tychem Website Contact Form`
      : `Name: ${formData.contactName || 'Not provided'}
Email: ${formData.email || 'Not provided'}
Company: ${formData.companyName || 'Not provided'}
Phone: ${formData.phone || 'Not provided'}

Product: ${formData.productName || 'Not specified'}
Offer Price: ${formData.offerPrice || 'Not specified'}

Comments:
${formData.comments || 'No additional comments'}

---
Sent from Tychem Website Offer Form`;

    const mailtoLink = `mailto:ty@tychem.net?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open email client immediately
    window.location.href = mailtoLink;
    
    // Show success message
    toast.success(
      type === 'contact' 
        ? "Opening your email client to send the message!"
        : "Opening your email client to send your offer!"
    );
    
    return true;
  } catch (error) {
    console.error('Error creating email:', error);
    toast.error("Unable to open email client. Please contact us directly at ty@tychem.net");
    return false;
  }
};