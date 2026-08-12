# 🤖 CampusMart AI Chatbot Assistant - Complete Setup Guide

## Overview

The AI Chatbot Assistant is a fully integrated feature that provides 24/7 intelligent support to CampusMart users. It can answer product questions, track orders, provide campus facility information, guide admissions, and resolve common issues.

---

## 📋 Features

✅ **Product Information** - Answer questions about products, pricing, specifications  
✅ **Order Tracking** - Help users track their orders and deliveries  
✅ **Campus Facilities** - Provide information about labs, libraries, sports facilities  
✅ **Admission Guidance** - Guide students through enrollment processes  
✅ **Account Management** - Help with profile, password, address updates  
✅ **Issue Resolution** - Resolve common problems and complaints  
✅ **Conversation Memory** - Maintains context across conversations  
✅ **Intent Detection** - Automatically detects user intent for better responses  
✅ **Chat History** - Stores and retrieves conversation history  

---

## 🚀 Setup Instructions

### Step 1: Install OpenAI Package

```bash
cd backend
npm install openai
```

### Step 2: Get Groq API Key

1. Visit [Groq Console](https://console.groq.com)
2. Sign up or login to your account
3. Go to API Keys section
4. Create a new API key
5. Copy the API key (starts with `gsk-`)

### Step 3: Update Environment Variables

**File:** `backend/.env`

```env
# AI Chatbot Configuration (Groq API)
GROQ_API_KEY="gsk-your-actual-groq-key-here"
GROQ_MODEL="mixtral-8x7b-32768"
CHATBOT_ENABLED="true"
```

**Replace `gsk-your-actual-groq-key-here` with your actual Groq API key**

### Step 4: Database Migration

The chatbot uses a new `ChatMessage` model in Prisma. You need to create a migration:

```bash
cd backend

# Generate the migration
npx prisma migrate dev --name add_chatbot

# This will:
# 1. Create the migration file
# 2. Apply it to your database
# 3. Generate the Prisma client
```

### Step 5: Restart Services

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
npm run dev:frontend
```

---

## 📁 File Structure

### Backend Files

```
backend/src/
├── services/
│   └── chatbot.service.ts          # Core chatbot logic & OpenAI integration
├── routes/
│   └── chatbot.routes.ts           # API endpoints
├── index.ts                        # (Updated) - Routes registered
└── prisma/
    └── schema.prisma               # (Updated) - ChatMessage model added
```

### Frontend Files

```
src/
├── components/
│   └── ChatbotWidget.tsx           # Chat UI component
├── hooks/
│   └── useChatbot.ts               # Custom hook for chatbot logic
└── App.tsx                         # (Updated) - ChatbotWidget imported
```

---

## 🔌 API Endpoints

### 1. Send Message

**Endpoint:** `POST /api/chatbot/message`

**Authentication:** Required (JWT token)

**Request Body:**
```json
{
  "message": "What products do you have?"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "response": "We have a wide range of products including...",
    "intent": "product_info",
    "metadata": {
      "tokens_used": 245
    }
  }
}
```

---

### 2. Get Chat History

**Endpoint:** `GET /api/chatbot/history?limit=50`

**Authentication:** Required (JWT token)

**Query Parameters:**
- `limit` (optional, default: 50, max: 100)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "role": "user",
      "content": "Tell me about products",
      "intent": "product_info",
      "createdAt": "2024-01-10T10:30:00Z"
    },
    {
      "id": 2,
      "role": "assistant",
      "content": "We have a wide range of products...",
      "intent": "product_info",
      "createdAt": "2024-01-10T10:30:30Z"
    }
  ]
}
```

---

### 3. Clear Chat History

**Endpoint:** `DELETE /api/chatbot/history`

**Authentication:** Required (JWT token)

**Response:**
```json
{
  "success": true,
  "message": "Chat history cleared"
}
```

---

### 4. Get Analytics (Admin Only)

**Endpoint:** `GET /api/chatbot/analytics`

**Authentication:** Required (JWT token, Admin role)

**Response:**
```json
{
  "success": true,
  "data": {
    "totalMessages": 1523,
    "intentDistribution": [
      { "intent": "product_info", "_count": 450 },
      { "intent": "order_tracking", "_count": 320 },
      { "intent": "facility_info", "_count": 280 },
      { "intent": "admission_guidance", "_count": 200 },
      { "intent": "general", "_count": 273 }
    ],
    "uniqueUsers": 287
  }
}
```

---

### 5. Save Feedback

**Endpoint:** `POST /api/chatbot/feedback`

**Authentication:** Required (JWT token)

**Request Body:**
```json
{
  "messageId": 123,
  "helpful": true,
  "feedback": "Very helpful response!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Feedback recorded"
}
```

---

## 🎯 Intent Categories

The chatbot automatically detects user intent:

| Intent | Keywords | Purpose |
|--------|----------|---------|
| `product_info` | product, price, specs, features, buy | Answer product questions |
| `order_tracking` | order, track, delivery, shipping, status | Track orders |
| `facility_info` | lab, library, facility, center, sports | Campus facility info |
| `admission_guidance` | admission, enroll, register, apply, course | Enrollment guidance |
| `account_management` | account, profile, password, email, address | Account help |
| `general` | Everything else | General assistance |

---

## 🎨 Frontend Integration

### Using the Chatbot Widget

The chatbot widget is automatically added to your app. It appears as a floating button in the bottom-right corner.

#### Features:
- Click to open/close
- Send messages with Enter or Send button
- Copy assistant responses
- Clear conversation history
- Dark mode support
- Responsive design

### Custom Implementation

If you want to use chatbot functionality in a custom component:

