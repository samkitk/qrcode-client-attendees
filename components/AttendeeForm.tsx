'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Search, Info } from 'lucide-react';
import { attendeeApi, type Attendee, type VerifyRequest } from '@/lib/api';

interface AttendeeFormProps {
  onAttendeeVerified: (attendee: Attendee, correctionMessage?: string) => void;
}

export default function AttendeeForm({ onAttendeeVerified }: AttendeeFormProps) {
  const [mobile, setMobile] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [name, setName] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [verifyMode, setVerifyMode] = useState<'identifier' | 'name'>('identifier');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mobile.trim()) {
      setError('Please enter your mobile number');
      return;
    }

    if (verifyMode === 'identifier' && !identifier.trim()) {
      setError('Please enter your confirmation or application number');
      return;
    }

    if (verifyMode === 'name' && !name.trim()) {
      setError('Please enter your name');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const requestData: VerifyRequest = {
        mobile: mobile.trim(),
      };

      if (verifyMode === 'identifier') {
        requestData.identifier = identifier.trim();
      } else {
        requestData.name = name.trim();
      }

      const response = await attendeeApi.verify(requestData);
      
      // Show correction message if duplicate was fixed
      const message = response.corrected 
        ? response.message 
        : undefined;

      onAttendeeVerified(response.attendee, message);
    } catch (err: any) {
      console.error('Error verifying attendee:', err);
      
      if (err.response?.status === 404) {
        setError('No attendee found with the provided details. Please check your mobile number and confirmation/application number.');
      } else {
        setError(err.message || 'Failed to verify details. Please try again.');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-6 w-6" />
          Attendee Verification
        </CardTitle>
        <CardDescription>
          Enter your details to access your event QR code and ID card
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVerify} className="space-y-4">
          {/* Mobile Number - Required */}
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
          </div>

          {/* Verify Mode Toggle */}
          <div className="flex gap-2 mb-4">
            <Button
              type="button"
              variant={verifyMode === 'identifier' ? 'default' : 'outline'}
              onClick={() => setVerifyMode('identifier')}
              className="flex-1 text-sm"
              size="sm"
            >
              Use Confirmation/App Number
            </Button>
            <Button
              type="button"
              variant={verifyMode === 'name' ? 'default' : 'outline'}
              onClick={() => setVerifyMode('name')}
              className="flex-1 text-sm"
              size="sm"
            >
              Use Name
            </Button>
          </div>

          {/* Conditional Fields */}
          {verifyMode === 'identifier' ? (
            <div className="space-y-2">
              <Label htmlFor="identifier">Confirmation / Application Number *</Label>
              <Input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value.toUpperCase())}
                placeholder="e.g., YC-0202 or YC/GSYB/0202"
                required
              />
              <p className="text-xs text-muted-foreground">
                Enter your confirmation number (YC-0202) or application number (YC/GSYB/0202)
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value.toUpperCase())}
                placeholder="Enter your full name"
                required
              />
              <p className="text-xs text-muted-foreground">
                Enter your name as registered (e.g., RAJESH KAKKAD)
              </p>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-2">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-blue-900">
              <p className="font-medium mb-1">Having trouble?</p>
              <ul className="list-disc list-inside space-y-0.5 text-blue-800">
                <li>Ensure mobile number matches your registration</li>
                <li>Use the confirmation number from your confirmation email/SMS</li>
                <li>Or try searching by name instead</li>
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
          <Button type="submit" disabled={isVerifying} className="w-full">
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Verify & Access QR Code
              </>
            )}
          </Button>
        </form>

        {/* Footer Note */}
        <div className="mt-4 pt-4 border-t">
          <p className="text-xs text-center text-muted-foreground">
            Your details are already registered. This portal is for downloading your QR code and ID card.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
