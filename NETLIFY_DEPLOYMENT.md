# Netlify Deployment Guide

## ✅ Code Status
- **Committed:** All AI features and enhancements
- **Pushed:** Successfully pushed to `main` branch on GitHub
- **Repository:** https://github.com/brettfulmer/Reg_Fulmer_Memorial.git

## 🚀 Netlify Setup Steps

### 1. Connect Repository to Netlify

1. Go to [app.netlify.com](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Choose "GitHub" and authorize Netlify
4. Select repository: `brettfulmer/Reg_Fulmer_Memorial`
5. Use these build settings:

```
Build command: npm run build
Publish directory: .next
```

### 2. Configure Environment Variables

In Netlify Dashboard → Site settings → Environment variables, add:

#### Required Variables:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# OpenAI (for AI features)
OPENAI_API_KEY=your_openai_api_key_here
```

#### Optional Variables (for future features):
```bash
# ElevenLabs (voice agent)
ELEVENLABS_API_KEY=your_elevenlabs_key_here

# Resend (email notifications)
RESEND_API_KEY=your_resend_key_here

# Twilio (SMS notifications)
TWILIO_ACCOUNT_SID=your_twilio_sid_here
TWILIO_AUTH_TOKEN=your_twilio_token_here
TWILIO_PHONE_NUMBER=your_twilio_number_here
```

### 3. Get Your API Keys

#### Supabase:
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project (or create new one)
3. Go to Project Settings → API
4. Copy `Project URL` → Use as `NEXT_PUBLIC_SUPABASE_URL`
5. Copy `anon public` key → Use as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Run the `supabase/schema.sql` in Supabase SQL Editor

#### OpenAI:
1. Go to [platform.openai.com](https://platform.openai.com)
2. Navigate to API keys section
3. Create new secret key
4. Copy and use as `OPENAI_API_KEY`
5. Add billing method (pay-as-you-go)

### 4. Deploy

After adding environment variables:
1. Click "Deploy site" in Netlify
2. Wait for build to complete (~2-3 minutes)
3. Your site will be live at `your-site-name.netlify.app`

### 5. Custom Domain (Optional)

1. In Netlify: Domain settings → Add custom domain
2. Add `memorial.regfulmer.au`
3. Follow DNS configuration instructions
4. Enable HTTPS (automatic via Let's Encrypt)

## 🧪 Testing Checklist

After deployment, verify:

- [ ] **Home page loads** - Redirects to `/m/reg-fulmer`
- [ ] **Memorial page displays** - All sections visible
- [ ] **RSVP form works** - Can submit responses
- [ ] **Memories section** - Can post memories (requires login)
- [ ] **AI Chatbot** - Floating button appears, can ask questions
- [ ] **Admin dashboard** - Accessible at `/admin` (requires Supabase auth)
- [ ] **Database connection** - Check Supabase logs for connections
- [ ] **API routes** - Check `/api/ai/chatbot` responds

## 📊 Cost Estimates

### OpenAI API:
- Chatbot: ~$0.001 per query (GPT-4o-mini)
- Moderation: ~$0.0001 per check
- **Estimated monthly cost:** $5-20 (depending on traffic)

### Netlify:
- **Free tier:** 100GB bandwidth, 300 build minutes
- **Likely cost:** $0 (well within free tier)

### Supabase:
- **Free tier:** 500MB database, 2GB bandwidth
- **Likely cost:** $0 (within free tier)

## 🎯 Next Steps After Deployment

1. **Test all features** using the checklist above
2. **Add admin user** - Create account, add to `admin_users` table in Supabase
3. **Test AI chatbot** - Ask service-related questions
4. **Submit test memory** - Verify moderation workflow
5. **Check analytics** - View dashboard at `/admin/analytics`
6. **Share link** - Send memorial page to family

## 🔧 Troubleshooting

### Build fails:
- Check environment variables are set correctly
- Verify Node.js version compatibility (18.x or higher)
- Check build logs in Netlify dashboard

### AI features not working:
- Verify `OPENAI_API_KEY` is set
- Check OpenAI billing is active
- Review API usage limits

### Database errors:
- Confirm Supabase credentials are correct
- Verify `schema.sql` was executed successfully
- Check RLS policies are enabled

### Chatbot not responding:
- Check browser console for errors
- Verify `/api/ai/chatbot` endpoint works
- Confirm OpenAI API key has sufficient credits

## 📝 Important Notes

1. **OpenAI Billing:** Ensure billing is set up on OpenAI account before deployment
2. **Supabase Schema:** Run `supabase/schema.sql` in SQL Editor BEFORE first use
3. **Admin Access:** You'll need to manually add yourself to `admin_users` table
4. **Environment Variables:** Never commit `.env.local` - use Netlify UI only

## 🎉 You're Ready!

Your memorial site with full AI capabilities is ready to deploy to Netlify. The codebase includes:

✅ AI-powered chatbot for service Q&A
✅ Automatic content moderation
✅ Admin dashboard with insights
✅ Analytics tracking
✅ Memory management
✅ RSVP system
✅ Livestream support
✅ Complete documentation

**Deployment time:** ~5 minutes (excluding API key setup)
