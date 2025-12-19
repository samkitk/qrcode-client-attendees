'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Search, Info } from 'lucide-react';
import { attendeeApi, type Attendee, type VerifyRequest } from '@/lib/api';

interface AttendeeFormProps {
  onAttendeeVerified: (attendee: Attendee, qrCodeData?: any) => void;
}

export default function AttendeeForm({ onAttendeeVerified }: AttendeeFormProps) {
  const [mobile, setMobile] = useState('');
  const [fullName, setFullName] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState('');

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      setError('Please enter your full name');
      return;
    }

    if (!mobile.trim()) {
      setError('Please enter your mobile number');
      return;
    }

    setIsDownloading(true);
    setError('');

    try {
      // Download by name and mobile combination only
      const response = await attendeeApi.getQRCodeByNameAndMobile(
        fullName.trim(),
        mobile.trim()
      );

      // Create a synthetic attendee object for the UI
      const attendee: Attendee = response.attendee;

      onAttendeeVerified(attendee, response);
    } catch (err: any) {
      console.error('Error downloading QR code:', err);

      if (err.response?.status === 404) {
        setError('No attendee found with this name and mobile combination. Please check your details and try again.');
      } else {
        setError(err.message || 'Failed to download QR code. Please try again.');
      }
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-6 w-6" />
          Download QR Code & ID Card
        </CardTitle>
        <CardDescription>
          Enter your name and mobile number to download your event QR code and ID card
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleDownload} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value.toUpperCase())}
              placeholder="Enter your full name in English"
              required
            />
            <p className="text-xs text-muted-foreground">
              Enter your name as registered (e.g., RAJESH KAKKAD)
            </p>
          </div>

          {/* Mobile Number */}
          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile Number *</Label>
            <Input
              id="mobile"
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter 10-digit mobile number"
              required
              maxLength={10}
              pattern="\d{10}"
            />
            <p className="text-xs text-muted-foreground">
              Enter your registered mobile number
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-2">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-blue-900">
              <p className="font-medium mb-1">How to download:</p>
              <ul className="list-disc list-inside space-y-0.5 text-blue-800">
                <li>Enter your full name in English exactly as registered</li>
                <li>Enter your 10-digit mobile number</li>
                <li>Click "Download QR Code & ID Card"</li>
              </ul>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button type="submit" disabled={isDownloading} className="w-full">
            {isDownloading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Download QR Code & ID Card
              </>
            )}
          </Button>
        </form>

        {/* Footer Note */}
        <div className="mt-4 pt-4 border-t">
          <p className="text-xs text-center text-muted-foreground">
            Your details are already registered. Enter your name and mobile number to download your QR code and ID card.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
