import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Attendee } from './api';

/**
 * Generate QR code as data URL
 */
export const generateQRCodeDataURL = async (data: string): Promise<string> => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(data, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

/**
 * Download QR code as PNG image
 */
export const downloadQRCode = (dataURL: string, filename: string = 'qrcode.png') => {
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Generate ID card as image and download
 */
export const downloadIDCard = async (elementId: string, filename: string = 'id-card.png') => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found');
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false,
    });

    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error generating ID card:', error);
    throw error;
  }
};

/**
 * Generate ID card as PDF and download
 */
export const downloadIDCardAsPDF = async (elementId: string, filename: string = 'id-card.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found');
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 85; // ID card width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const x = (pdf.internal.pageSize.getWidth() - imgWidth) / 2;
    const y = 20;

    pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

/**
 * Create QR code data string from attendee info
 */
export const createQRData = (attendee: Attendee): string => {
  return JSON.stringify({
    id: attendee.id,
    name: attendee.name,
    mobile: attendee.mobile,
    email: attendee.email,
    organization: attendee.organization,
  });
};

