/**
 * GOOGLE SHEETS LEAD CAPTURE
 * 
 * HOW TO SET UP:
 * 1. Go to https://sheets.google.com and create a new spreadsheet
 * 2. Create two sheets (tabs): "Calculator Leads" and "Availability Leads"
 * 3. Go to Extensions > Apps Script
 * 4. Paste this entire script and save
 * 5. Click Deploy > New Deployment
 * 6. Select "Web app", set access to "Anyone", click Deploy
 * 7. Copy the Web App URL
 * 8. Update WEBHOOK_URL in app/config.ts with that URL
 * 9. Push to GitHub — done!
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    if (data.source === 'calculator') {
      const sheet = ss.getSheetByName('Calculator Leads') || ss.insertSheet('Calculator Leads');
      
      // Add headers if first row
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(['Timestamp', 'Name', 'Email', 'Phone', 'From', 'To', 'Size', 'Move Date', 'Distance']);
      }
      
      sheet.appendRow([
        new Date().toLocaleString(),
        data.fullName,
        data.email,
        data.phone,
        data.fromCity,
        data.toCity,
        data.moveSize,
        data.moveDate || 'Flexible',
        data.distance
      ]);

    } else if (data.source === 'availability') {
      const sheet = ss.getSheetByName('Availability Leads') || ss.insertSheet('Availability Leads');
      
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(['Timestamp', 'Zip Code', 'Move Date', 'Phone']);
      }
      
      sheet.appendRow([
        new Date().toLocaleString(),
        data.zip,
        data.moveDate,
        data.phone
      ]);
    }

    return ContentService.createTextOutput(
      JSON.stringify({ status: 'success' })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'error', message: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
