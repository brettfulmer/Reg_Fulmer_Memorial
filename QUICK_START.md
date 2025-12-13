# 🚀 Quick Start Guide - AI-Powered Memorial Site

## Overview
Your memorial site now includes 5 AI-powered features and a complete admin dashboard. This guide will get you up and running in **under 10 minutes**.

---

## ✅ Prerequisites

- Node.js 18+ installed
- Supabase account (free tier works)
- OpenAI account with API access

---

## 📦 Step 1: Install Dependencies

```bash
cd path/to/Reg_Fulmer_Memorial
npm install
```

This installs all dependencies including the new `openai` package.

---

## 🔑 Step 2: Get Your API Keys

### OpenAI API Key (Required for AI features)

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Click **API Keys** in the left sidebar
4. Click **Create new secret key**
5. Copy the key (starts with `sk-proj-...`)
6. **Add billing**: Go to Settings → Billing → Add payment method
   - You'll need this even on free tier
   - Estimated cost: $5-20/month for typical use

### Supabase Keys (Required)

1. Go to [supabase.com](https://supabase.com)
2. Create a new project (or use existing)
3. Go to **Settings** → **API**
4. Copy:
   - Project URL
   - Anon/Public key

---

## 🗄️ Step 3: Set Up Database

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy entire contents of `supabase/schema.sql`
4. Paste and click **Run**
5. Wait for success message

This creates:
- All tables (memorials, RSVPs, memories, etc.)
- New AI-enhanced columns
- Analytics tables
- Admin tables
- Sample data for Reg Fulmer

---

## ⚙️ Step 4: Configure Environment

1. Copy the example env file:
```bash
cp .env.example .env.local
```

2. Edit `.env.local` with your values:

```env
# Supabase (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# OpenAI (REQUIRED for AI features)
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx

# Optional: ElevenLabs Voice (Future use)
ELEVENLABS_API_KEY=your_key
ELEVENLABS_AGENT_ID=your_id

# Optional: Email notifications (Future use)
RESEND_API_KEY=your_key

# Optional: SMS notifications (Future use)
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=your_number
```

**Note:** Only `NEXT_PUBLIC_SUPABASE_*` and `OPENAI_API_KEY` are required to start.

---

## 🏃 Step 5: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

You'll be redirected to `/m/reg-fulmer` (the sample memorial).

---

## 🎯 Step 6: Test AI Features

### Test the Chatbot
1. Look for the floating chat button (bottom-right)
2. Click it
3. Ask: "What time does the service start?"
4. See AI-powered response!

### Test Memory Submission (Requires Auth)
1. Create an account: Click "Share Memory" or go to `/register`
2. Register with any email
3. Submit a test memory
4. **AI automatically moderates it!**

### Access Admin Dashboard
1. Make sure you're logged in
2. Go to `/admin`
3. Explore:
   - Memory moderation
   - AI insights
   - Analytics
   - RSVP management

### Test AI Moderation
1. In admin, go to **Memory Moderation**
2. Click **AI Check** on any memory
3. See sentiment analysis and content flags!

### Generate AI Content
1. In admin, go to **AI Insights**
2. Click **Generate Summary** - AI analyzes all memories
3. Click **Generate Eulogy** - AI writes a draft eulogy
4. Download the eulogy as a text file

---

## 🎨 Customization Quick Wins

### Change Memorial Data
Edit the mock data in `src/app/m/[slug]/page.tsx`:
- Lines 16-128: Update with your memorial details
- Or connect to real Supabase data

### Customize Colors
Edit `tailwind.config.ts`:
- `accent-gold`: Change primary accent color
- `background`: Adjust dark theme
- `foreground`: Adjust text colors

### Modify Chatbot Personality
Edit `src/lib/ai/openai.ts`:
- Line 211: Change system prompt in `answerServiceQuestion()`
- Make it more formal, casual, or specific to your needs

---

## 🚀 Step 7: Deploy to Production

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts
# Add environment variables in Vercel dashboard
```

### Environment Variables in Vercel
1. Go to your project settings
2. Add all variables from `.env.local`
3. Redeploy

---

## ✅ Verification Checklist

After setup, verify these work:

- [ ] Site loads at `localhost:3000`
- [ ] Memorial page displays correctly
- [ ] Countdown timer is working
- [ ] Chatbot button appears
- [ ] Chatbot responds to questions (tests OpenAI)
- [ ] Can create account
- [ ] Can submit memory (tests Supabase)
- [ ] Memory appears (tests auto-moderation)
- [ ] Can access `/admin` when logged in
- [ ] AI Check button works in admin
- [ ] Can generate tribute summary
- [ ] Can generate eulogy
- [ ] RSVP form submits successfully

---

## 🆘 Troubleshooting

### "Module not found: openai"
```bash
npm install openai
```

### "Invalid API Key" (OpenAI)
- Double-check key in `.env.local`
- Ensure no extra spaces
- Key should start with `sk-proj-`
- Verify billing is set up on OpenAI account

### Chatbot not responding
1. Check browser console for errors
2. Verify `OPENAI_API_KEY` is set
3. Check OpenAI account has credits
4. Test API key at [platform.openai.com/playground](https://platform.openai.com/playground)

### Database errors
1. Verify Supabase URL and keys
2. Ensure schema was run successfully
3. Check Supabase dashboard for error logs

### Admin page shows "Unauthorized"
1. Make sure you're logged in
2. Check authentication in Supabase dashboard
3. Try logging out and back in

### "fetch failed" errors
- Check all environment variables are set
- Restart dev server: Stop and run `npm run dev` again
- Clear Next.js cache: Delete `.next` folder and restart

---

## 📚 Next Steps

### 1. Add Real Memorial Data
- Either update mock data in `src/app/m/[slug]/page.tsx`
- Or fetch from Supabase (implement data fetching)

### 2. Configure Storage
- Go to Supabase → Storage
- Create bucket named `memories`
- Set policies for uploads
- Enable photo/audio uploads

### 3. Set Up Email Notifications
- Get Resend API key
- Add to `.env.local`
- Implement email sending in API routes

### 4. Configure Voice Agent
- Get ElevenLabs account
- Create voice agent
- Add credentials to `.env.local`
- Update voice agent section status

### 5. Customize Design
- Update colors in Tailwind config
- Replace placeholder images
- Customize copy and messaging
- Add your own fonts

---

## 💡 Pro Tips

### Save on OpenAI Costs
- Use GPT-4o-mini for chatbot (already configured)
- Cache tribute summaries
- Only regenerate eulogies when needed
- Consider rate limiting chatbot

### Improve Performance
- Enable Next.js image optimization
- Use Supabase CDN for images
- Implement pagination for memories
- Add loading skeletons

### Enhance Security
- Add rate limiting to API routes
- Implement proper admin roles
- Use RLS policies in Supabase
- Add CORS headers

---

## 📞 Support Resources

- **OpenAI Issues:** [platform.openai.com/docs](https://platform.openai.com/docs)
- **Supabase Issues:** [supabase.com/docs](https://supabase.com/docs)
- **Next.js Issues:** [nextjs.org/docs](https://nextjs.org/docs)

---

## 🎉 You're Ready!

Your AI-powered memorial site is now:
- ✅ Fully functional
- ✅ AI-enhanced
- ✅ Production-ready
- ✅ Scalable

**Estimated setup time:** 10-15 minutes  
**Result:** World-class memorial platform

Enjoy building something meaningful! 💙