```typescript
import { useChatbot } from '@/hooks/useChatbot';

export function MyComponent() {
  const { messages, loading, error, sendMessage, clearHistory } = useChatbot();

  const handleSend = async () => {
    await sendMessage('Hello!');
  };

  return (
    <div>
      {messages.map(msg => (
        <div key={msg.id} className={msg.role}>
          {msg.content}
        </div>
      ))}
      <input onKeyPress={e => e.key === 'Enter' && handleSend()} />
    </div>
  );
}
```

---

## 🔒 Security & Rate Limiting

### Built-in Protections:

1. **Message Validation**
   - Max 1000 characters per message
   - Empty messages rejected
   - Input trimming and sanitization

2. **Authentication**
   - All endpoints require JWT token
   - Only authorized users can access their chat

3. **Rate Limiting**
   - Global rate limit: 500 requests per 15 minutes
   - Per-user chat limits (can be configured)

4. **Data Privacy**
   - Chat history stored per user
   - Users can clear their history anytime
   - Admins cannot access user messages

---

## 💾 Database Schema

### ChatMessage Model

```prisma
model ChatMessage {
  id        Int      @id @default(autoincrement())
  userId    Int
  role      String   // "user" | "assistant"
  content   String
  intent    String?  // Intent detection
  metadata  String?  // JSON metadata
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, createdAt])
}
```

---

## 🧪 Testing the Chatbot

### Manual Testing via API

```bash
# 1. Login and get JWT token
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@campusmart.in",
    "password": "Admin@1234"
  }'

# 2. Send a message (replace TOKEN with actual JWT)
curl -X POST http://localhost:3001/api/chatbot/message \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "What products do you have?"}'

# 3. Get chat history
curl -X GET http://localhost:3001/api/chatbot/history \
  -H "Authorization: Bearer TOKEN"

# 4. Clear chat history
curl -X DELETE http://localhost:3001/api/chatbot/history \
  -H "Authorization: Bearer TOKEN"
```

### Testing via Frontend

1. Open http://localhost:5173
2. Login with any account
3. Click the chatbot icon in bottom-right
4. Send messages and test functionality

---

## 🎓 System Prompt Customization

The chatbot uses a comprehensive system prompt defined in `chatbot.service.ts`:

**Location:** `backend/src/services/chatbot.service.ts` (lines 20-50)

You can customize the behavior by editing the `systemPrompt` variable:

```typescript
private systemPrompt: string = `You are CampusMart Assistant...
// Customize this text to change how the bot behaves
`;
```

### Common Customizations:

1. **Add specific knowledge:**
   - Add campus-specific information
   - Add company policies
   - Add FAQ answers

2. **Change tone:**
   - More formal: "Please provide detailed..."
   - More casual: "Hey! Let me help you..."

3. **Add guidelines:**
   - "Always mention contact support for..."
   - "For urgent issues, escalate to..."

---

## 🚨 Troubleshooting

### Error: "Groq API key not found"

**Solution:** Ensure `GROQ_API_KEY` is set in `backend/.env`

```bash
echo "GROQ_API_KEY=gsk-your-key" >> backend/.env
```

---

### Error: "ChatMessage model not found"

**Solution:** Run database migration:

```bash
cd backend
npx prisma migrate dev --name add_chatbot
```

---

### Error: "401 Unauthorized"

**Solution:** Ensure you're sending a valid JWT token:

```bash
# Make sure to login first and get a token
# Include it in Authorization header: Bearer <TOKEN>
```

---

### Chatbot Not Responding

**Solutions:**
1. Check Groq API key is valid
2. Check Groq account has quota available
3. Check backend is running: `npm run dev` in backend folder
4. Check internet connection
5. Review browser console for errors

---

## 📊 Analytics & Monitoring

### View Usage Analytics (Admin)

```bash
curl -X GET http://localhost:3001/api/chatbot/analytics \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### Key Metrics:
- Total messages processed
- Intent distribution
- Active users
- Response times
- Error rates

---

## 🔄 Scaling Considerations

### For Production:

1. **Database:** Migrate from SQLite to PostgreSQL
   ```
   Set DATABASE_URL to PostgreSQL connection string
   ```

2. **Rate Limiting:** Adjust limits in `index.ts`
   ```typescript
   const limiter = rateLimit({ 
     windowMs: 15 * 60 * 1000, 
     max: 500 
   });
   ```

3. **Message Storage:** Archive old messages
   ```typescript
   // Delete messages older than 90 days
   await prisma.chatMessage.deleteMany({
     where: {
       createdAt: { lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) }
     }
   });
   ```

4. **Cost Optimization:**
   - Groq is very cost-effective (free tier available)
   - Use `mixtral-8x7b-32768` (fast and accurate)
   - Implement caching for common questions
   - Set token limits per message

---

## 📚 Next Steps

### Recommended Enhancements:

1. **Knowledge Base Integration**
   - Connect to product database
   - Connect to FAQ database
   - Add dynamic context injection

2. **Advanced Features**
   - Image recognition for products
   - Multi-language support
   - Sentiment analysis
   - Escalation to human agents

3. **Analytics Dashboard**
   - Real-time message tracking
   - User satisfaction metrics
   - Common question identification
   - Performance insights

4. **Integration Points**
   - WhatsApp integration
   - Email support
   - Slack integration
   - Mobile app support

---

## 📞 Support

For issues or questions:
1. Check troubleshooting section above
2. Review OpenAI documentation: https://platform.openai.com/docs
3. Check backend logs: Check terminal where `npm run dev` is running
4. Check frontend console: Press F12 in browser

---

## 📄 License

This chatbot implementation is part of the CampusMart project and follows the same license terms.

---

**Version:** 1.0  
**Last Updated:** January 2024  
**Maintained By:** CampusMart Development Team
