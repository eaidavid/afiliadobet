# AfiliadosBet System

## Overview

AfiliadosBet is a comprehensive affiliate management system designed for sports betting platforms. The application provides a complete solution for managing affiliates, tracking their performance, handling commissions, and facilitating payments. It features separate interfaces for administrators and affiliates, with real-time analytics and tracking capabilities.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS with custom glassmorphism design system
- **UI Components**: Shadcn/UI component library with Radix UI primitives
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state and caching
- **Icons**: Lucide React for consistent iconography

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for HTTP server and API routes
- **Authentication**: Passport.js with local strategy and bcrypt for password hashing
- **Session Management**: Express-session with MemoryStore for development
- **Database Layer**: Drizzle ORM with PostgreSQL (production) / SQLite (development)
- **Database Provider**: Neon serverless PostgreSQL

### Authentication System
- **Strategy**: Session-based authentication using Passport.js
- **Password Security**: bcrypt for password hashing and validation
- **Role-based Access**: Admin and affiliate roles with route protection
- **Session Storage**: In-memory store for development, configurable for production

## Key Components

### Database Schema
The system uses a relational database structure with the following main entities:

1. **Users Table**: Stores both admin and affiliate accounts with role-based differentiation
2. **Affiliate Profiles**: Extended profile information specific to affiliates including commission data
3. **Betting Houses**: Managed betting platforms with commission structures
4. **Affiliate Links**: Tracking links with custom codes and analytics
5. **Tracking Tables**: Clicks, registrations, deposits, and affiliate events for comprehensive analytics
6. **Payments**: Commission payment records and status tracking

### User Interface Structure
- **Admin Interface**: Complete management dashboard for overseeing affiliates, betting houses, payments, and system settings
- **Affiliate Interface**: Self-service portal for link management, performance tracking, and payment history
- **Responsive Design**: Mobile-first approach with glassmorphism aesthetic
- **Dark Theme**: Consistent dark mode design with custom CSS variables

### API Structure
- **RESTful Design**: Standard HTTP methods for CRUD operations
- **Authentication Endpoints**: Login, logout, and user session management
- **Admin Endpoints**: User management, betting house configuration, payment processing
- **Affiliate Endpoints**: Link generation, analytics access, profile management
- **Analytics Endpoints**: Performance metrics and reporting data

## Data Flow

### Authentication Flow
1. User submits credentials through login form
2. Passport.js validates against database using bcrypt
3. Session created and stored in memory store
4. User redirected to appropriate dashboard based on role
5. Subsequent requests authenticated via session middleware

### Affiliate Tracking Flow
1. Affiliate generates tracking link through dashboard
2. User clicks affiliate link with unique tracking code
3. Click event recorded with user agent and referrer data
4. User registration and deposit events tracked via webhooks or API calls
5. Commission calculations based on betting house rules
6. Analytics aggregated for real-time dashboard updates

### Payment Processing Flow
1. Commission earnings accumulated in affiliate accounts
2. Payment requests initiated by affiliates or scheduled automatically
3. Admin approval workflow for payment verification
4. Payment records created with status tracking
5. Integration points for payment processors (PIX, bank transfers)

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe database ORM
- **passport**: Authentication middleware
- **bcrypt**: Password hashing
- **express-session**: Session management
- **@tanstack/react-query**: Data fetching and caching
- **@radix-ui/***: Headless UI components
- **tailwindcss**: Utility-first CSS framework

### Development Dependencies
- **vite**: Fast build tool and dev server
- **typescript**: Type safety
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **@replit/vite-plugin-cartographer**: Development tooling

## Deployment Strategy

### Production Configuration
- **Server Port**: 5000 (hardcoded for production environment)
- **Host Binding**: 0.0.0.0 for external accessibility
- **Build Process**: Vite builds client assets, esbuild bundles server code
- **Environment Variables**: DATABASE_URL required for PostgreSQL connection
- **Session Security**: Configurable session secret and HTTPS enforcement

### Development Setup
- **Database**: Automatic schema push via Drizzle migrations
- **Hot Reload**: Vite HMR for frontend, tsx for backend development
- **Error Handling**: Runtime error overlays and detailed logging
- **CORS**: Configured for cross-origin development requests

### Scalability Considerations
- **Database**: Serverless PostgreSQL scales automatically
- **Session Store**: Production requires Redis or database-backed sessions
- **File Storage**: Prepared for CDN integration for logos and assets
- **API Rate Limiting**: Framework in place for request throttling

## Deployment Strategy

### VPS AlmaLinux + Webmin Deployment
- **Automated Scripts**: Complete deployment automation for AlmaLinux servers
- **Quick Deploy**: One-command deployment process with error handling
- **Production Ready**: Includes Nginx, PostgreSQL, PM2, SSL, and Webmin setup
- **Monitoring**: System health checks and resource monitoring included

### Deployment Files
- `deploy/deploy-vps.sh`: Complete server setup for AlmaLinux + Webmin
- `deploy/upload-project.sh`: Project file upload via rsync
- `deploy/quick-deploy.sh`: One-command full deployment
- `deploy/check-system.sh`: System health verification
- `deploy/README-DEPLOY.md`: Complete deployment documentation

### Production Configuration
- **Server**: AlmaLinux with Webmin panel
- **Web Server**: Nginx with reverse proxy and SSL
- **Database**: PostgreSQL with automated setup
- **Process Manager**: PM2 with clustering
- **Security**: Firewall configuration and SSL certificates
- **Monitoring**: Resource monitoring and log management

## Changelog

```
Changelog:
- July 02, 2025. Initial setup
- July 02, 2025. Tema financeiro dourado implementado
- July 02, 2025. Campo CPF adicionado para mercado brasileiro
- July 02, 2025. Erro SQL corrigido no método getAffiliatePerformance
- July 02, 2025. Guia completo de implementação de rotas criado (IMPLEMENTACAO_ROTAS.md)
- July 03, 2025. Sistema de postbacks dinâmicos implementado com tokens únicos por casa
- July 03, 2025. Geração de links usando username como affid parameter
- July 03, 2025. APIs de pagamentos administrativos com aprovação/rejeição
- July 03, 2025. Formulário completo de casas de apostas com configurações avançadas
- July 03, 2025. Gerador de teste específico para postbacks por casa
- July 03, 2025. Rotas específicas /api/postback/{TOKEN}/registration e /api/postback/{TOKEN}/deposit
- July 03, 2025. Scripts completos de deploy para VPS AlmaLinux + Webmin criados
- July 03, 2025. Tema dourado aplicado em todos os modais e formulários
- July 03, 2025. Melhorias de alinhamento responsivo na página de casas de apostas
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```