import type { Activity, RadiusOption } from '../types/nearby';

export const radiusOptions: RadiusOption[] = [500, 2000, 5000, 10000];

export const activities: Activity[] = [
  { id: 'coffee', emoji: '☕', label: 'Coffee' },
  { id: 'beer', emoji: '🍺', label: 'Beer' },
  { id: 'wine', emoji: '🍷', label: 'Wine' },
  { id: 'dinner', emoji: '🍕', label: 'Dinner' },
  { id: 'museum', emoji: '🏛', label: 'Museum' },
  { id: 'beach', emoji: '🏖', label: 'Beach' },
  { id: 'hiking', emoji: '🥾', label: 'Hiking' },
  { id: 'travel-partner', emoji: '✈️', label: 'Travel Partner' },
  { id: 'nightlife', emoji: '🎉', label: 'Nightlife' }
];

export function formatRadius(radius: RadiusOption) {
  return radius < 1000 ? `${radius}m` : `${radius / 1000}km`;
}
