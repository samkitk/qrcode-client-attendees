'use client';

import { useState } from 'react';
import AttendeeForm from '@/components/AttendeeForm';
import AttendeeDetails from '@/components/AttendeeDetails';
import IDCard from '@/components/IDCard';
import { type Attendee } from '@/lib/api';
import { attendeeApi } from '@/lib/api';
import { downloadIDCard, downloadIDCardAsPDF } from '@/lib/qr-utils';
import { Loader2, Download, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [currentAttendee, setCurrentAttendee] = useState<Attendee | null>(null);
  const [qrCodeURL, setQrCodeURL] = useState<string>('');
  const [isLoadingQR, setIsLoadingQR] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showIDCard, setShowIDCard] = useState(false);
  const [correctionMessage, setCorrectionMessage] = useState<string>('');
  const [qrError, setQrError] = useState('');

  const handleAttendeeVerified = async (attendee: Attendee, qrCodeData?: any) => {
    setCurrentAttendee(attendee);
    setCorrectionMessage('');
    setShowIDCard(false);
    setQrError('');

    // If QR code data is provided directly, use it
    if (qrCodeData) {
      setQrCodeURL(qrCodeData.qrCode);
    } else {
      // Otherwise fetch from backend (fallback for old flow)
      await fetchQRCode(attendee.id);
    }
  };

  const fetchQRCode = async (attendeeId: string) => {
    setIsLoadingQR(true);
    setQrError('');
    
    try {
      const response = await attendeeApi.getQRCode(attendeeId);
      setQrCodeURL(response.qrCode);
      
      // Update attendee data with latest from QR endpoint (in case backend updated it)
      if (response.attendee) {
        setCurrentAttendee(response.attendee);
      }
    } catch (error) {
      console.error('Error fetching QR code:', error);
      setQrError('Failed to load QR code. Please try again.');
    } finally {
      setIsLoadingQR(false);
    }
  };

  const handleBack = () => {
    setCurrentAttendee(null);
    setQrCodeURL('');
    setShowIDCard(false);
    setCorrectionMessage('');
    setQrError('');
  };

  const handleDownloadIDCard = async (format: 'png' | 'pdf' | 'preview' = 'preview') => {
    if (!currentAttendee || !qrCodeURL) return;
    
    // Show preview
    if (format === 'preview') {
      setShowIDCard(true);
      return;
    }

    setIsDownloading(true);
    
    // Ensure card is rendered
    if (!showIDCard) {
      setShowIDCard(true);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    try {
      const filename = `event-id-card-${currentAttendee.fullName.replace(/\s+/g, '-')}-${currentAttendee.confirmationNumber}`;
      
      if (format === 'png') {
        await downloadIDCard('id-card-container', `${filename}.png`);
      } else if (format === 'pdf') {
        await downloadIDCardAsPDF('id-card-container', `${filename}.pdf`);
      }
    } catch (error) {
      console.error('Error downloading ID card:', error);
      alert('Failed to download ID card. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleClosePreview = () => {
    setShowIDCard(false);
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
              Enter your name and mobile number to download your event QR code & ID card
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col items-center justify-center">
          {/* Correction Message */}
          {correctionMessage && currentAttendee && (
            <div className="mb-6 w-full max-w-4xl bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-yellow-900">Duplicate Confirmation Number Detected</p>
                  <p className="text-sm text-yellow-800 mt-1">{correctionMessage}</p>
                </div>
              </div>
            </div>
          )}

          {!currentAttendee ? (
            <AttendeeForm onAttendeeVerified={handleAttendeeVerified} />
          ) : (
            <AttendeeDetails
              attendee={currentAttendee}
              qrCodeURL={qrCodeURL}
              isLoadingQR={isLoadingQR}
              qrError={qrError}
              onBack={handleBack}
              onDownloadIDCard={handleDownloadIDCard}
              onRetryQR={() => fetchQRCode(currentAttendee.id)}
            />
          )}

          {/* ID Card Preview/Download Modal */}
          {showIDCard && currentAttendee && qrCodeURL && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-gray-50 rounded-2xl p-6 max-w-md w-full shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Event ID Card Preview</h3>
                  <button
                    onClick={handleClosePreview}
                    disabled={isDownloading}
                    className="text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
                    aria-label="Close preview"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mb-4 flex justify-center">
                  <IDCard attendee={currentAttendee} qrCodeURL={qrCodeURL} />
                </div>

                {isDownloading ? (
                  <div className="flex items-center justify-center text-sm text-gray-600 py-3">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating ID card...
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 text-center mb-3">
                      Choose your preferred download format
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        onClick={() => handleDownloadIDCard('png')}
                        className="w-full"
                        variant="default"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        PNG Image
                      </Button>
                      <Button
                        onClick={() => handleDownloadIDCard('pdf')}
                        className="w-full"
                        variant="secondary"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        PDF Document
                      </Button>
                    </div>
                    <Button
                      onClick={handleClosePreview}
                      variant="outline"
                      className="w-full mt-2"
                    >
                      Close Preview
                    </Button>
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
          <p className="text-xs text-gray-500 mt-1">
            For support, contact the registration desk
          </p>
        </div>
      </footer>
    </div>
  );
}
