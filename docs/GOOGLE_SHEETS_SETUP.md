# Google Sheets Product Management Setup

## Overview
This setup allows non-technical users to manage products through a Google Sheets interface.

## Setup Steps

### 1. Create Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet named "Tychem Products"
3. Create a sheet tab called "Products"
4. Add these column headers in row 1:
   - A1: Name
   - B1: Category  
   - C1: Description
   - D1: CAS
   - E1: Quantity
   - F1: Location
   - G1: Manufacturer
   - H1: Purity
   - I1: Applications (comma-separated)
   - J1: Hazard Class
   - K1: Storage Temp
   - L1: Handling (comma-separated)

### 2. Get Sheet ID
1. Copy the Sheet ID from the URL:
   `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`
2. Save this ID for later

### 3. Enable Google Sheets API
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable the Google Sheets API
4. Create credentials (API Key)
5. Restrict the API key to Google Sheets API only

### 4. Configure Environment
1. Add to your `.env` file:
   ```
   VITE_GOOGLE_SHEET_ID=your_sheet_id_here
   VITE_GOOGLE_SHEETS_API_KEY=your_api_key_here
   ```

### 5. Make Sheet Public
1. Click "Share" in your Google Sheet
2. Change access to "Anyone with the link can view"
3. This allows the API to read the data

## Usage

### Adding Products
1. Open your Google Sheet
2. Add a new row with product information
3. Save the sheet
4. Website will automatically fetch new data on next page load

### Editing Products
1. Find the product row in the sheet
2. Edit any cell
3. Save the sheet
4. Changes appear on website immediately

### Removing Products
1. Delete the entire row for the product
2. Save the sheet
3. Product disappears from website

## Data Format Examples

**Applications column:** "pH adjustment, Chemical manufacturing, Soap production"
**Handling column:** "Use appropriate PPE, Store in dry area, Avoid contact with acids"

## Benefits
- ✅ No technical knowledge required
- ✅ Real-time updates
- ✅ Collaborative editing
- ✅ Version history
- ✅ Easy backup/export