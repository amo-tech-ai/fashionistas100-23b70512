# Production Deployment Checklist

## Pre-Deployment Requirements

### 🔴 Critical (MUST BE DONE)
- [ ] **Security Audit Complete**
  - [ ] JWT authentication implemented in all Edge Functions
  - [ ] RLS policies complete for all tables
  - [ ] Stage guards added to all action handlers
  - [ ] PII removed from all readable contexts
  - [ ] Error boundaries added to all major components

- [ ] **Testing Complete**
  - [ ] All critical paths tested manually
  - [ ] Authentication flow verified
  - [ ] Stage transitions work correctly
  - [ ] Error handling verified (try to break it)
  - [ ] Data isolation confirmed (user A can't see user B data)

- [ ] **Environment Variables Set**
  - [ ] Production Supabase URL
  - [ ] Production Supabase Anon Key
  - [ ] Clerk Production Keys
  - [ ] Stripe Production Keys
  - [ ] OpenAI API Key
  - [ ] Cloudinary Credentials

### ⚠️ High Priority (Should Be Done)
- [ ] **Observability**
  - [ ] Action logging implemented
  - [ ] Error tracking configured
  - [ ] Performance monitoring set up
  - [ ] User analytics enabled

- [ ] **UX Polish**
  - [ ] Loading states everywhere
  - [ ] Proper error messages
  - [ ] Success confirmations
  - [ ] Progress indicators accurate

### 📝 Nice to Have (Can Do Later)
- [ ] Advanced error recovery
- [ ] Offline support
- [ ] Advanced analytics
- [ ] A/B testing setup

---

## Day 1: Security Fixes ✅

### Morning (4 hours)
- [ ] **9:00 - 11:00** Implement JWT authentication
  - [ ] Update Edge Function handler
  - [ ] Add JWT extraction and verification
  - [ ] Test with valid/invalid tokens
  - [ ] Update frontend to send tokens

- [ ] **11:00 - 13:00** Complete RLS policies
  - [ ] Create migration file
  - [ ] Add wizard_actions policies
  - [ ] Add wizard_interactions policies
  - [ ] Test data isolation

### Afternoon (4 hours)
- [ ] **14:00 - 16:00** Stage guards and logging
  - [ ] Add stage guards to all action handlers
  - [ ] Add action logging
  - [ ] Test cross-stage prevention
  - [ ] Verify logs appear

- [ ] **16:00 - 17:00** Remove PII from readables
  - [ ] Audit all useCopilotReadable calls
  - [ ] Replace PII with presence flags
  - [ ] Test AI still gets useful context

- [ ] **17:00 - 18:00** Error boundaries
  - [ ] Install react-error-boundary
  - [ ] Create ErrorBoundary component
  - [ ] Wrap main components
  - [ ] Test error catching

---

## Day 2: Polish & Observability

### Morning (4 hours)
- [ ] **9:00 - 11:00** Server-side progress sync
  - [ ] Update global state to fetch from DB
  - [ ] Remove client-side calculation
  - [ ] Test progress accuracy

- [ ] **11:00 - 13:00** Enhanced stage instructions
  - [ ] Update all useCopilotAdditionalInstructions
  - [ ] Make instructions actionable
  - [ ] List available actions per stage
  - [ ] Test AI follows instructions

### Afternoon (4 hours)
- [ ] **14:00 - 15:00** Loading states
  - [ ] Add loading UI to all async operations
  - [ ] Add skeleton loaders
  - [ ] Test user experience

- [ ] **15:00 - 16:00** Rate limiting
  - [ ] Install @upstash/ratelimit
  - [ ] Add to Edge Functions
  - [ ] Test rate limits work

- [ ] **16:00 - 18:00** Final polish
  - [ ] Fix any remaining bugs
  - [ ] Improve error messages
  - [ ] Add success animations

---

## Day 3: Testing & Deployment

### Morning (4 hours)
- [ ] **9:00 - 13:00** Comprehensive testing
  - [ ] Test all 6 stages end-to-end
  - [ ] Test authentication edge cases
  - [ ] Test error scenarios
  - [ ] Test on mobile devices
  - [ ] Test different browsers

### Afternoon (4 hours)
- [ ] **14:00 - 15:00** Security audit
  - [ ] Verify JWT required everywhere
  - [ ] Verify RLS blocks unauthorized access
  - [ ] Verify no PII exposed
  - [ ] Check for OWASP top 10 issues

- [ ] **15:00 - 16:00** Performance testing
  - [ ] Test page load times
  - [ ] Test action response times
  - [ ] Test with slow network
  - [ ] Optimize if needed

- [ ] **16:00 - 17:00** Staging deployment
  - [ ] Deploy to Vercel staging
  - [ ] Run smoke tests
  - [ ] Check logs for errors
  - [ ] Verify environment variables

- [ ] **17:00 - 18:00** Production deployment
  - [ ] Final review with team
  - [ ] Deploy to production
  - [ ] Monitor logs closely
  - [ ] Be ready to rollback

---

## Post-Deployment Monitoring (First 24 Hours)

### Hour 1-2: Active Monitoring
- [ ] Check error logs every 15 minutes
- [ ] Monitor user activity
- [ ] Watch for authentication failures
- [ ] Check database load

### Hour 3-8: Regular Monitoring  
- [ ] Check logs every hour
- [ ] Monitor conversion rates
- [ ] Watch for error spikes
- [ ] Check performance metrics

### Hour 9-24: Passive Monitoring
- [ ] Set up alerts for critical errors
- [ ] Review daily analytics
- [ ] Check user feedback
- [ ] Plan improvements

---

## Rollback Plan

If critical issues found:

### Immediate (< 5 minutes)
```bash
# Revert to last known good deployment
vercel rollback
```

### Database Issues (< 15 minutes)
```bash
# Rollback database migrations
supabase db reset --db-url <production-url>
supabase migration rollback <migration-name>
```

### Complete Rollback (< 30 minutes)
1. Revert code deployment
2. Rollback database
3. Clear CDN cache
4. Notify users via status page

---

## Success Criteria

### Technical Metrics
- [ ] 99.9% uptime
- [ ] < 200ms API response time
- [ ] < 2s page load time
- [ ] 0 critical errors in 24h
- [ ] All security tests pass

### Business Metrics
- [ ] Users complete wizard
- [ ] Events published successfully
- [ ] Payment processing works
- [ ] No support tickets about bugs

### User Experience
- [ ] Clear error messages
- [ ] Smooth stage transitions
- [ ] Mobile responsive
- [ ] Accessible (WCAG AA)

---

## Emergency Contacts

```
Lead Developer: [Name] - [Phone]
DevOps: [Name] - [Phone]
Product Manager: [Name] - [Phone]
CEO: [Name] - [Phone]

Supabase Support: support@supabase.com
Vercel Support: support@vercel.com
Clerk Support: support@clerk.com
```

---

## Post-Launch Tasks (Week 1)

- [ ] Set up automated monitoring
- [ ] Configure alerting thresholds
- [ ] Document known issues
- [ ] Plan next iteration
- [ ] Gather user feedback
- [ ] Analyze performance data
- [ ] Optimize bottlenecks
- [ ] Write post-mortem if issues occurred

---

## Approval Sign-Off

Before deploying to production:

- [ ] **Tech Lead**: Reviewed code and architecture
- [ ] **Security**: Approved security measures
- [ ] **QA**: All tests passed
- [ ] **Product**: UX approved
- [ ] **CEO**: Business sign-off

---

**Deployment Date**: ___________  
**Deployed By**: ___________  
**Approved By**: ___________