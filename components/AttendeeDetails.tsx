'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, QrCode, User, Mail, Phone, Building, Briefcase, Calendar, MapPin, ArrowLeft } from 'lucide-react';
import { type Attendee } from '@/lib/api';
import { generateQRCodeDataURL, createQRData, downloadQRCode } from '@/lib/qr-utils';

interface AttendeeDetailsProps {
  attendee: Attendee;
  onBack: () => void;
  onDownloadIDCard: () => void;
}

export default function AttendeeDetails({ attendee, onBack, onDownloadIDCard }: AttendeeDetailsProps) {
  const [qrCodeURL, setQrCodeURL] = useState<string>('');
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);

  useEffect(() => {
    generateQR();
  }, [attendee]);

  const generateQR = async () => {
    setIsGeneratingQR(true);
    try {
      const qrData = createQRData(attendee);
      const qrURL = await generateQRCodeDataURL(qrData);
      setQrCodeURL(qrURL);
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setIsGeneratingQR(false);
    }
  };

  const handleDownloadQR = () => {
    if (qrCodeURL) {
      downloadQRCode(qrCodeURL, `qrcode-${attendee.mobile}.png`);
    }
  };

  return (
    <div className="w-full max-w-4xl space-y-6">
      <Button variant="outline" onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Search
      </Button>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Attendee Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Attendee Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">{attendee.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Mobile Number</p>
                  <p className="font-medium">{attendee.mobile}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Email Address</p>
                  <p className="font-medium">{attendee.email}</p>
                </div>
              </div>

              {attendee.organization && (
                <div className="flex items-start gap-3">
                  <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Organization</p>
                    <p className="font-medium">{attendee.organization}</p>
                  </div>
                </div>
              )}

              {attendee.designation && (
                <div className="flex items-start gap-3">
                  <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Designation</p>
                    <p className="font-medium">{attendee.designation}</p>
                  </div>
                </div>
              )}

              {attendee.eventName && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Event</p>
                    <p className="font-medium">{attendee.eventName}</p>
                    {attendee.eventDate && (
                      <p className="text-sm text-muted-foreground mt-1">{attendee.eventDate}</p>
                    )}
                  </div>
                </div>
              )}

              {attendee.venue && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Venue</p>
                    <p className="font-medium">{attendee.venue}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* QR Code Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Your QR Code
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            {isGeneratingQR ? (
              <div className="w-64 h-64 flex items-center justify-center bg-gray-100 rounded-lg">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : qrCodeURL ? (
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <img src={qrCodeURL} alt="QR Code" className="w-64 h-64" />
              </div>
            ) : (
              <div className="w-64 h-64 flex items-center justify-center bg-gray-100 rounded-lg">
                <p className="text-muted-foreground">Unable to generate QR code</p>
              </div>
            )}

            <p className="text-sm text-center text-muted-foreground">
              Scan this QR code at the event entrance for quick check-in
            </p>

            <div className="flex flex-col w-full gap-3">
              <Button
                onClick={handleDownloadQR}
                disabled={!qrCodeURL}
                className="w-full"
              >
                <Download className="mr-2 h-4 w-4" />
                Download QR Code
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Download ID Card Button */}
      <Card>
        <CardContent className="pt-6">
          <Button
            onClick={onDownloadIDCard}
            size="lg"
            className="w-full"
          >
            <Download className="mr-2 h-5 w-5" />
            Download Event ID Card
          </Button>
          <p className="text-sm text-center text-muted-foreground mt-3">
            Download your personalized event ID card with QR code
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

