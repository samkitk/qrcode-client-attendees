'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Search, UserPlus } from 'lucide-react';
import { attendeeApi, type Attendee, type AttendeeRegistrationRequest } from '@/lib/api';

interface AttendeeFormProps {
  onAttendeeFound: (attendee: Attendee) => void;
}

export default function AttendeeForm({ onAttendeeFound }: AttendeeFormProps) {
  const [mobile, setMobile] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  
  const [registrationData, setRegistrationData] = useState<AttendeeRegistrationRequest>({
    mobile: '',
    name: '',
    email: '',
    organization: '',
    designation: '',
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile.trim()) {
      setError('Please enter a mobile number');
      return;
    }

    setIsSearching(true);
    setError('');

    try {
      const attendee = await attendeeApi.getByMobile(mobile);
      onAttendeeFound(attendee);
    } catch (err: any) {
      console.error('Error fetching attendee:', err);
      if (err.response?.status === 404) {
        setShowRegistration(true);
        setRegistrationData({ ...registrationData, mobile });
      } else {
        setError(err.message || 'Failed to fetch attendee details. Please try again.');
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registrationData.name || !registrationData.email) {
      setError('Name and email are required');
      return;
    }

    setIsRegistering(true);
    setError('');

    try {
      const attendee = await attendeeApi.register(registrationData);
      onAttendeeFound(attendee);
      setShowRegistration(false);
    } catch (err: any) {
      console.error('Error registering attendee:', err);
      setError(err.message || 'Failed to register. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleInputChange = (field: keyof AttendeeRegistrationRequest, value: string) => {
    setRegistrationData(prev => ({ ...prev, [field]: value }));
  };

  if (showRegistration) {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-6 w-6" />
            New Attendee Registration
          </CardTitle>
          <CardDescription>
            Mobile number not found. Please register with your details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegistration} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number *</Label>
              <Input
                id="mobile"
                type="tel"
                value={registrationData.mobile}
                onChange={(e) => handleInputChange('mobile', e.target.value)}
                placeholder="Enter mobile number"
                required
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                type="text"
                value={registrationData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={registrationData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="organization">Organization</Label>
              <Input
                id="organization"
                type="text"
                value={registrationData.organization}
                onChange={(e) => handleInputChange('organization', e.target.value)}
                placeholder="Enter your organization"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="designation">Designation</Label>
              <Input
                id="designation"
                type="text"
                value={registrationData.designation}
                onChange={(e) => handleInputChange('designation', e.target.value)}
                placeholder="Enter your designation"
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowRegistration(false);
                  setMobile('');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isRegistering} className="flex-1">
                {isRegistering ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  'Register'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-6 w-6" />
          Attendee Check-in
        </CardTitle>
        <CardDescription>
          Enter your mobile number to retrieve your event details and QR code.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile Number</Label>
            <Input
              id="mobile"
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter your mobile number"
              required
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <Button type="submit" disabled={isSearching} className="w-full">
            {isSearching ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Find My Details
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

