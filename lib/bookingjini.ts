import { Booking } from '@/lib/models/booking';

const DEFAULT_BASE_URL = 'https://be-alpha.bookingjini.com';

interface BookingjiniConfig {
  apiKey: string;
  hotelId: number;
  baseUrl: string;
  paymentMode: string;
}

interface BookingjiniRatePlan {
  rate_plan_id: number;
  plan_name: string;
  is_bookable?: boolean;
  rates?: Array<{ promotions_type: string | null; promotion_id: number | null; promotion_name: string | null; discount_percentage: number }>;
}

interface BookingjiniRoomInventory {
  room_type: string;
  room_type_id: number;
  rate_plans?: BookingjiniRatePlan[];
}

export interface BookingjiniSyncResult {
  success: boolean;
  invoiceId?: number;
  error?: string;
}

function getConfig(): BookingjiniConfig | null {
  const apiKey = process.env.BOOKINGJINI_API_KEY;
  const hotelId = process.env.BOOKINGJINI_HOTEL_ID;

  if (!apiKey || !hotelId) {
    return null;
  }

  return {
    apiKey,
    hotelId: Number.parseInt(hotelId, 10),
    baseUrl: process.env.BOOKINGJINI_BASE_URL || DEFAULT_BASE_URL,
    paymentMode: process.env.BOOKINGJINI_PAYMENT_MODE || '3',
  };
}

function formatBookingjiniDate(value?: Date | string): string {
  const date = value ? new Date(value) : new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

function normalizeRoomName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function scoreRoomNameMatch(localName: string, remoteName: string): number {
  const local = normalizeRoomName(localName);
  const remote = normalizeRoomName(remoteName);

  if (!local || !remote) return 0;
  if (local === remote) return 100;
  if (local.includes(remote) || remote.includes(local)) return 80;

  const localTokens = localName.toLowerCase().split(/\s+/);
  const remoteTokens = remoteName.toLowerCase().split(/\s+/);
  const overlap = localTokens.filter((token) =>
    remoteTokens.some((remoteToken) => remoteToken.includes(token) || token.includes(remoteToken))
  ).length;

  return overlap * 10;
}

function pickRatePlan(ratePlans: BookingjiniRatePlan[] = []): BookingjiniRatePlan | undefined {
  if (ratePlans.length === 0) return undefined;

  const roomOnlyPlan = ratePlans.find((plan) =>
    plan.plan_name.toLowerCase().includes('only room')
  );
  return roomOnlyPlan || ratePlans[0];
}

async function fetchInventory(
  config: BookingjiniConfig,
  checkIn: string,
  checkOut: string,
  adults: number
): Promise<BookingjiniRoomInventory[]> {
  const response = await fetch(`${config.baseUrl}/get-inventory-rate-new`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      date_from: checkIn,
      date_to: checkOut,
      hotel_id: config.hotelId,
      api_key: config.apiKey,
      currency: 'INR',
      adult: adults,
      child: 0,
      infant: 0,
      rooms: 1,
      device_type: 'desktop',
      member_only: 0,
    }),
  });

  if (!response.ok) {
    throw new Error(`Inventory request failed with status ${response.status}`);
  }

  const payload = await response.json();
  if (payload.status !== 1 || !Array.isArray(payload.data)) {
    throw new Error(payload.message || 'Unable to fetch Bookingjini inventory');
  }

  return payload.data;
}

function resolveRoomSelection(
  inventory: BookingjiniRoomInventory[],
  roomName: string,
  bookingjiniRoomTypeId?: number
): { roomTypeId: number; ratePlanId: number; promotionsType: string | null; promotionId: number | null; promotionName: string | null; discountPercentage: number } {
  let selectedRoom: BookingjiniRoomInventory | undefined;

  if (bookingjiniRoomTypeId) {
    selectedRoom = inventory.find((room) => room.room_type_id === bookingjiniRoomTypeId);
  }

  if (!selectedRoom) {
    selectedRoom = [...inventory]
      .map((room) => ({ room, score: scoreRoomNameMatch(roomName, room.room_type) }))
      .sort((a, b) => b.score - a.score)[0]?.room;
  }

  if (!selectedRoom) {
    throw new Error(`No matching Bookingjini room found for "${roomName}"`);
  }

  const ratePlan = pickRatePlan(selectedRoom.rate_plans);
  if (!ratePlan) {
    throw new Error(`No rate plan available for Bookingjini room "${selectedRoom.room_type}"`);
  }

  const rate = ratePlan.rates?.[0];

  return {
    roomTypeId: selectedRoom.room_type_id,
    ratePlanId: ratePlan.rate_plan_id,
    promotionsType: rate?.promotions_type ?? null,
    promotionId: rate?.promotion_id ?? null,
    promotionName: rate?.promotion_name ?? null,
    discountPercentage: rate?.discount_percentage ?? 0,
  };
}

