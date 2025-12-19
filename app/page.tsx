'use client';

import { useState } from 'react';
import AttendeeForm from '@/components/AttendeeForm';
import AttendeeDetails from '@/components/AttendeeDetails';
import { type Attendee } from '@/lib/api';
import { attendeeApi } from '@/lib/api';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [currentAttendee, setCurrentAttendee] = useState<Attendee | null>(null);
  const [attendeeList, setAttendeeList] = useState<Attendee[]>([]);
  const [qrCodeURL, setQrCodeURL] = useState<string>('');
  const [isLoadingQR, setIsLoadingQR] = useState(false);
  const [qrError, setQrError] = useState('');

  const handleAttendeeVerified = async (_: any, response: any) => {
    setQrError('');
    setAttendeeList([]);
    setCurrentAttendee(null);

    // Check if the response matches new format with array
    if (response.attendees && Array.isArray(response.attendees)) {
      if (response.attendees.length === 1) {
        // Only one match, auto-select
        selectAttendee(response.attendees[0]);
      } else if (response.attendees.length > 1) {
        // Multiple matches, show list
        setAttendeeList(response.attendees);
      } else {
        // Should be caught by catch block in form, but just in case
        console.error('No attendees found in successful response');
      }
    } else if (response.attendee) {
      // Fallback for old/single response structure
      selectAttendee(response.attendee);
    }
  };

  const selectAttendee = async (attendee: Attendee) => {
    setCurrentAttendee(attendee);
    setAttendeeList([]); // Clear list to show details view
    await fetchQRCode(attendee.id);
  };

  const fetchQRCode = async (attendeeId: string) => {
    setIsLoadingQR(true);
    setQrError('');

    try {
      const response = await attendeeApi.getQRCode(attendeeId);
      setQrCodeURL(response.qrCode);

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
    setQrError('');
    // If we had a list, clearing currentAttendee will show the form again.
    // To go back to list, we would need more state, but going back to form is safer.
    setAttendeeList([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Header */}
      <header className="bg-white border-b-2 border-[#3F6EA7] shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center text-center gap-4">
            {/* Logo */}
            <img
              src="/logo-1.png"
              alt="Gujarat State Yoga Board"
              className="h-16 md:h-20 w-auto"
            />

            {/* Event Title - Gujarati */}
            <h1 className="text-xl md:text-2xl font-bold text-[#3F6EA7]">
              ગુજરાત રાજ્ય યોગ બોર્ડના યોગ કોચ અને યોગ ટ્રેનર્સની દીક્ષાંત સમારોહ અને વિશ્વ ધ્યાન દિવસની ઉજવણી
            </h1>

            {/* Event Title - English */}
            <h2 className="text-lg md:text-xl font-semibold text-[#3F6EA7]">
              Convocation Ceremony of Yoga Coaches and Yoga Trainers of Gujarat State Yoga Board and Celebration of World Meditation Day
            </h2>

            {/* Subtitle */}
            <p className="text-gray-600 mt-2 text-sm md:text-base">
              Enter your mobile number or code to download your event QR code
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col items-center justify-center">
          {/* Multiple Attendees List Selection */}
          {attendeeList.length > 0 && !currentAttendee ? (
            <div className="w-full max-w-2xl">
              <div className="bg-white rounded-xl shadow-md overflow-hidden border-2 border-[#3F6EA7]">
                <div className="bg-[#3F6EA7] p-4 border-b border-blue-100">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Multiple Registrations Found
                  </h2>
                  <p className="text-sm text-blue-50 mt-1">
                    We found multiple registrations for your number. Please select the correct one.
                  </p>
                </div>
                <div className="divide-y">
                  {attendeeList.map((attendee) => (
                    <button
                      key={attendee.id}
                      onClick={() => selectAttendee(attendee)}
                      className="w-full text-left p-4 hover:bg-blue-50 transition-colors flex justify-between items-center group"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">{attendee.fullName}</p>
                        <p className="text-sm text-gray-500">
                          {attendee.confirmationNumber} • {attendee.role || 'Attendee'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Registered: {new Date(attendee.timestamp || Date.now()).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-[#3F6EA7] opacity-0 group-hover:opacity-100 transition-opacity">
                        Select →
                      </div>
                    </button>
                  ))}
                </div>
                <div className="p-4 bg-gray-50 border-t">
                  <Button variant="outline" onClick={() => setAttendeeList([])} className="w-full">
                    Cancel / Search Again
                  </Button>
                </div>
              </div>
            </div>
          ) : !currentAttendee ? (
            <AttendeeForm onAttendeeVerified={handleAttendeeVerified} />
          ) : (
            <AttendeeDetails
              attendee={currentAttendee}
              qrCodeURL={qrCodeURL}
              isLoadingQR={isLoadingQR}
              qrError={qrError}
              onBack={handleBack}
              onRetryQR={() => fetchQRCode(currentAttendee.id)}
            />
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
