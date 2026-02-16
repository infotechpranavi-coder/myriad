export interface Proposal {
  _id?: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  alternateContactNumber?: string;
  eventType: string;
  eventTypeOther?: string;
  eventDate?: string;
  eventTiming?: string;
  foodPreference: string;
  foodPreferenceOther?: string;
  alcoholRequired: 'Yes' | 'No';
  expectedGuests?: string;
  roomsRequired: 'Yes' | 'No';
  numberOfRooms?: string;
  additionalRequirements?: string;
  status?: 'pending' | 'contacted' | 'quoted' | 'confirmed' | 'declined';
  createdAt?: Date;
  updatedAt?: Date;
}
