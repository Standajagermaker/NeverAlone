export type ActivityId = 'coffee'|'beer'|'wine'|'dinner'|'museum'|'beach'|'hiking'|'travel_partner'|'nightlife';
export const activities: { id: ActivityId; label: string; emoji: string }[] = [
 {id:'coffee',label:'Coffee',emoji:'☕'},{id:'beer',label:'Beer',emoji:'🍺'},{id:'wine',label:'Wine',emoji:'🍷'},{id:'dinner',label:'Dinner',emoji:'🍕'},{id:'museum',label:'Museum',emoji:'🏛'},{id:'beach',label:'Beach',emoji:'🏖'},{id:'hiking',label:'Hiking',emoji:'🥾'},{id:'travel_partner',label:'Travel Partner',emoji:'✈️'},{id:'nightlife',label:'Nightlife',emoji:'🎉'}
];
export type TravelProfile = { name: string; age?: number; bio: string; country: string; languages: string[]; activities: ActivityId[]; verified: boolean; rating: number };
