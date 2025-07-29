import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface ReceiptData {
  id: string;
  companyInfo: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  customerInfo: {
    name: string;
    email: string;
    address: string;
    phone: string;
  };
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    tax: number;
  }>;
  notes: string;
  subtotal: number;
  totalTax: number;
  total: number;
  createdAt: string;
  createdBy: string; // User ID of the creator
}

export const generateReceiptPDF = async (receiptData: ReceiptData): Promise<Blob> => {
  // Create a temporary div to render the receipt
  const receiptElement = document.createElement('div');
  receiptElement.className = 'receipt-pdf-container';
  receiptElement.style.cssText = `
    width: 800px;
    padding: 40px;
    background: white;
    font-family: Arial, sans-serif;
    color: #333;
    position: absolute;
    left: -9999px;
    top: 0;
  `;

  // Generate receipt HTML
  receiptElement.innerHTML = `
    <div style="border: 2px solid #e5e7eb; padding: 30px; border-radius: 8px;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px;">
        <h1 style="color: #1f2937; margin: 0; font-size: 28px; font-weight: bold;">${receiptData.companyInfo.name}</h1>
        <p style="color: #6b7280; margin: 5px 0; font-size: 14px;">${receiptData.companyInfo.address}</p>
        <p style="color: #6b7280; margin: 5px 0; font-size: 14px;">Phone: ${receiptData.companyInfo.phone} | Email: ${receiptData.companyInfo.email}</p>
      </div>

      <!-- Receipt Info -->
      <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
        <div>
          <h3 style="color: #1f2937; margin: 0 0 10px 0; font-size: 18px;">Bill To:</h3>
          <p style="color: #374151; margin: 5px 0; font-size: 14px;"><strong>${receiptData.customerInfo.name}</strong></p>
          <p style="color: #6b7280; margin: 5px 0; font-size: 14px;">${receiptData.customerInfo.address}</p>
          <p style="color: #6b7280; margin: 5px 0; font-size: 14px;">Email: ${receiptData.customerInfo.email}</p>
        </div>
        <div style="text-align: right;">
          <p style="color: #6b7280; margin: 5px 0; font-size: 14px;"><strong>Receipt ID:</strong> ${receiptData.id}</p>
          <p style="color: #6b7280; margin: 5px 0; font-size: 14px;"><strong>Date:</strong> ${receiptData.createdAt}</p>
        </div>
      </div>

      <!-- Items Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <thead>
          <tr style="background-color: #f9fafb; border-bottom: 2px solid #e5e7eb;">
            <th style="text-align: left; padding: 12px; color: #374151; font-size: 14px; font-weight: bold;">Item</th>
            <th style="text-align: center; padding: 12px; color: #374151; font-size: 14px; font-weight: bold;">Qty</th>
            <th style="text-align: right; padding: 12px; color: #374151; font-size: 14px; font-weight: bold;">Unit Price</th>
            <th style="text-align: center; padding: 12px; color: #374151; font-size: 14px; font-weight: bold;">Tax %</th>
            <th style="text-align: right; padding: 12px; color: #374151; font-size: 14px; font-weight: bold;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${receiptData.items.map(item => {
            const itemSubtotal = item.quantity * item.unitPrice;
            const itemTax = (itemSubtotal * item.tax) / 100;
            const itemTotal = itemSubtotal + itemTax;
            return `
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 12px; color: #374151; font-size: 14px;">${item.name}</td>
                <td style="text-align: center; padding: 12px; color: #374151; font-size: 14px;">${item.quantity}</td>
                <td style="text-align: right; padding: 12px; color: #374151; font-size: 14px;">$${item.unitPrice.toFixed(2)}</td>
                <td style="text-align: center; padding: 12px; color: #374151; font-size: 14px;">${item.tax}%</td>
                <td style="text-align: right; padding: 12px; color: #374151; font-size: 14px; font-weight: bold;">$${itemTotal.toFixed(2)}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>

      <!-- Totals -->
      <div style="margin-left: auto; width: 300px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: #6b7280; font-size: 14px;">Subtotal:</span>
          <span style="color: #374151; font-size: 14px; font-weight: bold;">$${receiptData.subtotal.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: #6b7280; font-size: 14px;">Tax:</span>
          <span style="color: #374151; font-size: 14px; font-weight: bold;">$${receiptData.totalTax.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; border-top: 2px solid #e5e7eb; padding-top: 8px; margin-top: 8px;">
          <span style="color: #1f2937; font-size: 16px; font-weight: bold;">Total:</span>
          <span style="color: #1f2937; font-size: 18px; font-weight: bold;">$${receiptData.total.toFixed(2)}</span>
        </div>
      </div>

      <!-- Notes -->
      ${receiptData.notes ? `
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <h4 style="color: #1f2937; margin: 0 0 10px 0; font-size: 16px;">Notes:</h4>
          <p style="color: #6b7280; margin: 0; font-size: 14px; line-height: 1.5;">${receiptData.notes}</p>
        </div>
      ` : ''}

      <!-- Footer -->
      <div style="margin-top: 40px; text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="color: #9ca3af; margin: 0; font-size: 12px;">Thank you for your business!</p>
      </div>
    </div>
  `;

  // Add to document temporarily
  document.body.appendChild(receiptElement);

  try {
    // Convert to canvas
    const canvas = await html2canvas(receiptElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    // Convert to PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Convert to blob
    const pdfBlob = pdf.output('blob');
    return pdfBlob;
  } finally {
    // Clean up
    document.body.removeChild(receiptElement);
  }
};

export const downloadPDF = async (receiptData: ReceiptData): Promise<void> => {
  try {
    const pdfBlob = await generateReceiptPDF(receiptData);
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt-${receiptData.id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};

export const sendEmailWithReceipt = async (receiptData: ReceiptData): Promise<void> => {
  try {
    const pdfBlob = await generateReceiptPDF(receiptData);
    const url = URL.createObjectURL(pdfBlob);
    
    // Create mailto link with attachment (note: this is a simplified approach)
    const subject = encodeURIComponent('Your Receipt from Belednai Technology');
    const body = encodeURIComponent(`Dear ${receiptData.customerInfo.name},\n\nPlease find your receipt attached.\n\nThank you for your business!\n\nBest regards,\n${receiptData.companyInfo.name}`);
    
    // Note: Most email clients don't support attachments via mailto
    // This will open the default email client with pre-filled subject and body
    const mailtoLink = `mailto:${receiptData.customerInfo.email}?subject=${subject}&body=${body}`;
    
    window.open(mailtoLink);
    
    // Clean up
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

export const saveReceiptToDatabase = async (receiptData: ReceiptData): Promise<void> => {
  // For now, we'll store in localStorage as a simple mock database
  // In production, this would call Firebase Firestore
  console.log('Saving receipt to database:', receiptData);
  
  const existingReceipts = JSON.parse(localStorage.getItem('receipts') || '[]');
  existingReceipts.unshift(receiptData);
  localStorage.setItem('receipts', JSON.stringify(existingReceipts));
}; 