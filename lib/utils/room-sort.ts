import { Room } from '@/lib/models/room';

// Default room order sequence
const DEFAULT_ROOM_ORDER: { [key: string]: number } = {
  'Deluxe Room': 1,
  'Deluxe Twin': 2,
  'Super Deluxe': 3,
  'Executive Room': 4,
  'Executive Suite': 5,
  'Presidential Suite': 6,
};

/**
 * Get the display order for a room
 * Priority: 1. order field, 2. default sequence match, 3. 9999 (last)
 */
function getRoomOrder(room: Room): number {
  // First priority: use the order field if it exists
  if (room.order !== undefined && room.order !== null) {
    return room.order;
  }

  // Second priority: match room name to default sequence
  const roomName = (room.name || room.title || '').trim();
  
  // Try exact match first
  if (DEFAULT_ROOM_ORDER[roomName]) {
    return DEFAULT_ROOM_ORDER[roomName];
  }

  // Try case-insensitive match
  const roomNameLower = roomName.toLowerCase();
  for (const [key, value] of Object.entries(DEFAULT_ROOM_ORDER)) {
    if (key.toLowerCase() === roomNameLower) {
      return value;
    }
  }

  // Try partial match (e.g., "Deluxe Room" matches "Deluxe Room - Standard")
  for (const [key, value] of Object.entries(DEFAULT_ROOM_ORDER)) {
    if (roomNameLower.includes(key.toLowerCase()) || key.toLowerCase().includes(roomNameLower)) {
      return value;
    }
  }

  // Default: put at the end
  return 9999;
}

/**
 * Sort rooms by display order
 * Rooms are sorted by: 1. order field, 2. default sequence, 3. alphabetically by name
 */
export function sortRooms(rooms: Room[]): Room[] {
  return [...rooms].sort((a, b) => {
    const orderA = getRoomOrder(a);
    const orderB = getRoomOrder(b);

    // Primary sort by order
    if (orderA !== orderB) {
      return orderA - orderB;
    }

    // Secondary sort by name if order is the same
    const nameA = (a.name || a.title || '').trim();
    const nameB = (b.name || b.title || '').trim();
    return nameA.localeCompare(nameB);
  });
}
