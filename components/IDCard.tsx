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
      className="w-[400px] bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-2xl shadow-2xl overflow-hidden relative"
      style={{ aspectRatio: '5/7' }}
    >
      {/* Decorative Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white rounded-full -ml-20 -mb-20"></div>
      </div>

      {/* Header */}
      <div className="relative bg-white/10 backdrop-blur-sm px-6 py-5 text-center border-b border-white/20">
        <div className="flex items-center justify-center mb-2">
          {/* Logo placeholder - can be replaced with actual logo */}
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </div>
        <h2 className="text-white text-2xl font-bold tracking-wide">EVENT ID CARD</h2>
        {attendee.eventName && (
          <p className="text-white/95 text-sm mt-1 font-medium">{attendee.eventName}</p>
        )}
      </div>

      {/* Content */}
      <div className="relative px-6 py-6 space-y-5">
        {/* QR Code with Badge */}
        <div className="flex flex-col items-center">
          <div className="bg-white p-4 rounded-xl shadow-xl border-2 border-white/50 relative">
            <img src={qrCodeURL} alt="QR Code" className="w-40 h-40" />
            {/* Scan indicator */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <div className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                SCAN
              </div>
            </div>
          </div>
        </div>

        {/* Attendee Details */}
        <div className="bg-white/98 backdrop-blur-sm rounded-xl p-5 space-y-3 shadow-lg border border-white/50">
          {/* Name - Highlighted */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 border-l-4 border-blue-600">
            <div className="flex items-center gap-2 mb-1">
              <User className="h-4 w-4 text-blue-600" />
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Name</p>
            </div>
            <p className="text-xl font-bold text-gray-900">{attendee.fullName}</p>
          </div>

          {/* Other Details */}
          <div className="grid grid-cols-1 gap-3">
            {/* Confirmation Number */}
            <div className="flex items-start gap-3">
              <div className="mt-0.5 bg-green-100 p-1.5 rounded-lg">
                <QrCode className="h-3.5 w-3.5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Confirmation Number</p>
                <p className="text-sm font-semibold text-gray-900">{attendee.confirmationNumber}</p>
              </div>
            </div>

            {/* Role */}
            {attendee.role && (
              <div className="flex items-start gap-3">
                <div className="mt-0.5 bg-purple-100 p-1.5 rounded-lg">
                  <Briefcase className="h-3.5 w-3.5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Role</p>
                  <p className="text-sm font-semibold text-gray-900">{attendee.role}</p>
                </div>
              </div>
            )}

            {/* District */}
            {attendee.district && (
              <div className="flex items-start gap-3">
                <div className="mt-0.5 bg-blue-100 p-1.5 rounded-lg">
                  <Building className="h-3.5 w-3.5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">District</p>
                  <p className="text-sm font-semibold text-gray-900">{attendee.district}</p>
                  {attendee.taluka && (
                    <p className="text-xs text-gray-600">Taluka: {attendee.taluka}</p>
                  )}
                </div>
              </div>
            )}

            {/* Tracksuit Size */}
            {attendee.tracksuitSize && (
              <div className="flex items-start gap-3">
                <div className="mt-0.5 bg-orange-100 p-1.5 rounded-lg">
                  <svg className="h-3.5 w-3.5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h8a4 4 0 004-4V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 01-4 4z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Tracksuit Size</p>
                  <p className="text-sm font-semibold text-gray-900">{attendee.tracksuitSize}</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <div className="mt-0.5 bg-green-100 p-1.5 rounded-lg">
                <Phone className="h-3.5 w-3.5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Mobile</p>
                <p className="text-sm font-semibold text-gray-900">{attendee.mobile}</p>
              </div>
            </div>

          </div>
        </div>

        {/* Event Details Footer */}
        {(attendee.eventDate || attendee.venue) && (
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 text-center border border-white/50 shadow-md">
            {attendee.eventDate && (
              <div className="flex items-center justify-center gap-2 mb-1">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-xs font-bold text-gray-800">{attendee.eventDate}</p>
              </div>
            )}
            {attendee.venue && (
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-xs text-gray-700 font-medium">{attendee.venue}</p>
              </div>
            )}
          </div>
        )}

        {/* ID Number & Security Strip */}
        <div className="flex items-center justify-between bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/30">
          <p className="text-white/80 text-[10px] font-mono uppercase tracking-wider">Attendee ID</p>
          <p className="text-white font-mono text-xs font-bold">{attendee.id}</p>
        </div>
      </div>
    </div>
  );
}

