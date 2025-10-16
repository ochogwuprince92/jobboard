# Remaining Frontend Work

## ✅ Completed
- [x] Fixed `src/api/notifications.ts` (was component, now API client)
- [x] Removed duplicate `src/api/notifications-api.ts`
- [x] Removed `src/lib/` directory (old duplicate files)
- [x] Fixed `src/app/jobs/page.tsx` 
- [x] Fixed `src/app/jobs/[id]/page.tsx`
- [x] Updated `NotificationPanel` component

## ⚠️ Remaining Pages to Update

These pages still use old imports and need to be updated:

### 1. `src/app/notifications/page.tsx`
**Issues:**
- Uses `@/lib/config` (doesn't exist)
- Uses `@/hooks/useAuth` (deleted)

**Fix:**
```typescript
// Replace
import { API_BASE_URL } from "@/lib/config";
import { useAuth } from "@/hooks/useAuth";

// With
import { useAuth } from "@/context/AuthContext";
import { getNotifications } from "@/api/notifications";
```

### 2. `src/app/dashboard/page.tsx`
**Issues:**
- Uses `@/lib/api` (doesn't exist)

**Fix:**
```typescript
// Replace
import api from "@/lib/api";

// With
import axiosClient from "@/api/axiosClient";
// Or use specific API functions from @/api/*
```

### 3. `src/app/jobs/create/page.tsx`
**Issues:**
- Uses `@/lib/config` (doesn't exist)
- Uses `@/hooks/useAuth` (deleted)
- Uses axios directly

**Fix:**
```typescript
// Replace
import { API_BASE_URL } from "@/lib/config";
import { useAuth } from "@/hooks/useAuth";

// With
import { useAuth } from "@/context/AuthContext";
import { createJob } from "@/api/jobs";
```

### 4. Other Dashboard Pages
Check these files:
- `src/app/dashboard/employer/page.tsx`
- `src/app/dashboard/seeker/page.tsx`
- `src/app/profile/page.tsx`
- `src/app/resumes/page.tsx`

## 🔧 Quick Fix Pattern

For any page with old imports, follow this pattern:

### Old Pattern:
```typescript
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { API_BASE_URL } from "@/lib/config";

const { token } = useAuth();
const res = await api.get("/endpoint/");
```

### New Pattern:
```typescript
import { useAuth } from "@/context/AuthContext";
import { getEndpoint } from "@/api/endpoint";

const { accessToken, user, isAuthenticated } = useAuth();
const data = await getEndpoint();
```

## 📝 Steps to Fix Each Page

1. **Update imports**:
   - Change `@/hooks/useAuth` → `@/context/AuthContext`
   - Change `@/lib/api` → `@/api/axiosClient` or specific API function
   - Remove `@/lib/config` imports

2. **Update useAuth usage**:
   - Change `const { token } = useAuth()` → `const { accessToken, user } = useAuth()`
   - Update all `token` references to `accessToken`

3. **Update API calls**:
   - Replace direct axios/api calls with typed API functions
   - Use functions from `@/api/*` files

4. **Add TypeScript types**:
   - Import types from `@/types`
   - Remove inline interface definitions

## 🎯 Priority Order

1. **High**: Dashboard pages (users see these first)
2. **Medium**: Create/Edit pages
3. **Low**: Profile, Settings pages

## ✨ After Fixing

Once all pages are updated:
1. Run `npm run build` to verify no errors
2. Test each page manually
3. Verify authentication works
4. Check API calls work correctly

## 📊 Progress

- Core infrastructure: ✅ 100%
- Auth pages (login/register): ✅ 100%
- Job listing pages: ✅ 100%
- Dashboard pages: ⚠️ 0%
- Other pages: ⚠️ Unknown

**Estimated time to complete**: 30-60 minutes

## 💡 Tips

- Use Find & Replace in your IDE for bulk updates
- Test each page after updating
- Check browser console for errors
- Verify network requests in DevTools

---

**Status**: Core refactoring complete, page-level updates remaining
