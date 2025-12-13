# 🚀 AI Features Implementation Guide

This memorial site now includes comprehensive AI-powered features to enhance the experience for visitors and administrators.

## 🤖 AI Features Overview

### 1. **AI Content Moderation** ✅
- **Automatic moderation** of all submitted memories using OpenAI
- **Sentiment analysis** (positive, neutral, negative)
- **Content flagging** for inappropriate content
- **Auto-approval** for safe, positive content
- Manual review dashboard for flagged content

**Location:** `src/lib/ai/openai.ts` - `moderateMemory()`

### 2. **AI Chatbot Assistant** ✅
- **Intelligent Q&A** about service details
- **Context-aware** responses using memorial data
- **Suggested follow-up questions**
- **Floating chat widget** on memorial pages
- Powered by GPT-4o-mini for fast, accurate responses

**Location:** `src/components/ui/ai-chatbot.tsx`

### 3. **AI Tribute Summary Generator** ✅
- **Automatically summarizes** all shared memories
- **Identifies key themes** from tributes
- **Analyzes emotional tone** of collective messages
- Perfect for family to understand sentiment
- Exportable for use in programs or speeches

**Location:** `src/app/api/ai/tribute-summary`

### 4. **AI Eulogy Assistant** ✅
- **Generates draft eulogies** based on:
  - Biography information
  - Shared memories
  - Personal notes
- **Structured output** (opening, body, closing)
- **Delivery tips** included
- **Downloadable** as text file
- Powered by GPT-4o for thoughtful, compassionate writing

**Location:** `src/app/api/ai/eulogy`

### 5. **AI Photo Description** ✅
- **GPT-4 Vision** analyzes photos
- **Generates descriptions** for accessibility
- Helps organize and catalog photos
- Future: Photo enhancement suggestions

**Location:** `src/lib/ai/openai.ts` - `describeMemoryPhoto()`

## 📊 Admin Dashboard Features

### **Memory Moderation Panel**
- View all submitted memories
- One-click AI analysis
- Approve/unapprove content
- See AI sentiment scores
- Filter by approval status

**Route:** `/admin/memories`

### **AI Insights Dashboard**
- Generate tribute summaries
- Create eulogy drafts
- View key themes
- Export content

**Route:** `/admin/ai-insights`

### **Analytics Dashboard**
- Track page views
- Monitor RSVP submissions
- Count memory posts
- Track shares

**Route:** `/admin/analytics`

### **RSVP Management**
- View all RSVPs
- See attendance breakdown
- Export guest lists
- View dietary requirements

**Route:** `/admin/rsvps`

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This will install the new `openai` package.

### 2. Environment Variables

Add to your `.env.local`:

```env
# Required for AI features
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx

# Existing variables
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### 3. Database Schema Updates

Run the updated schema in your Supabase SQL editor:

```bash
# The schema now includes:
- ai_sentiment column in memory_posts
- ai_moderation_score column
- analytics_events table
- photo_gallery table
- admin_users table
```

The updated schema is in `supabase/schema.sql`.

### 4. OpenAI API Key

1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an API key
3. Add billing (pay-as-you-go)
4. Add key to `.env.local`

**Cost Estimation:**
- Moderation: ~$0.0002 per memory
- Chatbot: ~$0.001 per conversation
- Tribute summary: ~$0.02 per generation
- Eulogy: ~$0.05 per generation

## 📱 User-Facing Features

### AI Chatbot
The chatbot appears as a floating button in the bottom-right corner:
- Click to open
- Ask questions about the service
- Get instant, AI-powered answers
- See suggested follow-up questions

### Auto-Moderated Memories
- Users submit memories as before
- AI automatically approves safe content
- Flagged content goes to admin review
- Faster approval = better experience

## 🔧 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/ai/moderate` | POST | Moderate memory content |
| `/api/ai/chatbot` | POST | Answer service questions |
| `/api/ai/tribute-summary` | POST | Generate tribute summary |
| `/api/ai/eulogy` | POST | Generate eulogy draft |
| `/api/analytics` | POST/GET | Track/retrieve analytics |

## 🎨 Customization

### Chatbot Prompts
Edit system prompts in `src/lib/ai/openai.ts`:
- `answerServiceQuestion()` - Chatbot personality
- `generateEulogyDraft()` - Eulogy style
- `generateTributeSummary()` - Summary tone

### Moderation Sensitivity
Adjust auto-approval logic in:
- `src/lib/ai/openai.ts` - `moderateMemory()`
- Change `suggestedApproval` criteria

### UI Customization
- Chatbot: `src/components/ui/ai-chatbot.tsx`
- Admin panels: `src/app/admin/**/page.tsx`

## 🚀 Future AI Enhancements

**Planned features:**
1. ✅ AI voice agent integration (ElevenLabs)
2. 🔄 Automated slideshow generation from photos
3. 🔄 AI translation for international attendees
4. 🔄 Memory book PDF generation with AI layout
5. 🔄 Voice message transcription
6. 🔄 Photo restoration and enhancement
7. 🔄 Video tribute compilation
8. 🔄 Sentiment timeline visualization

## 📊 Performance Tips

### Optimize API Calls
- Cache tribute summaries (regenerate only when new memories added)
- Rate limit chatbot to prevent abuse
- Use GPT-4o-mini for fast responses
- Use GPT-4o for quality content generation

### Database Indexes
Already included in schema:
- `idx_memory_posts_approved` - Fast approved memory queries
- `idx_analytics_event_type` - Fast analytics aggregation

## 🔒 Security Considerations

### API Key Protection
- Never expose `OPENAI_API_KEY` client-side
- All AI calls happen in server components/API routes
- Environment variables properly configured

### Content Moderation
- AI moderation is first line of defense
- Admin review available for all content
- Flagged content never auto-approved

### Admin Access
- Protected by Supabase Auth
- Role-based access ready (extend as needed)
- Audit logs via analytics_events table

## 🆘 Troubleshooting

### "OpenAI API Error"
- Check API key is valid
- Ensure billing is enabled
- Check rate limits

### "Moderation not working"
- Verify `OPENAI_API_KEY` in `.env.local`
- Check server logs for errors
- Ensure OpenAI account has credits

### "Chatbot not responding"
- Check memorial data is loading
- Verify API route is accessible
- Check browser console for errors

## 📚 Resources

- [OpenAI API Docs](https://platform.openai.com/docs)
- [OpenAI Moderation Guide](https://platform.openai.com/docs/guides/moderation)
- [GPT-4 Vision](https://platform.openai.com/docs/guides/vision)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

## ✨ Summary

Your memorial site now features:
- 🤖 **5 AI-powered features**
- 📊 **Complete admin dashboard**
- 💬 **Intelligent chatbot**
- 📝 **Auto-moderation**
- 📈 **Analytics tracking**
- 👥 **RSVP management**
- ✍️ **Eulogy generation**
- 📄 **Tribute summaries**

This transforms your memorial from a static website into an **intelligent, compassionate platform** that truly honors and celebrates life.
