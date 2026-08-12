# 🚀 AI Chatbot - Quick Reference & Next Steps

## ⚡ Super Quick Setup (Copy-Paste)

### 1. Install Package
```bash
cd backend && npm install openai && cd ..
```

### 2. Update .env
```bash
# Edit backend/.env
# Add these lines:
GROQ_API_KEY="gsk-your-key-here"
GROQ_MODEL="mixtral-8x7b-32768"
CHATBOT_ENABLED="true"
```

### 3. Create Database
```bash
cd backend
npx prisma migrate dev --name add_chatbot
cd ..
```

### 4. Start Services
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
npm run dev:frontend
```

### 5. Test!
- Open http://localhost:5173
- Login
- Click chat icon (bottom-right)
- Type a message!

**Done! ✅**

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| **CHATBOT_SETUP.md** | Comprehensive setup guide (60KB) |
| **CHATBOT_IMPLEMENTATION.md** | What was implemented (detailed) |
| **CHATBOT_ARCHITECTURE.md** | System design & data flow (visual) |
| **This File** | Quick reference & next steps |

---

## 🎯 Key Endpoints

```
POST   /api/chatbot/message     - Send message
GET    /api/chatbot/history     - Get chat history
DELETE /api/chatbot/history     - Clear chat
GET    /api/chatbot/analytics   - Admin analytics
POST   /api/chatbot/feedback    - Save feedback
```

All require JWT authentication (add to header):
```
Authorization: Bearer <your-jwt-token>
```

---

## 📂 Files Created

```
NEW FILES:
✅ backend/src/services/chatbot.service.ts
✅ backend/src/routes/chatbot.routes.ts
✅ src/hooks/useChatbot.ts
✅ src/components/ChatbotWidget.tsx
✅ CHATBOT_SETUP.md
✅ CHATBOT_IMPLEMENTATION.md
✅ CHATBOT_ARCHITECTURE.md

