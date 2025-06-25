// Google Sheets integration for product management
interface SheetProduct {
  name: string;
  category: string;
  description: string;
  cas: string;
  quantity: string;
  location: string;
  manufacturer?: string;
  purity?: string;
  applications?: string;
  hazardClass?: string;
  storageTemp?: string;
  handling?: string;
}

const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;

export const fetchProductsFromSheets = async () => {
  try {
    const range = 'Products!A2:M1000'; // Adjust range as needed
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.values) return [];
    
    return data.values.map((row: string[], index: number) => ({
      id: index + 1,
      name: row[0] || '',
      category: row[1] || '',
      description: row[2] || '',
      cas: row[3] || '',
      quantity: row[4] || '',
      location: row[5] || '',
      manufacturer: row[6] || '',
      purity: row[7] || '',
      applications: row[8] ? row[8].split(',').map(app => app.trim()) : [],
      safetyInfo: {
        hazardClass: row[9] || '',
        storageTemp: row[10] || '',
        handling: row[11] ? row[11].split(',').map(h => h.trim()) : []
      }
    }));
  } catch (error) {
    console.error('Error fetching from Google Sheets:', error);
    return [];
  }
};