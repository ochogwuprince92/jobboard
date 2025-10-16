# Frontend Audit & Refactoring Plan

## 🔍 Issues Found

### 1. **Duplicate Auth Systems** ❌
- **Location**: `src/context/AuthContext.tsx` AND `src/hooks/useAuth.ts`
- **Issue**: Two different auth implementations causing confusion
- **Impact**: Inconsistent state management, potential bugs
- **Fix**: Consolidate into single AuthContext with proper TypeScript types

### 2. **Inconsistent API Clients** ❌
- **Files**: `src/api/api.ts`, `src/api/axiosClient.ts`, `src/utils/api.ts`
- **Issue**: Three different axios instances with different configurations
- **Impact**: Token handling inconsistency, duplicate code
- **Fix**: Use single axiosClient with proper interceptors

### 3. **Layout Issues** ❌
- **Location**: `src/app/layout.tsx`
- **Issues**:
  - NotificationPanel rendered outside QueryProvider
  - No navigation/header component
  - Children not wrapped in QueryProvider
  - Missing AuthProvider
- **Fix**: Proper provider hierarchy and add navigation

### 4. **Import Inconsistencies** ❌
- **Example**: `import jwtDecode from "jwt-decode"` vs `import { jwtDecode } from "jwt-decode"`
- **Issue**: Mixed default/named imports (jwt-decode v4 uses named export)
- **Fix**: Standardize to named imports

### 5. **Missing TypeScript Types** ❌
- **Issue**: Many `any` types, missing interfaces
- **Impact**: No type safety, harder to maintain
- **Fix**: Add proper TypeScript interfaces

### 6. **No Error Boundaries** ❌
- **Issue**: No error handling at app level
- **Impact**: Poor UX when errors occur
- **Fix**: Add error boundary component

### 7. **No Loading States** ❌
- **Issue**: No global loading indicator
- **Impact**: Poor UX during navigation
- **Fix**: Add loading component

### 8. **Token Storage Inconsistency** ❌
- **Issue**: Some places use `token`, others use `access_token`
- **Impact**: Auth breaks in different parts of app
- **Fix**: Standardize to `access_token` and `refresh_token`

### 9. **Missing Navigation** ❌
- **Issue**: No header/nav component
- **Impact**: Can't navigate between pages
- **Fix**: Add navigation component

### 10. **API Base URL Issues** ❌
- **Issue**: Hardcoded URLs, inconsistent trailing slashes
- **Fix**: Use environment variable consistently

## 📋 Refactoring Plan

### Phase 1: Core Infrastructure ✅
1. Create unified AuthContext with TypeScript
2. Consolidate to single API client (axiosClient)
3. Add proper TypeScript interfaces
4. Fix jwt-decode imports

### Phase 2: Layout & Navigation ✅
1. Create Navigation component
2. Fix RootLayout provider hierarchy
3. Add Error Boundary
4. Add Loading component

### Phase 3: Pages & Components ✅
1. Update all pages to use new AuthContext
2. Update all API calls to use axiosClient
3. Add loading/error states
4. Fix TypeScript types

### Phase 4: Testing & Verification ✅
1. Test authentication flow
2. Test all API endpoints
3. Test navigation
4. Verify error handling

## 🎯 Target Architecture

```
app/
├── layout.tsx (Root with all providers)
├── providers.tsx (Client-side providers)
└── ...pages

components/
├── layout/
│   ├── Navigation.tsx
│   ├── Header.tsx
│   └── Footer.tsx
├── common/
│   ├── ErrorBoundary.tsx
│   ├── Loading.tsx
│   └── ProtectedRoute.tsx
└── ...

context/
└── AuthContext.tsx (Single source of truth)

api/
└── axiosClient.ts (Single API client)

types/
└── index.ts (All TypeScript interfaces)
```

## 🔧 Implementation Details

### 1. Unified Auth System

```typescript
// context/AuthContext.tsx
interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_employer: boolean;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (access: string, refresh: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}
```

### 2. Single API Client

```typescript
// api/axiosClient.ts
- Remove api.ts and utils/api.ts
- Keep only axiosClient.ts
- Use access_token/refresh_token consistently
- Proper error handling
- Automatic token refresh
```

### 3. Provider Hierarchy

```tsx
<html>
  <body>
    <QueryProvider>
      <AuthProvider>
        <Navigation />
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </AuthProvider>
    </QueryProvider>
  </body>
</html>
```

## 📊 Files to Modify

### Delete:
- ❌ `src/api/api.ts` (duplicate)
- ❌ `src/utils/api.ts` (duplicate)
- ❌ `src/hooks/useAuth.ts` (duplicate)

### Modify:
- ✏️ `src/context/AuthContext.tsx` (enhance)
- ✏️ `src/api/axiosClient.ts` (fix token names)
- ✏️ `src/app/layout.tsx` (fix provider hierarchy)
- ✏️ All page files (update imports)
- ✏️ All component files (update imports)

### Create:
- ✨ `src/components/layout/Navigation.tsx`
- ✨ `src/components/common/ErrorBoundary.tsx`
- ✨ `src/components/common/Loading.tsx`
- ✨ `src/components/common/ProtectedRoute.tsx`
- ✨ `src/types/index.ts`
- ✨ `src/app/providers.tsx`

## 🚀 Benefits After Refactoring

1. **Single Source of Truth**: One auth system, one API client
2. **Type Safety**: Full TypeScript coverage
3. **Better UX**: Loading states, error handling, navigation
4. **Maintainability**: Consistent patterns, clear structure
5. **Scalability**: Easy to add new features
6. **Developer Experience**: Clear imports, no confusion

## ⚠️ Breaking Changes

1. Import paths will change:
   - ❌ `import api from "@/api/api"`
   - ✅ `import axiosClient from "@/api/axiosClient"`

2. Auth hook will change:
   - ❌ `const { token } = useAuth()`
   - ✅ `const { accessToken, user, isAuthenticated } = useAuth()`

3. Token storage keys:
   - ❌ `localStorage.getItem("token")`
   - ✅ `localStorage.getItem("access_token")`

## 📝 Migration Checklist

- [ ] Backup current code
- [ ] Create new unified AuthContext
- [ ] Update axiosClient token handling
- [ ] Create Navigation component
- [ ] Fix RootLayout
- [ ] Update all imports in pages
- [ ] Update all imports in components
- [ ] Add TypeScript types
- [ ] Test authentication
- [ ] Test API calls
- [ ] Test navigation
- [ ] Update documentation

## 🎯 Success Criteria

- ✅ Single auth system
- ✅ Single API client
- ✅ Full TypeScript types
- ✅ Working navigation
- ✅ Error boundaries
- ✅ Loading states
- ✅ All pages working
- ✅ No console errors
- ✅ Proper token refresh
