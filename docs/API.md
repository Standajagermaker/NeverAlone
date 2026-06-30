# NeverAlone API Design

Backend: Supabase, PostgreSQL, Realtime and Edge Functions.

## Authentication

Handled mainly by Supabase Auth.

Flows:

- Email sign up
- Email login
- Google login
- Apple login
- Logout
- Password reset

## Profile API

### Get current profile

Returns the authenticated user's profile.

### Update current profile

Updates editable profile fields:

- display name
- bio
- avatar
- languages
- interests
- country

## Nearby API

### Get nearby users

Input:

- current location
- radius
- activity filters
- language filters

Output:

- public profile fields
- approximate distance
- active availability
- shared interests

Rules:

- Do not return blocked users.
- Do not return users who blocked the current user.
- Do not expose exact coordinates.

## Availability API

### Set availability

Example:

```json
{
  "activity_key": "dinner",
  "note": "Looking for dinner in Barcelona",
  "radius_meters": 2000,
  "expires_at": "2026-06-30T21:00:00Z"
}
```

### Clear availability

Removes active availability.

## Chat API

### Create or open conversation

Creates a conversation between allowed users.

Rules:

- No blocked users.
- Rate limits apply.
- Future version may require accepted invite or mutual interest.

### Send message

- Text
- Optional image

### Subscribe to messages

Implemented through Supabase Realtime.

## AI API

Implemented as Supabase Edge Functions.

### ai-chat

Purpose:

- Friendly conversation while waiting
- Travel help
- Activity suggestions

### ai-translate

Purpose:

- Translate user messages between supported languages

### ai-suggestions

Purpose:

- Suggest better activity status
- Suggest radius changes
- Suggest nearby plans

### ai-trip-plan

Purpose:

- Create short local plans for solo travelers

## Safety API

### Block user

Creates a block relation and hides both users from each other.

### Report user

Creates a report for moderation review.

## Admin API - future

- Review reports
- Suspend users
- Verify profiles
- Moderate images
