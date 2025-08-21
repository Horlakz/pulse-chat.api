# Pulse Chat API 🚀

A robust, real-time chat API built with Node.js, Express, TypeScript, and Socket.IO. This application demonstrates enterprise-grade architecture patterns including dependency injection, comprehensive error handling, data validation, real-time messaging, and more.

## 📚 Documentation

**[Complete API Documentation](https://documenter.getpostman.com/view/26276921/2sB3BKGUKR)**

## ✨ Key Features

### 🏗️ **Architecture & Design Patterns**

- **Modular Architecture**: Clean separation of concerns with organized modules
- **Dependency Injection**: Loosely coupled components for better testability
- **Service Layer Pattern**: Business logic abstraction from controllers
- **Repository Pattern**: Data access layer abstraction via Prisma ORM

### 🔐 **Authentication & Security**

- JWT-based authentication with access/refresh token strategy
- Password hashing using Argon2 algorithm
- Role-based access control
- Secure middleware for route protection

### ⚡ **Real-time Communication**

- WebSocket connections via Socket.IO
- Real-time message delivery
- User presence tracking (online/offline status)
- Message delivery receipts and read status
- Room-based chat functionality

### 🛡️ **Error Handling & Validation**

- **Centralized Error Handling**: Custom `HttpException` class
- **Custom Exception Types**: `BadRequestException`, `UnauthorizedException`, `NotFoundException`, etc.
- **Global Error Middleware**: `errorHandler` for consistent error responses
- **DTO Validation**: `validateDto` middleware using class-validator
- **Request Sanitization**: Automatic whitelist validation and type conversion

### 📊 **Database & Caching**

- **PostgreSQL** with Prisma ORM for type-safe database operations
- **Redis** integration for caching and session management
- **Database Migrations**: Version-controlled schema changes
- **Connection Pooling**: Optimized database performance

### 🔧 **Development Experience**

- **TypeScript**: Full type safety and IntelliSense support
- **Hot Reload**: Nodemon for development efficiency
- **Environment Configuration**: Type-safe environment variables via `config/env.ts`
- **Path Aliases**: Clean imports using module-alias
- **Code Quality**: ESLint configuration for consistent code style

### 📨 **Message Management**

- Send and receive messages in real-time
- Message persistence with delivery guarantees
- Pagination support for message history
- Message read receipts and delivery status
- Bulk message operations

### 👥 **User Management**

- User registration and authentication
- Profile management
- User presence and activity tracking
- Online/offline status broadcasting

### 🏠 **Room/Channel System**

- Create and manage chat rooms
- Room-based message routing
- User permissions and access control
- Private and group conversations

## 🚀 Quick Start

### Prerequisites

- Node.js (v18+)
- MySQL
- Redis
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/horlakz/pulse-chat.api
   cd pulse-chat.api
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.sample .env
   nano .env
   ```

   Ensure you set the following variables in your `.env` file:

   ```
   DATABASE_URL="mysql://horlakz:password@localhost:3306/pulse_chat?schema=public"

   PORT=8000

   JWT_ACCESS_SECRET=630c88b7be60a1a64031d9e62c8a5137b3814287c3c05063e5a8911c1f5072e6
   JWT_REFRESH_SECRET=688a701045ece1723187db91badb8060b8fdd097ed538bbe3cc985b92ca60953

   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=

   ```

4. **Database Setup**

   ```bash
   # Generate Prisma client
   pnpm prisma:generate

   # Run migrations
   pnpm prisma:deploy
   ```

5. **Start Development Server**
   ```bash
   pnpm dev
   ```

## 📋 Available Scripts

```bash
# Development
pnpm dev              # Start development server with hot reload

# Build & Production
pnpm build           # Compile TypeScript to JavaScript
pnpm start           # Start production server

# Database
pnpm prisma:generate # Generate Prisma client
pnpm prisma:migrate  # create database migrations
pnpm prisma:deploy   # Deploy migrations to production

# Code Quality
pnpm lint            # Run ESLint
```

## 🏛️ Project Structure

```
src/
├── app.ts                    # Express app configuration
├── server.ts                 # Server entry point
├── socket.ts                 # Socket.IO configuration
├── config/
│   ├── env.ts               # Environment configuration
│   ├── prisma.ts            # Database connection
│   └── redis.ts             # Redis configuration
├── exceptions/
│   ├── http-exception.ts    # Base exception class
│   └── index.ts             # Specific exception types
├── middleware/
│   ├── auth.ts              # Authentication middleware
│   ├── exception-handler.ts # Global error handler
│   └── validator-dto.ts     # DTO validation middleware
├── modules/
│   ├── auth/                # Authentication module
│   │   ├── auth.service.ts  # Authentication business logic
│   │   ├── auth.dto.ts      # Data transfer objects
│   │   └── auth.controller.ts # Route handlers
│   └── chat/                # Chat module
│       ├── services/        # Chat business logic
│       ├── chat.dto.ts      # Chat DTOs
│       └── controllers/     # Chat controllers
├── routes/
│   ├── index.ts             # Route aggregation
│   ├── auth.route.ts        # Authentication routes
│   └── chat.route.ts        # Chat routes
├── types/                   # TypeScript type definitions
└── utilities/               # application utilities
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file based on `.env.sample`:

## 🛠️ Core Services

### Authentication Service

```typescript
// Login with email and password
await authService.login({ email, password });

// Register new user
await authService.register({ firstname, lastname, email, password });

// Refresh access token
await authService.refreshToken(refreshToken);
```

### Chat Service

```typescript
// Send message
await chatService.sendMessage(userId, roomId, messageData);

// Get message history with pagination
await chatService.listMessages(roomId, pageable);

// Update user presence
await chatService.updateUserPresence(userId, "online");

// Mark messages as read
await chatService.markMessagesAsRead(userId, roomId);
```

## 🔌 WebSocket Events

### Client → Server

- `join_room` - Join a chat room
- `leave_room` - Leave a chat room
- `send_message` - Send a new message
- `mark_read` - Mark messages as read
- `typing_start` - Start typing indicator
- `typing_stop` - Stop typing indicator

### Server → Client

- `message` - New message received
- `message_delivered` - Message delivery confirmation
- `message_read` - Message read confirmation
- `user_joined` - User joined room
- `user_left` - User left room
- `user_typing` - User typing indicator
- `presence_update` - User online/offline status

## 🧪 Error Handling Examples

The application provides comprehensive error handling:

```typescript
// Custom exceptions with specific HTTP status codes
throw new BadRequestException("Invalid input data");
throw new UnauthorizedException("Invalid credentials");
throw new NotFoundException("User not found");
throw new ConflictException("Email already exists");

// All errors are caught by the global error handler
// and returned in a consistent format:
{
  "message": "error",
  "error": "User not found"
}
```

## 📝 Response Format

All API responses follow a consistent format using the `BaseResponse` utility:

```typescript
// Success Response
{
  "message": "success",
  "data": { /* response data */ }
}

// Paginated Response
{
  "message": "success",
  "data": [ /* array of items */ ],
  "total": 150
}

// Error Response
{
  "message": "error",
  "error": "Error description"
}
```

## 🔒 Security Features

- **Password Hashing**: Argon2 algorithm for secure password storage
- **JWT Security**: Secure token generation and validation
- **CORS Configuration**: Cross-origin resource sharing protection
- **Request Validation**: Input sanitization and validation
- **Rate Limiting**: Protection against abuse (configurable)
- **SQL Injection Prevention**: Prisma ORM parameterized queries

## 📈 Performance Optimizations

- **Connection Pooling**: Efficient database connection management
- **Redis Caching**: Fast data retrieval for frequently accessed data
- **Database Indexing**: Optimized query performance
- **Pagination**: Efficient large dataset handling
- **WebSocket Optimization**: Real-time communication with minimal overhead

## 🔍 Monitoring & Logging

- **Morgan Logger**: HTTP request logging
- **Console Error Logging**: Centralized error tracking
- **Environment-based Logging**: Different log levels for dev/prod
- **Request Tracing**: Track requests through the application

## 🚀 Deployment

### Production Build

```bash
# Build the application
pnpm build

# Deploy database migrations
pnpm prisma:deploy

# Start production server
pnpm start
```

### Docker Support

The application is containerization-ready with proper environment configuration.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

---

## 🎯 Why This Architecture?

This application showcases modern Node.js development best practices:

- **Scalability**: Modular design allows for easy feature additions
- **Maintainability**: Clean separation of concerns and dependency injection
- **Reliability**: Comprehensive error handling and validation
- **Performance**: Efficient database operations and caching strategies
- **Developer Experience**: TypeScript, hot reload, and comprehensive tooling
- **Production Ready**: Environment configuration, logging, and deployment considerations

Perfect for learning advanced Node.js patterns or as a foundation for production chat applications! 🎉
