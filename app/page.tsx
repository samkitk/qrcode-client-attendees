'use client';

import { useState, useEffect } from 'react';
import AttendeeForm from '@/components/AttendeeForm';
import AttendeeDetails from '@/components/AttendeeDetails';
import IDCard from '@/components/IDCard';
import { type Attendee } from '@/lib/api';
import { generateQRCodeDataURL, createQRData, downloadIDCard, downloadIDCardAsPDF } from '@/lib/qr-utils';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [currentAttendee, setCurrentAttendee] = useState<Attendee | null>(null);
  const [qrCodeURL, setQrCodeURL] = useState<string>('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [showIDCard, setShowIDCard] = useState(false);

  useEffect(() => {
    if (currentAttendee) {
      generateQR();
    }
  }, [currentAttendee]);

  const generateQR = async () => {
    if (!currentAttendee) return;
    
    try {
      const qrData = createQRData(currentAttendee);
      const qrURL = await generateQRCodeDataURL(qrData);
      setQrCodeURL(qrURL);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const handleAttendeeFound = (attendee: Attendee) => {
    setCurrentAttendee(attendee);
    setShowIDCard(false);
  };

  const handleBack = () => {
    setCurrentAttendee(null);
    setQrCodeURL('');
    setShowIDCard(false);
  };

  const handleDownloadIDCard = async () => {
    if (!currentAttendee || !qrCodeURL) return;
    
    setIsDownloading(true);
    setShowIDCard(true);

    // Wait for the ID card to render
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      // Download as PNG
      await downloadIDCard('id-card-container', `event-id-card-${currentAttendee.mobile}.png`);
      
      // Optionally also generate PDF
      // await downloadIDCardAsPDF('id-card-container', `event-id-card-${currentAttendee.mobile}.pdf`);
    } catch (error) {
      console.error('Error downloading ID card:', error);
      alert('Failed to download ID card. Please try again.');
    } finally {
      setIsDownloading(false);
      // Keep the ID card visible for a moment then hide it
      setTimeout(() => setShowIDCard(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Event Attendee Portal
            </h1>
            <p className="text-gray-600 mt-2 text-sm md:text-base">
              Generate your QR code and download your event ID card
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col items-center justify-center">
          {!currentAttendee ? (
            <AttendeeForm onAttendeeFound={handleAttendeeFound} />
          ) : (
            <AttendeeDetails
              attendee={currentAttendee}
              onBack={handleBack}
              onDownloadIDCard={handleDownloadIDCard}
            />
          )}

          {/* Hidden ID Card for download */}
          {showIDCard && currentAttendee && qrCodeURL && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-6 max-w-md">
                <IDCard attendee={currentAttendee} qrCodeURL={qrCodeURL} />
                {isDownloading && (
                  <div className="mt-4 flex items-center justify-center text-sm text-gray-600">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating ID card...
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Event Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
