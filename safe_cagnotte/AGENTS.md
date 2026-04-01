# AGENTS.md

## Project Overview

- **Framework**: Next.js 16.2.1 with App Router
- **Language**: TypeScript (strict mode enabled)
- **UI**: React 19 + Tailwind CSS v4
- **Auth**: NextAuth v5 (beta) with credentials provider
- **Database**: PostgreSQL with Prisma ORM 7.6.0
- **Package Manager**: npm

## Build / Lint / Test Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint

# Generate Prisma client (required after schema changes)
npx prisma generate
```

**Database Commands**:
```bash
# Push schema to database
npx prisma db push

# Create migration
npx prisma migrate dev --name migration_name
```

**Note**: No test framework is currently configured.

## Code Style Guidelines

### TypeScript

- **Strict mode enabled** - All TypeScript rules enforced
- Use explicit types for function parameters and return types when not inferable
- Path aliases: `@/*` maps to `./` (configured in tsconfig.json)

### Imports

Order imports as follows:
1. React/Next.js imports (`import { useState } from "react"`)
2. Next.js navigation (`import { useRouter } from "next/navigation"`)
3. Third-party libraries
4. Internal lib imports (`import { prisma } from "@/lib/prisma"`)
5. Local component imports

### Formatting

- Use double quotes for strings
- Use Tailwind CSS v4 utility classes for styling
- Use `"use client"` directive for client components

### Naming Conventions

- **Components**: PascalCase (e.g., `LoginForm.tsx`)
- **Files**: kebab-case for utilities, PascalCase for components
- **Database models**: PascalCase in schema, snake_case in database

### Error Handling

- Return `null` for auth failures (as seen in `auth.ts`)
- Use French error messages in UI ("Email ou mot de passe invalide")
- Use try/catch for async database operations

### Database Patterns

- Prisma client is a singleton (see `lib/prisma.ts`)
- Use the adapter pattern with `@prisma/adapter-pg` for PostgreSQL
- Always use environment variable `DATABASE_URL` for connection

### Auth Patterns (NextAuth v5)

```typescript
import { handlers, signIn, signOut, auth } from "@/auth"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [...],
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, user }) { ... },
    session({ session, token }) { ... },
  },
})
```

## Project Structure

```
safe_cagnotte/
├── app/                    # Next.js App Router
│   ├── api/auth/           # NextAuth API routes
│   ├── login/              # Login page
│   ├── register/           # Registration page
│   ├── welcome/            # Protected welcome page
│   └── generated/prisma/   # Prisma generated client
├── components/              # React components
├── lib/                     # Utility libraries (prisma.ts)
├── prisma/                  # Database schema and migrations
│   ├── schema.prisma
│   └── config.ts
└── auth.ts                  # NextAuth configuration
```

## Environment Variables

Required in `.env`:
- `DATABASE_URL` - PostgreSQL connection string
- `AUTH_SECRET` - NextAuth secret (generate with `openssl rand -base64 32`)
- `NEXTAUTH_URL` - URL for production (optional for dev)

## Database Schema Notes

Key models:
- **User** - with password hashing (bcrypt)
- **Organisation** - groups/organizations
- **Membre** - membership with roles (SUPER_ADMIN, TRESORIER, VALIDATEUR, OBSERVATEUR)
- **Caisse** - funds/piggy banks
- **Entree** - money contributions
- **Depense** - expenses with voting/validation workflow
- **Validation** - expense approval votes
- **Chat/Message** - messaging system
- **Notification** - user notifications
- **AuditLog** - activity logging

## Common Issues

1. **Prisma client not found**: Run `npx prisma generate` after schema changes
2. **Turbopack panic**: Ensure Prisma client is generated before starting dev server
3. **Auth errors**: Check `AUTH_SECRET` is set in environment
