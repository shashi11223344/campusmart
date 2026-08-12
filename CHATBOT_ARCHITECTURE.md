# 🏗️ AI Chatbot - Architecture & Data Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                       FRONTEND (React)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   App.tsx                                │  │
│  │  - Renders all pages                                     │  │
│  │  - Includes ChatbotWidget on every page                 │  │
│  └────────────────┬─────────────────────────────────────────┘  │
│                   │                                              │
│                   ▼                                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │            ChatbotWidget.tsx (UI Component)             │  │
│  │  ├─ Floating chat button                                 │  │
│  │  ├─ Chat window (600px height)                           │  │
│  │  ├─ Message display                                      │  │
│  │  ├─ Input form                                           │  │
│  │  └─ Action buttons (clear, close, copy)                 │  │
│  └────────────────┬─────────────────────────────────────────┘  │
│                   │                                              │
│                   ▼                                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │            useChatbot() Hook (Logic)                    │  │
│  │  ├─ Message state management                             │  │
│  │  ├─ Send message function                                │  │
│  │  ├─ Load history function                                │  │
│  │  ├─ Clear history function                               │  │
│  │  └─ Error handling                                       │  │
│  └────────────────┬─────────────────────────────────────────┘  │
│                   │                                              │
│                   │ HTTP Requests                                │
│                   │                                              │
└───────────────────┼──────────────────────────────────────────────┘
                    │
                    │ API Calls
                    │
    ┌───────────────▼────────────────────────────────────────┐
    │                  BACKEND (Express)                     │
    └───────────────┬────────────────────────────────────────┘
                    │
        ┌───────────┴────────────────────┐
        │                                │
        ▼                                ▼
    ┌────────────────────┐      ┌─────────────────────┐
    │ Authentication     │      │ Chatbot Routes      │
    │ Middleware         │      │ /api/chatbot/*      │
    │ - JWT Verification │      │                     │
    │ - User Extraction  │      │ POST /message       │
    └────────────────────┘      │ GET /history        │
                                 │ DELETE /history     │
                                 │ GET /analytics      │
                                 │ POST /feedback      │
                                 └──────────┬──────────┘
                                           │
                                           ▼
                    ┌────────────────────────────────────────┐
                    │  Chatbot Service                       │
                    │  (chatbot.service.ts)                  │
                    │                                        │
                    │  ├─ chat()                             │
                    │  ├─ detectIntent()                     │
                    │  ├─ getConversationHistory()           │
                    │  ├─ getUserContext()                   │
                    │  ├─ getChatHistory()                   │
                    │  └─ getChatAnalytics()                 │
                    └────────────────────────────────────────┘
                                │
                    ┌───────────┴────────────────┐
                    │                            │
                    ▼                            ▼
        ┌──────────────────────┐      ┌──────────────────────┐
        │ Groq API (Mixtral)    │      │ Database (SQLite)    │
        │                      │      │                      │
        │ ├─ Send messages      │      │ ├─ ChatMessage       │
        │ ├─ Get responses      │      │ ├─ User (FK)         │
        │ ├─ Token counting     │      │ ├─ Indexed by userId │
        │ └─ Error handling     │      │ └─ Cascade delete    │
        └──────────────────────┘      └──────────────────────┘
```

---

## Message Flow Diagram

### User Sends Message

```
USER                          FRONTEND                    BACKEND
 │                               │                           │
 │ 1. Type message                │                           │
 │ ─────────────────────────────► │                           │
 │                                │                           │
 │                                │ 2. Click Send             │
 │                                │ ─────────────────────────►│
 │                                │                           │
 │                                │                           │
 │                                │ 3. Validate & Extract JWT │
 │                                │ (in middleware)           │
 │                                │ ◄─────────────────────────│
 │                                │                           │
 │                                │ 4. Detect Intent          │
 │                                │ ◄─────────────────────────│
 │                                │                           │
 │                                │ 5. Get User Context       │
 │                                │ ◄─────────────────────────│
 │                                │                           │
 │                                │ 6. Save User Message      │
 │                                │ (to database)             │
 │                                │ ◄─────────────────────────│
 │                                │                           │
 │                                │ 7. Send to OpenAI API     │
 │                                │ ◄─────────────────────────│
 │                                │                           │
 │                                │ 8. Get AI Response        │
 │                                │ ◄─────────────────────────│
 │                                │                           │
 │                                │ 9. Save Assistant Message │
 │                                │ (to database)             │
 │                                │ ◄─────────────────────────│
 │                                │                           │
 │ 10. Display response            │ 10. Return Response       │
 │ ◄───────────────────────────────────────────────────────────│
 │                                │                           │
 │ 11. Show in chat window         │                           │
 │ ─────────────────────────────► │                           │
 │                                │                           │
```

---

## Data Models

### User (existing)
```
id          Integer    (PK)
name        String
email       String     (unique)
passwordHash String
phone       String?
institution String?
role        String     (default: "user")
createdAt   DateTime
updatedAt   DateTime

Relations:
├─ orders (Order[])
├─ wishlist (WishlistItem[])
├─ addresses (Address[])
├─ classifieds (Classified[])
└─ chatMessages (ChatMessage[]) ← NEW
```

### ChatMessage (NEW)
```
id        Integer    (PK)
userId    Integer    (FK → User.id)
role      String     ("user" | "assistant")
content   String
intent    String?    (product_info | order_tracking | etc.)
metadata  String?    (JSON)
createdAt DateTime   (indexed with userId)

Indexes:
- [userId, createdAt] for fast history retrieval
- Cascade delete on user deletion
```

---

## Sequence Diagram - Full Conversation

```
┌─────┐     ┌────────────┐     ┌────────────┐     ┌───────┐     ┌──────┐
│User │     │  Frontend  │     │  Backend   │     │ Groq  │     │ DB   │
└──┬──┘     └─────┬──────┘     └────┬───────┘     └───┬───┘     └──┬───┘
   │              │                  │                 │             │
   │ "Hi there"   │                  │                 │             │
   │─────────────►│                  │                 │             │
   │              │ POST /message    │                 │             │
   │              │─────────────────►│                 │             │
   │              │                  │ 1. Validate     │             │
   │              │                  │    & Auth       │             │
   │              │                  │ 2. Get User     │             │
   │              │                  ├─────────────────────────────►│
   │              │                  │◄─────────────────────────────┤
   │              │                  │ 3. Detect Intent              │
   │              │                  │    (keyword match)            │
   │              │                  │ 4. Load History             │
   │              │                  ├─────────────────────────────►│
   │              │                  │◄─────────────────────────────┤
   │              │                  │ 5. Save User Message        │
   │              │                  ├─────────────────────────────►│
   │              │                  │◄─────────────────────────────┤
   │              │                  │ 6. Call Groq API            │
   │              │                  ├────────────────────────────►│
   │              │                  │◄────────────────────────────┤
   │              │                  │    Response received        │
   │              │                  │ 7. Save AI Response         │
   │              │                  ├─────────────────────────────►│
   │              │                  │◄─────────────────────────────┤
   │              │◄─────────────────┤ Return Response             │
   │              │ {response, id}   │                 │             │
   │ Display msg  │                  │                 │             │
   │◄─────────────┤                  │                 │             │
   │              │                  │                 │             │
```

---

## Component Interaction

```
App.tsx
  │
  ├─ (on mount)
  │   ├─ Import ChatbotWidget
  │   └─ Render ChatbotWidget on all pages
  │
  └─ ChatbotWidget.tsx
      │
      ├─ (on mount)
      │   ├─ Call useChatbot()
      │   └─ Load chat history via API
      │
      ├─ useChatbot() hook
      │   ├─ State: messages, loading, error
      │   ├─ Effect: Load history on mount
      │   │   └─ GET /api/chatbot/history
      │   │
      │   ├─ Function: sendMessage()
      │   │   ├─ Validate input
      │   │   ├─ Add to messages optimistically
      │   │   ├─ POST /api/chatbot/message
      │   │   └─ Update messages with response
      │   │
      │   ├─ Function: clearHistory()
      │   │   └─ DELETE /api/chatbot/history
      │   │
      │   └─ Function: loadHistory()
      │       └─ GET /api/chatbot/history
      │
      └─ UI Rendering
          ├─ Header (title, buttons)
          ├─ Messages Container
          │   ├─ Loop through messages
          │   ├─ Style based on role
          │   └─ Add copy button to AI messages
          ├─ Input Form
          │   ├─ Input field
          │   └─ Send button
          └─ Error Display (if any)
```

---

## API Request/Response Examples

### Request: Send Message
```
POST /api/chatbot/message
Authorization: Bearer eyJhbGc...
Content-Type: application/json

{
  "message": "Can you track my order?"
}
```

### Response: Message Sent
```
HTTP 200 OK
Content-Type: application/json

{
  "success": true,
  "data": {
    "id": 42,
    "response": "I'd be happy to help track your order. Could you provide your order ID or email?",
    "intent": "order_tracking",
    "metadata": {
      "tokens_used": 123
    }
  }
}
```

### Request: Get History
```
GET /api/chatbot/history?limit=50
Authorization: Bearer eyJhbGc...
```

### Response: History Retrieved
```
HTTP 200 OK

{
  "success": true,
  "data": [
    {
      "id": 40,
      "role": "user",
      "content": "Tell me about laptops",
      "intent": "product_info",
      "createdAt": "2024-01-10T10:20:00Z"
    },
    {
      "id": 41,
      "role": "assistant",
      "content": "We have several laptops available...",
      "intent": "product_info",
      "createdAt": "2024-01-10T10:20:30Z"
    }
  ]
}
```

---

## State Management

### Frontend State (React)
```
messages: ChatMessage[] = []
  ├─ message objects from API
  ├─ includes user & assistant messages
  └─ displayed in chat window

loading: boolean = false
  ├─ true when sending message
  └─ disables input during processing

error: string | null = null
  ├─ null when no errors
  ├─ error message when API fails
  └─ cleared before next request

isInitialized: boolean = false
  ├─ false on mount
  ├─ true after first history load
  └─ prevents show loading spinner
```

### Backend State (Database)
```
ChatMessage table
  ├─ row per message (user or assistant)
  ├─ linked to user by userId
  ├─ intent detected and stored
  └─ indexed by (userId, createdAt)

Cache (in memory)
  ├─ OpenAI API responses (temporary)
  └─ User context (re-fetched per request)
```

---

## Error Handling Flow

```
User sends message
         │
         ▼
   Validate input
    (empty? too long?)
         │
    ┌────┴─────┐
    │           │
   NO          YES
    │           │
    │     Return error
    │       to user
    │
    ▼
Call API
    │
┌───┴─────┐
│          │
OK     ERROR
│          │
│    Log error
│    Show to user
│    Remove msg
│
▼
Update UI
```

---

## Performance Optimization

### Message Loading
```
Load 50 messages
    │
    ├─ Database query: ~50ms
    ├─ Network transfer: ~100ms
    ├─ Frontend render: ~50ms (with virtualization possible)
    └─ Total: ~200ms
```

### Message Sending
```
User sends message
    │
    ├─ Input validation: ~5ms
    ├─ Optimistic UI update: instant
    ├─ API request: ~200ms
    ├─ Intent detection: ~10ms
    ├─ History loading: ~50ms
    ├─ Groq API call: ~500-1500ms (much faster than OpenAI!)
    ├─ Database save: ~20ms
    ├─ Response sending: ~100ms
    └─ Total: 0.8-1.9 seconds
```

---

## Security Flow

```
Request arrives
    │
    ▼
1. Check authentication
   ├─ Extract JWT from header
   ├─ Verify signature
   └─ Extract userId
    │
    ├─ No token? → 401 Unauthorized
    ├─ Invalid? → 401 Unauthorized
    └─ Valid? → Continue
    │
    ▼
2. Validate input
   ├─ Message not empty?
   ├─ Message ≤ 1000 chars?
   └─ Valid JSON?
    │
    ├─ Invalid? → 400 Bad Request
    └─ Valid? → Continue
    │
    ▼
3. Check rate limit
   ├─ Count requests in 15 min window
   └─ Allow if < 500
    │
    ├─ Too many? → 429 Too Many Requests
    └─ OK? → Continue
    │
    ▼
4. Process request
   └─ Save to database (userId ensures isolation)
    │
    ▼
5. Return response
   └─ Include message ID and content
```

---

## Scalability Considerations

### Current (SQLite)
- Good for: Development, testing, small deployments
- Limit: ~10-50 concurrent users
- Storage: 1KB per message

### PostgreSQL (Recommended for Production)
- Update `DATABASE_URL` in `.env`
- Change Prisma provider to `"postgresql"`
- Performance: Handles 1000+ concurrent users
- Scaling: Add read replicas, connection pooling

### Groq API Limits
- Rate: 30 requests/min (free tier), higher with paid
- Tokens: Set max_tokens to control usage
- Cost: FREE tier available! Pay-as-you-go if needed

---

## Monitoring & Debugging

### Logs to Monitor
```
Frontend Console (F12)
├─ API call errors
├─ React errors
└─ Hook state changes

Backend Terminal
├─ API requests
├─ Database queries
├─ OpenAI API calls
└─ Error stack traces
```

### Key Metrics
```
Performance
├─ Message response time
├─ API latency
└─ Database query time

Usage
├─ Messages per user
├─ Intent distribution
└─ Error rate

Cost (Groq)
  ├─ API calls (free tier!)
  └─ Minimal spend (if exceeding free tier)
```

---

This architecture ensures scalability, security, and maintainability while providing a seamless user experience!
