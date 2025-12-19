/**
 * API Barrel Export
 * 
 * This file re-exports the auto-generated API code for convenient imports.
 * DO NOT add manual logic here - this is just for clean imports.
 * 
 * After backend changes:
 * 1. Run: npm run generate:api
 * 2. This file automatically gets the new types/functions
 */

// ==========================================
// API Functions
// ==========================================

// Import and re-export the generated API function
import { getAttendees } from './generated/attendees/attendees';

// Create a singleton instance for convenience
const api = getAttendees();

// Export as attendeeApi for backward compatibility
export const attendeeApi = {
  verify: api.attendeesControllerVerify,
  getQRCode: api.attendeesControllerGenerateQRCode,
  // New methods for the two download options
  getQRCodeByConfirmationNumber: async (confirmationNumber: string) => {
    const response = await api.attendeesControllerGenerateQRCodeByConfirmationNumber({
      confirmationNumber,
    });
    return response.data;
  },
  getQRCodeByNameAndMobile: async (fullName: string, mobile: string) => {
    const response = await api.attendeesControllerGenerateQRCodeByNameAndMobile({
      fullName,
      mobile,
    });
    return response.data;
  },
};

// Also export the factory function if needed
export { getAttendees };

// ==========================================
// Types - Original Names
// ==========================================

export type {
  AttendeeBasicDto,
  VerifyAttendeeDto,
  VerifyAttendeeResponseDto,
  GenerateQRCodeResponseDto,
  ErrorResponseDto,
} from './generated/models';

// ==========================================
// Types - Friendly Aliases (from backend)
// ==========================================

export type {
  AttendeeInfo,
  AttendeeVerifyRequest,
  AttendeeVerifyResponse,
  QRCodeResponse,
  ErrorResponse,
} from './generated/models';

// ==========================================
// Type Aliases for Convenience
// ==========================================

import type {
  AttendeeBasicDto,
  VerifyAttendeeDto,
  VerifyAttendeeResponseDto,
  GenerateQRCodeResponseDto,
} from './generated/models';

// Export convenient aliases
export type Attendee = AttendeeBasicDto;
export type VerifyRequest = VerifyAttendeeDto;
export type VerifyResponse = VerifyAttendeeResponseDto;
export type QRCodeData = GenerateQRCodeResponseDto;

// ==========================================
// Axios Instance
// ==========================================

export { AXIOS_INSTANCE } from './api-mutator';

