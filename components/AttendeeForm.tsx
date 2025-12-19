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
  const [query, setQuery] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) {
      setError('Please enter your mobile number or confirmation code');
      return;
    }

    setIsDownloading(true);
    setError('');

    try {
      // Use the verify endpoint which now supports searching by mobile OR confirmation code
      const response = await attendeeApi.verify({
        query: query.trim()
      });

      // Pass the whole response (which contains 'attendees' array) to the parent
      onAttendeeVerified(null as any, response);
    } catch (err: any) {
      console.error('Error verifying attendee:', err);

      if (err.status === 404 || err.response?.status === 404) {
        setError('No attendee found with these details. Please check and try again.');
      } else {
        setError(err.message || 'Failed to verify. Please try again.');
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
          Enter your Mobile Number OR Confirmation Code to search
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVerify} className="space-y-4">
          {/* Mobile or Confirmation Code */}
          <div className="space-y-2">
            <Label htmlFor="query">Mobile Number or Confirmation Code *</Label>
            <Input
              id="query"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value.toUpperCase())}
              placeholder="e.g. 9876543210 or YC-0202"
              required
            />
            <p className="text-xs text-muted-foreground">
              Enter either your registered mobile number OR your confirmation code
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-2">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-blue-900">
              <p className="font-medium mb-1">How to download:</p>
              <ul className="list-disc list-inside space-y-0.5 text-blue-800">
                <li>Enter your 10-digit mobile number OR</li>
                <li>Enter your Confirmation Code (e.g. YC-1234)</li>
                <li>Click "Search & Download" button</li>
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
                Searching...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Search & Download
              </>
            )}
          </Button>
        </form>

        {/* Footer Note */}
        <div className="mt-4 pt-4 border-t">
          <p className="text-xs text-center text-muted-foreground">
            Your details are already registered. Enter your mobile number or confirmation code to search for your QR code and ID card.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