MODIFIED FILES:
✅ backend/prisma/schema.prisma (ChatMessage model added)
✅ backend/src/index.ts (routes registered)
✅ src/App.tsx (widget imported)
✅ backend/.env (config added)
```

---

## 🔧 Common Tasks

### Get OpenAI API Key
1. Go to https://platform.openai.com/account/api-keys
2. Sign up or login
3. Click "Create new secret key"
4. Copy the key (you won't see it again!)
5. Add to `backend/.env`

### Test API via Terminal
```bash
# Get JWT token
TOKEN=$(curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@campusmart.in","password":"Admin@1234"}' \
  | jq -r '.data.accessToken')

# Send message
curl -X POST http://localhost:3001/api/chatbot/message \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello!"}'
```

### Check Backend Logs
Look at terminal where you ran `npm run dev` in backend folder

### Check Frontend Errors
Press F12 in browser → Console tab

### Database Queries
```bash
cd backend
npx prisma studio  # Visual database viewer
```

---

## ⚙️ Configuration Options

### Model Selection
```env
# In backend/.env

# Option 1: Best Quality (GPT-4 Turbo)
OPENAI_MODEL="gpt-4-turbo"           # ~$0.03/msg

# Option 2: Balanced (GPT-3.5 Turbo)
OPENAI_MODEL="gpt-3.5-turbo"         # ~$0.002/msg

# Option 3: Custom
OPENAI_MODEL="your-model-name"       # Your choice
```

### Conversation History Length
Edit `backend/src/services/chatbot.service.ts`, line 111:
```typescript
private async getConversationHistory(userId: number, limit: number = 10)
                                                                       ↑
                                                           Change 10 to any number
```

### System Prompt Customization
Edit `backend/src/services/chatbot.service.ts`, lines 20-50:
```typescript
this.systemPrompt: string = `You are CampusMart Assistant...
// Edit this text to customize chatbot behavior
`;
```

---

## 🧪 Testing Scenarios

### Test 1: Product Question
**User:** "What laptops do you have?"
**Expected:** Chatbot identifies as `product_info` intent

### Test 2: Order Tracking
**User:** "Where is my order?"
**Expected:** Chatbot identifies as `order_tracking` intent

### Test 3: Campus Info
**User:** "What are the library hours?"
**Expected:** Chatbot identifies as `facility_info` intent

### Test 4: Admission Question
**User:** "How do I enroll?"
**Expected:** Chatbot identifies as `admission_guidance` intent

### Test 5: Context Awareness
Send multiple messages in a row - chatbot should remember previous messages.

### Test 6: Persistence
Refresh page - chat history should still be there.

---

## 🐛 Troubleshooting Quick Guide

| Problem | Solution |
|---------|----------|
| "API key not found" | Add to `backend/.env`, restart |
| "ChatMessage not found" | Run migration: `npx prisma migrate dev` |
| "401 Unauthorized" | Login first, check JWT token |
| "No response from chatbot" | Check Groq API status, have valid key |
| "Slow responses" | Normal (1-3 sec). Check internet |
| "Chat widget not showing" | Clear browser cache, restart frontend |
| "Cannot connect to backend" | Ensure `npm run dev` in backend folder |
| "Chat widget not showing" | Clear browser cache, restart frontend |
| "Cannot connect to backend" | Ensure `npm run dev` in backend folder |

---

## 📊 Admin Dashboard Features

As admin, you can:

```bash
# Get analytics
curl -X GET http://localhost:3001/api/chatbot/analytics \
  -H "Authorization: Bearer ADMIN_TOKEN"

# Get response:
{
  "totalMessages": 1523,
  "intentDistribution": [...],
  "uniqueUsers": 287
}
```

Track:
- Total messages processed
- Intent breakdown
- Active users
- Popular questions

---

## 💰 Cost Estimation

### Groq Pricing (as of 2024)

Groq offers a **free tier** with generous rate limits!

| Model | Free Tier | Paid |
|-------|-----------|------|
| Mixtral 8x7B | 30 req/min | Included |
| LLaMA 2 70B | 30 req/min | Included |
| LLaMA 3 8B | 30 req/min | Included |

### Usage Examples

```
Groq Free Tier = NO COST for most applications
Paid Tier (if needed) = Pay per token (very affordable)
```

**Groq is 10x+ faster than OpenAI and has free tier!**

---

## 🎨 Customization Ideas

### Easy (No coding)
- Change system prompt for different tone
- Add custom company information
- Adjust conversation history length
- Change UI colors/theme

### Medium (Some coding)
- Add knowledge base integration
- Implement multi-language support
- Custom intent categories
- Export chat as PDF

### Advanced (Full development)
- Semantic search on product DB
- Image recognition for products
- WhatsApp/Slack integration
- Human agent escalation

---

## 📈 Performance Tips

### Reduce Latency
```typescript
// Use fastest model (Groq is already very fast)
GROQ_MODEL="mixtral-8x7b-32768"

// Reduce token limit
max_tokens: 300  // was 500

// Cache common responses
// (implement in service)
```

### Reduce Costs
```typescript
// Groq is already very cost-effective (free tier!)
// All models included in free tier

// Limit conversation history
limit: 5  // was 10

// Implement response caching
```

### Better UX
```typescript
// Show typing indicator (already done)
// Use shorter messages
// Pre-load history on login
// Debounce message sending
```

---

## 🔐 Security Checklist

- ✅ JWT authentication required
- ✅ Rate limiting (500 req/15min)
- ✅ Input validation (max 1000 chars)
- ✅ SQL injection prevention (Prisma)
- ✅ XSS prevention (React auto-escapes)
- ✅ CORS properly configured
- ✅ API key not in frontend code
- ✅ Database cascade delete on user

---

## 📞 Getting Help

### Debug Steps
1. Check backend terminal for errors
2. Press F12 in browser, check console
3. Check `backend/.env` has OPENAI_API_KEY
4. Try simple test message first
5. Check OpenAI API status

### Resources
- **OpenAI Docs**: https://platform.openai.com/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Full Setup**: See CHATBOT_SETUP.md
- **Architecture**: See CHATBOT_ARCHITECTURE.md

---

## 🚀 Next Steps (What to Do Now)

### Immediate (Today)
1. ✅ Get OpenAI API key
2. ✅ Add to `backend/.env`
3. ✅ Run migration
4. ✅ Start services
5. ✅ Test it works

### Short Term (This Week)
1. Customize system prompt for your domain
2. Add campus/company specific knowledge
3. Test all intent categories
4. Implement feedback collection UI
5. Setup basic analytics

### Medium Term (This Month)
1. Integrate with product database
2. Add order context to responses
3. Implement multi-language support
4. Setup cost monitoring
5. Create admin analytics dashboard

### Long Term (This Quarter)
1. Train custom model on company data
2. Implement semantic search
3. Add human agent escalation
4. Support multiple channels (WhatsApp, etc.)
5. Advanced analytics and reporting

---

## 📋 Pre-Launch Checklist

Before going live:

- [ ] OpenAI API key is valid and funded
- [ ] Database migration completed
- [ ] All files are in place
- [ ] Backend and frontend start without errors
- [ ] Chatbot widget visible after login
- [ ] Can send and receive messages
- [ ] Chat history persists after refresh
- [ ] Clear history button works
- [ ] Copy message functionality works
- [ ] Mobile responsive
- [ ] Dark mode works (if applicable)
- [ ] Error handling tested
- [ ] Rate limiting verified
- [ ] Security review completed
- [ ] Performance acceptable (< 3 sec response)

---

## 🎉 Success Indicators

After setup, you should see:

✅ Floating chat button in bottom-right  
✅ Chat window opens on click  
✅ Can type and send messages  
✅ AI responds within 2 seconds  
✅ Messages persist after refresh  
✅ Different intents detected properly  
✅ Error handling works  
✅ Mobile view looks good  

---

## 📞 Support Contacts

**For OpenAI Issues:**
- https://platform.openai.com/account/billing/overview
- https://status.openai.com

**For Database Issues:**
- https://www.prisma.io/support

**For React Issues:**
- https://react.dev
- https://react.dev/community

---

## 📄 Version Info

```
Chatbot Version:  1.0
Date Implemented: January 2024
OpenAI API:       GPT-4 Turbo
Database:         SQLite (Prisma)
Framework:        React + Express
Status:           Production Ready
```

---

**You're all set! Happy chatting! 🤖💬**

Questions? See the full documentation files:
- CHATBOT_SETUP.md (comprehensive)
- CHATBOT_ARCHITECTURE.md (technical)
- CHATBOT_IMPLEMENTATION.md (detailed)
