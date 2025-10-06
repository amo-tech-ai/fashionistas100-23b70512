# 🧪 FashionOS Testing & Validation Guide

**Last Updated:** 2025-10-06  
**Purpose:** Complete testing procedures for production readiness

---

## 🎯 Testing Strategy Overview

### Test Pyramid
```
         /\
        /  \  E2E Tests (10%)
       /____\  
      /      \ Integration Tests (30%)
     /________\
    /          \ Unit Tests (60%)
   /____________\
```

### Testing Levels
1. **Manual Smoke Tests** - Quick verification (15 mins)
2. **Feature Testing** - Detailed user flows (1 hour)
3. **Integration Testing** - API and database (30 mins)
4. **Security Testing** - RLS and auth (30 mins)
5. **Performance Testing** - Load and speed (30 mins)

---

## 🔥 Smoke Tests (15 Minutes)

### Test 1: Homepage Loads
```
✓ Navigate to /
✓ Page loads in < 2 seconds
✓ No console errors
✓ Navigation bar visible
✓ Hero banner visible
✓ "Browse Events" button works
```

### Test 2: Authentication Works
```
✓ Click "Sign In" button
✓ Clerk modal opens
✓ Can sign up with email
✓ Email verification sent
✓ Can complete profile
✓ Redirected to dashboard
```

### Test 3: Event Creation Works
```
✓ Click "Create Event"
✓ Form loads with all fields
✓ Fill required fields
✓ Submit button enabled
✓ Event saves to database
✓ Redirect to event detail page
```

### Test 4: AI Features Work
```
✓ Click "Analyze Event Health"
✓ Loading state shows
✓ Results appear in < 15 seconds
✓ All 4 scores display
✓ Click "Find Models"
✓ Model recommendations appear
```

### Test 5: Public Events Visible
```
✓ Navigate to /events (not logged in)
✓ Published events visible
✓ Event cards clickable
✓ Event details load
✓ No authentication errors
```

---

## 🔬 Feature Testing (Detailed)

### Feature 1: User Authentication

#### Test 1.1: Sign Up Flow
```javascript
// Test Data
const testUser = {
  email: "test@fashionos.com",
  password: "TestPass123!",
  firstName: "Test",
  lastName: "User"
};

// Steps
1. Navigate to homepage
2. Click "Sign Up"
3. Enter email: test@fashionos.com
4. Enter password: TestPass123!
5. Click "Create Account"
6. Check email for verification link
7. Click verification link
8. Complete profile form
9. Submit profile

// Expected Results
✓ Account created in Clerk
✓ Profile created in database
✓ User redirected to /dashboard/organizer/overview
✓ Welcome toast appears
✓ Profile data persisted correctly

// Database Verification
SELECT * FROM profiles WHERE email = 'test@fashionos.com';
-- Should return 1 row with correct data
```

#### Test 1.2: Sign In Flow
```javascript
// Steps
1. Sign out if signed in
2. Click "Sign In"
3. Enter credentials
4. Click "Sign In"

// Expected Results
✓ Authentication successful
✓ JWT token stored
✓ Redirected to dashboard
✓ User data loaded

// Console Check
localStorage.getItem('clerk-session')
// Should return valid session token
```

#### Test 1.3: Sign Out Flow
```javascript
// Steps
1. While signed in, click profile menu
2. Click "Sign Out"

// Expected Results
✓ Session cleared
✓ Redirected to homepage
✓ Protected routes inaccessible
✓ No authentication errors
```

---

### Feature 2: Event Creation & Management

#### Test 2.1: Create Draft Event
```javascript
// Test Data
const testEvent = {
  title: "Test Fashion Show 2025",
  startDateTime: "2025-06-15T19:00:00",
  endDateTime: "2025-06-15T22:00:00",
  venue: "Test Venue, Bogotá",
  capacity: 200,
  ticketPrice: 75,
  currency: "USD",
  description: "Test event for QA purposes",
  tags: ["Test", "Fashion", "Runway"]
};

// Steps
1. Sign in as event organizer
2. Navigate to /dashboard/organizer/overview
3. Click "Create Event" button
4. Fill form with test data
5. Click "Create Event" (do NOT publish)

// Expected Results
✓ Form validates all fields
✓ Event saves with status: "draft"
✓ Event appears in "My Events"
✓ Event has unique ID
✓ Event has unique slug
✓ organizerId matches current user
✓ Redirect to /events/[event-id]

// Database Verification
SELECT * FROM events WHERE title = 'Test Fashion Show 2025';
-- Should return 1 row with status = 'draft'
```