async function createBookingjiniReservation(
  config: BookingjiniConfig,
  booking: Booking,
  roomSelection: ReturnType<typeof resolveRoomSelection>
): Promise<number> {
  const checkIn = formatBookingjiniDate(booking.checkIn);
  const checkOut = formatBookingjiniDate(booking.checkOut);
  const adults = Number.parseInt(booking.guests || '2', 10) || 2;
  const amountToPay = config.paymentMode === '3' ? 0 : booking.totalAmount || 0;

  const payload = {
    user_details: {
      first_name: booking.firstName,
      last_name: booking.lastName,
      email_id: booking.email || '',
      mobile: booking.mobileNumber,
      address: '',
      zip_code: '',
      country: 'India',
      state: 'Maharashtra',
      city: 'Thane',
      identity: { identity_type: '', identity_no: '', expiry_date: '' },
      date_of_birth: '',
      company_name: '',
      GST_IN: '',
      guest_note: `Booking from Myriad website${booking.selectedAddons?.length ? ` | Add-ons: ${booking.selectedAddons.map((addon) => addon.name).join(', ')}` : ''}`,
      arrival_time: '',
      member_only: 0,
      device_type: 'desktop',
    },
    booking_details: {
      hotel_id: config.hotelId,
      checkin_date: checkIn,
      checkout_date: checkOut,
      booking_reference: '',
      source: 'Website',
      opted_book_assure: 0,
      payment_mode: config.paymentMode,
      private_coupon: '',
      amount_to_pay: amountToPay,
      currency: 'INR',
    },
    room_details: [
      {
        room_type_id: roomSelection.roomTypeId,
        rate_plan_id: roomSelection.ratePlanId,
        no_of_rooms: 1,
        promotions_type: roomSelection.promotionsType,
        promotion_id: roomSelection.promotionId,
        promotion_name: roomSelection.promotionName,
        discount_percentage: roomSelection.discountPercentage,
        occupancy: [{ room_no: 1, adult: adults, child: 0, infant: 0 }],
      },
    ],
    paid_service: [],
  };

  const response = await fetch(`${config.baseUrl}/bookings-new/${config.apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Booking request failed with status ${response.status}`);
  }

  const result = await response.json();
  if (result.status !== 1 || !result.invoice_id) {
    throw new Error(result.message || 'Bookingjini rejected the booking');
  }

  if (config.paymentMode === '3') {
    const confirmResponse = await fetch(
      `${config.baseUrl}/pay-at-hotel-success/${result.invoice_id}/pay_at_hotel`
    );

    if (!confirmResponse.ok) {
      throw new Error(`Booking confirmation failed with status ${confirmResponse.status}`);
    }

    const confirmResult = await confirmResponse.json();
    if (confirmResult.status !== 1) {
      throw new Error(confirmResult.message || confirmResult.mesage || 'Bookingjini confirmation failed');
    }
  }

  return result.invoice_id;
}

export async function syncBookingToBookingjini(
  booking: Booking,
  options?: { bookingjiniRoomTypeId?: number }
): Promise<BookingjiniSyncResult> {
  const config = getConfig();
  if (!config) {
    return {
      success: false,
      error: 'Bookingjini is not configured. Set BOOKINGJINI_API_KEY and BOOKINGJINI_HOTEL_ID.',
    };
  }

  if (!booking.checkIn || !booking.checkOut) {
    return { success: false, error: 'Booking is missing check-in or check-out dates.' };
  }

  try {
    const checkIn = formatBookingjiniDate(booking.checkIn);
    const checkOut = formatBookingjiniDate(booking.checkOut);
    const adults = Number.parseInt(booking.guests || '2', 10) || 2;
    const inventory = await fetchInventory(config, checkIn, checkOut, adults);
    const roomSelection = resolveRoomSelection(
      inventory,
      booking.roomName,
      options?.bookingjiniRoomTypeId
    );
    const invoiceId = await createBookingjiniReservation(config, booking, roomSelection);

    return { success: true, invoiceId };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown Bookingjini sync error';
    console.error('Bookingjini sync failed:', message);
    return { success: false, error: message };
  }
}
