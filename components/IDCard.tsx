'use client';

import { type Attendee } from '@/lib/api';
import { QrCode, User, Mail, Phone, Building, Briefcase } from 'lucide-react';

interface IDCardProps {
  attendee: Attendee;
  qrCodeURL: string;
}

export default function IDCard({ attendee, qrCodeURL }: IDCardProps) {
  return (
    <div
      id="id-card-container"
      className="w-[400px] bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl shadow-2xl overflow-hidden"
      style={{ aspectRatio: '5/7' }}
    >
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm px-6 py-4 text-center">
        <h2 className="text-white text-2xl font-bold">EVENT ID CARD</h2>
        {attendee.eventName && (
          <p className="text-white/90 text-sm mt-1">{attendee.eventName}</p>
        )}
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        {/* QR Code */}
        <div className="flex justify-center">
          <div className="bg-white p-3 rounded-xl shadow-lg">
            <img src={qrCodeURL} alt="QR Code" className="w-40 h-40" />
          </div>
        </div>

        {/* Attendee Details */}
        <div className="bg-white/95 rounded-xl p-5 space-y-3">
          <div className="border-b border-gray-200 pb-3">
            <div className="flex items-center gap-2 mb-1">
              <User className="h-4 w-4 text-blue-600" />
              <p className="text-xs font-medium text-gray-600">NAME</p>
            </div>
            <p className="text-lg font-bold text-gray-900">{attendee.name}</p>
          </div>

          {attendee.organization && (
            <div className="border-b border-gray-200 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <Building className="h-4 w-4 text-blue-600" />
                <p className="text-xs font-medium text-gray-600">ORGANIZATION</p>
              </div>
              <p className="text-sm font-semibold text-gray-900">{attendee.organization}</p>
            </div>
          )}

          {attendee.designation && (
            <div className="border-b border-gray-200 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <Briefcase className="h-4 w-4 text-blue-600" />
                <p className="text-xs font-medium text-gray-600">DESIGNATION</p>
              </div>
              <p className="text-sm font-semibold text-gray-900">{attendee.designation}</p>
            </div>
          )}

          <div className="border-b border-gray-200 pb-3">
            <div className="flex items-center gap-2 mb-1">
              <Phone className="h-4 w-4 text-blue-600" />
              <p className="text-xs font-medium text-gray-600">MOBILE</p>
            </div>
            <p className="text-sm font-semibold text-gray-900">{attendee.mobile}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-blue-600" />
              <p className="text-xs font-medium text-gray-600">EMAIL</p>
            </div>
            <p className="text-sm font-semibold text-gray-900 break-all">{attendee.email}</p>
          </div>
        </div>

        {/* Footer */}
        {(attendee.eventDate || attendee.venue) && (
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 text-center">
            {attendee.eventDate && (
              <p className="text-xs font-semibold text-gray-800">{attendee.eventDate}</p>
            )}
            {attendee.venue && (
              <p className="text-xs text-gray-700 mt-1">{attendee.venue}</p>
            )}
          </div>
        )}

        {/* ID Number */}
        <div className="text-center">
          <p className="text-white/70 text-xs font-mono">ID: {attendee.id}</p>
        </div>
      </div>
    </div>
  );
}