#### Test 2.2: Edit Event
```javascript
// Steps
1. From event detail page
2. Click "Edit Event"
3. Change title to "Updated Test Fashion Show 2025"
4. Change capacity to 250
5. Click "Save Changes"

// Expected Results
✓ Event updates in database
✓ Success toast appears
✓ Changes visible immediately
✓ updated_at timestamp changed

// Database Verification
SELECT title, capacity, updated_at FROM events WHERE id = '[event-id]';
-- Should show updated values
```

#### Test 2.3: Publish Event
```javascript
// Steps
1. From event detail page (draft event)
2. Click "Publish Event" button
3. Confirm publish action

// Expected Results
✓ Event status changes to "published"
✓ Event appears on public /events page
✓ Event searchable by public users
✓ Success toast appears

// Public Verification
1. Open incognito window
2. Navigate to /events
3. Verify event visible in list
```

#### Test 2.4: Delete Event
```javascript
// Steps
1. Create test event
2. Navigate to event detail
3. Click "Delete Event"
4. Confirm deletion

// Expected Results
✓ Event removed from database
✓ Redirect to dashboard
✓ Event no longer in "My Events"
✓ Success toast appears

// Database Verification
SELECT * FROM events WHERE id = '[event-id]';
-- Should return 0 rows
```

---

### Feature 3: AI Event Health Scorer

#### Test 3.1: Run Health Analysis
```javascript
// Prerequisites
1. Create event with all details filled
2. Event has start date 90 days in future

// Steps
1. Navigate to event detail page
2. Click "Analyze Event Health" button
3. Wait for analysis to complete

// Expected Results
✓ Loading spinner appears
✓ Analysis completes in < 15 seconds
✓ Overall score displayed (0-100)
✓ Timeline score displayed
✓ Ticket sales score displayed
✓ Vendor readiness score displayed
✓ Model casting score displayed
✓ Recommendations array has items
✓ Risk factors array has items
✓ AI reasoning text is clear

// Database Verification
SELECT * FROM event_health_scores 
WHERE event_id = '[event-id]' 
ORDER BY created_at DESC 
LIMIT 1;
-- Should return latest score

// Edge Function Logs
Navigate to: Supabase → Edge Functions → event-health-scorer → Logs
Verify: No errors, successful completion
```

#### Test 3.2: Health Score with Different Events
```javascript
// Test Case A: New Event (Just Created)
Expected Timeline Score: Low (40-60)
Expected Ticket Sales Score: Very Low (0-20)
Expected Overall Score: 40-50

// Test Case B: Event 180 Days Away
Expected Timeline Score: High (80-100)
Expected Ticket Sales Score: Low (20-40)
Expected Overall Score: 60-70

// Test Case C: Event 30 Days Away
Expected Timeline Score: Medium (50-70)
Expected Risk Factors: Include "Short timeline"
```

#### Test 3.3: Error Handling
```javascript
// Test: Rate Limit Error
1. Run health scorer 10 times rapidly
2. Should see 429 error toast
3. Error message: "Rate limit exceeded..."
4. Try again after 1 minute - should work

// Test: Network Error
1. Disconnect internet
2. Click "Analyze Event Health"
3. Should see error toast
4. Reconnect internet
5. Retry should work
```

---

### Feature 4: AI Model Casting

#### Test 4.1: Get Model Recommendations
```javascript
// Prerequisites
1. Event created with details
2. Event type: "Runway" or "Fashion Show"

// Steps
1. Navigate to event detail page
2. Scroll to "Model Casting" section
3. Click "Find Models" button
4. Wait for analysis

// Expected Results
✓ Loading state shows
✓ Analysis completes in < 15 seconds
✓ 3-5 model recommendations appear
✓ Each model has:
  - Name (realistic)
  - Agency or "Independent"
  - Match score (70-100)
  - Reasoning (specific to event)
  - Email (valid format)
  - Phone (valid format)
✓ No duplicate models
✓ Recommendations saved to database

// Database Verification
SELECT * FROM model_castings 
WHERE event_id = '[event-id]' 
ORDER BY ai_match_score DESC;
-- Should return 3-5 rows

// Edge Function Logs
Navigate to: Supabase → Edge Functions → model-casting-agent → Logs
Verify: Successful completion, no errors
```

