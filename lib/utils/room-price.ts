import { Room } from '@/lib/models/room';

export function getRoomDisplayPrice(room: Room) {
  const hasTodayPrice =
    room.todayPriceEnabled &&
    room.todayPrice != null &&
    room.todayPrice > 0;

  const effectivePrice = hasTodayPrice
    ? room.todayPrice!
    : room.priceSummary?.basePrice ?? room.price ?? 0;

  const originalPrice = hasTodayPrice
    ? room.oldPrice ?? room.priceSummary?.basePrice ?? room.price ?? 0
    : null;

  return {
    effectivePrice,
    originalPrice:
      hasTodayPrice && originalPrice != null && originalPrice > effectivePrice
        ? originalPrice
        : null,
    showTodayPriceTag: hasTodayPrice,
  };
}
