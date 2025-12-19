'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, QrCode, User, Mail, Phone, Building, Briefcase, Calendar, MapPin, ArrowLeft, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import { type Attendee } from '@/lib/api';
import { downloadQRCode } from '@/lib/qr-utils';

interface AttendeeDetailsProps {
  attendee: Attendee;
  qrCodeURL: string;
  isLoadingQR: boolean;
  qrError: string;
  onBack: () => void;
  onRetryQR: () => void;
}

export default function AttendeeDetails({
  attendee,
  qrCodeURL,
  isLoadingQR,
  qrError,
  onBack,
  onRetryQR
}: AttendeeDetailsProps) {
  const handleDownloadQR = () => {
    if (qrCodeURL) {
      downloadQRCode(qrCodeURL, `qrcode-${attendee.confirmationNumber}.png`);
    }
  };

  return (
    <div className="w-full max-w-4xl space-y-6">
      <Button variant="outline" onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Search
      </Button>

      {/* Check-in Status Banner */}
      {attendee.isCheckedIn && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-900">Already Checked In</p>
              <p className="text-sm text-green-800">You have successfully checked in to the event.</p>
            </div>
          </div>
        </div>
      )}

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
              {/* Name */}
              <div className="flex items-start gap-3 bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border-l-4 border-blue-600">
                <User className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide font-medium">Full Name</p>
                  <p className="font-bold text-gray-900 mt-0.5">{attendee.fullName}</p>
                </div>
              </div>

              {/* Confirmation Number */}
              <div className="flex items-start gap-3 bg-green-50 p-3 rounded-lg border-l-4 border-green-600">
                <div className="bg-green-100 p-1.5 rounded-lg mt-0.5">
                  <QrCode className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide font-medium">Confirmation Number</p>
                  <p className="font-bold text-gray-900 text-lg mt-0.5">{attendee.confirmationNumber}</p>
                </div>
              </div>

              {/* Mobile */}
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Mobile Number</p>
                  <p className="font-medium">{attendee.mobile}</p>
                </div>
              </div>

              {/* Role */}
              {attendee.role && (
                <div className="flex items-start gap-3">
                  <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Role</p>
                    <p className="font-medium">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${attendee.role === 'COACH'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                        }`}>
                        {attendee.role}
                      </span>
                    </p>
                  </div>
                </div>
              )}

              {/* District */}
              {attendee.district && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">District</p>
                    <p className="font-medium">{attendee.district}</p>
                    {attendee.taluka && (
                      <p className="text-xs text-gray-500">Taluka: {attendee.taluka}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Tracksuit Size */}
              {attendee.tracksuitSize && (
                <div className="flex items-start gap-3">
                  <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Tracksuit Size</p>
                    <p className="font-medium">{attendee.tracksuitSize}</p>
                  </div>
                </div>
              )}

              {/* Event Details */}
              {attendee.eventName && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Event</p>
                    <p className="font-medium">{attendee.eventName}</p>
                    {attendee.eventDate && (
                      <p className="text-sm text-gray-600 mt-1">{attendee.eventDate}</p>
                    )}
                    {attendee.venue && (
                      <p className="text-xs text-gray-500 mt-1">{attendee.venue}</p>
                    )}
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
              Your Event QR Code
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            {isLoadingQR ? (
              <div className="w-64 h-64 flex items-center justify-center bg-gray-100 rounded-lg">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="text-sm text-gray-600 mt-3">Loading QR code...</p>
                </div>
              </div>
            ) : qrError ? (
              <div className="w-64 min-h-64 flex flex-col items-center justify-center bg-red-50 rounded-lg p-6 border-2 border-red-200">
                <AlertCircle className="h-12 w-12 text-red-500 mb-3" />
                <p className="text-sm text-red-800 text-center mb-4">{qrError}</p>
                <Button onClick={onRetryQR} variant="outline" size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retry
                </Button>
              </div>
            ) : qrCodeURL ? (
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <img src={qrCodeURL} alt="Event Check-in QR Code" className="w-64 h-64" />
              </div>
            ) : (
              <div className="w-64 h-64 flex items-center justify-center bg-gray-100 rounded-lg">
                <p className="text-muted-foreground text-center px-4">QR code unavailable</p>
              </div>
            )}

            <p className="text-sm text-center text-muted-foreground max-w-xs">
              Show this QR code at the registration desk for quick check-in
            </p>

            <div className="flex flex-col w-full gap-3">
              <Button
                onClick={handleDownloadQR}
                disabled={!qrCodeURL || isLoadingQR}
                className="w-full"
              >
                <Download className="mr-2 h-4 w-4" />
                Download QR Code
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