#### Test 4.2: Model Recommendation Quality
```javascript
// Quality Checks
✓ Names sound realistic (not generic like "Model 1")
✓ Agencies are well-known or "Independent"
✓ Match scores vary (not all the same)
✓ Reasoning is specific to event details
✓ Contact info follows valid patterns
✓ Phone numbers have Colombia format (+57)
✓ Emails are professional

// Example Good Recommendation:
{
  "model_name": "Isabella Rodriguez",
  "agency": "Elite Model Management Colombia",
  "ai_match_score": 92,
  "ai_reasoning": "Perfect for runway shows with 5+ years experience...",
  "email": "isabella.r@elitemodel.co",
  "phone": "+57 310 555 1234"
}
```

---

### Feature 5: Public Event Browsing

#### Test 5.1: Browse Events (Not Logged In)
```javascript
// Steps
1. Open incognito window
2. Navigate to /events
3. View list of published events

// Expected Results
✓ Page loads without authentication
✓ Only "published" events visible
✓ "draft" events NOT visible
✓ Event cards show:
  - Title
  - Date (formatted DD/MM/YYYY)
  - Venue/location
  - Capacity
  - Price
✓ Can click event to view details
✓ No authentication required
```

#### Test 5.2: View Event Details (Not Logged In)
```javascript
// Steps
1. From /events page
2. Click on any published event
3. View event detail page

// Expected Results
✓ All public event info visible
✓ Organizer info visible (name only, no PII)
✓ Event description readable
✓ Date/time/venue clear
✓ Price information accurate
✓ "Contact Organizer" button present
✓ No admin/edit buttons visible
```

---

## 🔒 Security Testing

### Test 1: RLS Policy Verification

#### Test 1.1: Users Can Only See Their Own Profiles
```sql
-- As User A (logged in)
SELECT * FROM profiles WHERE id != current_profile_id();
-- Expected: 0 rows (permission denied)

SELECT * FROM profiles WHERE id = current_profile_id();
-- Expected: 1 row (own profile)
```

#### Test 1.2: Users Can Only Edit Their Own Events
```sql
-- Try to update another user's event
UPDATE events 
SET title = 'Hacked!' 
WHERE organizer_id != current_profile_id();
-- Expected: No rows updated, permission error
```

#### Test 1.3: Public Can View Published Events Only
```sql
-- As anonymous user
SELECT * FROM events WHERE status = 'draft';
-- Expected: Can see events (but RLS filters to 0 results)

SELECT * FROM events WHERE status = 'published';
-- Expected: Can see published events
```

#### Test 1.4: Only Organizers See Health Scores
```sql
-- As User B (not event owner)
SELECT * FROM event_health_scores 
WHERE event_id IN (
  SELECT id FROM events WHERE organizer_id != current_profile_id()
);
-- Expected: 0 rows
```

---

### Test 2: Authentication Security

#### Test 2.1: Protected Routes Redirect
```javascript
// Test Cases
1. Navigate to /dashboard/organizer/overview (not logged in)
   Expected: Redirect to /sign-in

2. Navigate to /events/[id]/edit (not logged in)
   Expected: Redirect to /sign-in

3. Try to access /admin (as non-admin)
   Expected: Redirect to / or 403 error
```

#### Test 2.2: JWT Token Validation
```javascript
// Test: Expired Token
1. Manually expire JWT token in localStorage
2. Try to make authenticated request
3. Expected: 401 error, redirect to login

// Test: Invalid Token
1. Manually corrupt JWT token
2. Try to access protected route
3. Expected: Authentication error
```

---

### Test 3: Data Exposure Prevention

#### Test 3.1: PII Not Exposed in API
```javascript
// Check API responses don't expose:
- Full email addresses (except to owner)
- Phone numbers (except to owner)
- User IDs from auth.users
- Payment information
- Admin status

// Test
const response = await fetch('/api/profiles/[other-user-id]');
const data = await response.json();
// Should NOT contain PII of other users
```

---

## ⚡ Performance Testing

### Test 1: Page Load Times

#### Test 1.1: Homepage Performance
```javascript
// Using Chrome DevTools Performance tab
1. Open DevTools
2. Navigate to Performance tab
3. Start recording
4. Navigate to /
5. Stop recording when page fully loaded

// Success Criteria
✓ First Contentful Paint (FCP) < 1.5s
✓ Largest Contentful Paint (LCP) < 2.5s
✓ Time to Interactive (TTI) < 3.0s
✓ Cumulative Layout Shift (CLS) < 0.1
✓ First Input Delay (FID) < 100ms
```

