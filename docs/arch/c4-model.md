# C4 Architecture Model

## Level 1: System Context
**The Big Picture**: How the Universal App fits into the world.

```mermaid
C4Context
    title System Context Diagram for Universal App System

    Person(user, "User", "A user accessing the platform via Web, Mobile, or Extension")
    System(universal_app, "Universal App System", "Allows users to interact with the platform features")
    System_Ext(auth_provider, "Auth Provider", "Clerk / Auth0 / Supabase Auth")
    System_Ext(payment_gateway, "Payment Gateway", "Stripe / LemonSqueezy")
    System_Ext(ai_service, "AI Service", "Vercel AI SDK / OpenAI")

    Rel(user, universal_app, "Uses")
    Rel(universal_app, auth_provider, "Authenticates users using")
    Rel(universal_app, payment_gateway, "Processes payments using")
    Rel(universal_app, ai_service, "Generates content using")
```

## Level 2: Container Diagram
**The High-Level Tech**: The deployable units.

```mermaid
C4Container
    title Container Diagram for Universal App System

    Person(user, "User", "A user accessing the platform")

    Container_Boundary(app_boundary, "Universal App Monorepo") {
        Container(web_app, "Web App", "Next.js (App Router)", "The public-facing website and dashboard")
        Container(mobile_app, "Mobile App", "Expo (React Native)", "iOS and Android native application")
        Container(extension, "Browser Extension", "Plasmo (React)", "Chrome/Edge browser companion")
        Container(api, "API Layer", "tRPC / Next.js API Routes", "Handles business logic and data access")
        Container(shared_ui, "Shared UI", "React / NativeWind", "Universal Component Library")
    }

    System_Ext(db, "Database", "PostgreSQL / Replicache", "Stores user data and sync state")

    Rel(user, web_app, "Visits", "HTTPS")
    Rel(user, mobile_app, "Uses", "iOS/Android")
    Rel(user, extension, "Uses", "Chrome Extension")

    Rel(web_app, api, "Calls", "tRPC")
    Rel(mobile_app, api, "Calls", "tRPC")
    Rel(extension, api, "Calls", "tRPC")

    Rel(web_app, shared_ui, "Imports")
    Rel(mobile_app, shared_ui, "Imports")
    Rel(extension, shared_ui, "Imports")

    Rel(api, db, "Reads/Writes", "SQL")
```

## Level 3: Component Diagram (Web App)
**The Internals**: How the Web App is structured.

```mermaid
C4Component
    title Component Diagram for Web App

    Container(web_app, "Web App", "Next.js")

    Component(pages, "Pages", "React Server Components", "Route handlers")
    Component(features, "Features", "React Components", "Domain-specific logic (Auth, Dashboard)")
    Component(hooks, "Hooks", "React Hooks", "Shared state logic")
    Component(ui_atoms, "UI Atoms", "React / Radix UI", "Dumb, reusable components")

    Rel(pages, features, "Composes")
    Rel(features, hooks, "Uses")
    Rel(features, ui_atoms, "Renders")
```