#### Test 1.2: Events List Performance
```javascript
// Test with 50+ events
1. Create 50 test events
2. Navigate to /events
3. Measure load time

// Success Criteria
✓ Page loads in < 3 seconds
✓ Smooth scrolling
✓ No layout shifts
✓ Lazy loading images work
```

---

### Test 2: AI Function Performance

#### Test 2.1: Health Scorer Response Time
```javascript
// Measure AI response time
const start = Date.now();
await analyzeEventHealth(eventId);
const duration = Date.now() - start;

// Success Criteria
✓ Response time < 15 seconds (95th percentile)
✓ Response time < 10 seconds (median)
✓ No timeouts
```

#### Test 2.2: Model Casting Response Time
```javascript
// Measure AI response time
const start = Date.now();
await getModelRecommendations(eventId);
const duration = Date.now() - start;

// Success Criteria
✓ Response time < 15 seconds (95th percentile)
✓ Response time < 12 seconds (median)
✓ Returns 3-5 results consistently
```

---

### Test 3: Database Query Performance

#### Test 3.1: Event List Query
```sql
-- Measure query time
EXPLAIN ANALYZE 
SELECT * FROM events 
WHERE status = 'published' 
ORDER BY start_datetime DESC 
LIMIT 20;

-- Success Criteria
✓ Query time < 50ms
✓ Uses index on status + start_datetime
✓ No sequential scans
```

---

## 📱 Mobile Testing

### Test 1: Responsive Design

#### Test 1.1: Mobile Breakpoints
```javascript
// Test at different screen sizes
- iPhone SE (375px width)
- iPhone 12 (390px width)
- iPhone 14 Pro Max (430px width)
- iPad (768px width)
- iPad Pro (1024px width)

// Check on each:
✓ Navigation collapses to hamburger menu
✓ Form inputs are full width
✓ Buttons are thumb-friendly (min 44px height)
✓ Text is readable (min 16px font size)
✓ No horizontal scroll
✓ Images scale properly
```

---

## 🐛 Error Handling Testing

### Test 1: Network Errors
```javascript
// Test: Offline Mode
1. Create event
2. Turn off network
3. Try to save event
4. Expected: Error toast "Network error, please try again"

// Test: API Timeout
1. Simulate slow network (Chrome DevTools)
2. Try AI health scorer
3. Expected: Loading state, then timeout error after 30s
```

### Test 2: Validation Errors
```javascript
// Test: Empty Required Fields
1. Try to submit event form with empty title
2. Expected: "Title is required" error message

// Test: Invalid Date
1. Enter end date before start date
2. Expected: "End date must be after start date" error
```

---

## ✅ Testing Checklist

### Before Every Deployment
- [ ] All smoke tests pass
- [ ] Authentication works
- [ ] Event creation works
- [ ] AI features work
- [ ] Public pages accessible
- [ ] No console errors
- [ ] No 404 errors
- [ ] RLS policies working
- [ ] Performance targets met
- [ ] Mobile responsive

### Weekly Testing
- [ ] Run full feature test suite
- [ ] Check edge function logs
- [ ] Review error rates
- [ ] Test on real devices
- [ ] Security audit
- [ ] Performance benchmark

---

## 📊 Testing Reports

### Sample Test Results
```
Date: 2025-10-06
Tester: QA Team
Environment: Production

SMOKE TESTS: ✅ 5/5 PASSED
FEATURE TESTS: ✅ 15/15 PASSED
SECURITY TESTS: ✅ 8/8 PASSED
PERFORMANCE TESTS: ✅ 6/6 PASSED

Overall Status: ✅ READY FOR PRODUCTION

Issues Found: 0 critical, 0 high, 2 low
- Low: Event card image slow to load (optimized)
- Low: Toast notification stays 1s too long (adjusted)
```

---

## 🎯 Success Criteria

### MVP Launch Criteria
- ✅ All smoke tests passing
- ✅ Zero critical bugs
- ✅ < 1% error rate
- ✅ Performance targets met
- ✅ Security verified
- ✅ Mobile responsive
- ✅ User journey tested end-to-end

**Status:** READY TO LAUNCH! 🚀
