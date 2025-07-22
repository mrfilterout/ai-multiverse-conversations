# Deployment Guide

## Prerequisites

- Node.js 18+ installed
- Vercel account
- API keys for all AI providers
- Supabase project

## Step 1: Prepare the Repository

1. Fork or clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Step 2: Set Up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to SQL Editor in your Supabase dashboard
3. Run the SQL commands from `supabase-schema.sql`
4. Copy your project URL and keys from Settings > API

## Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env.local`
2. Fill in all required values:
   - AI API keys (OpenAI, Anthropic, xAI, DeepSeek, Gemini)
   - Supabase credentials
   - Generate a random CRON_SECRET

## Step 4: Test Locally

```bash
npm run dev
```

Visit `http://localhost:3000` to ensure everything works.

## Step 5: Deploy to Vercel

### Option A: Deploy Button
Click the deploy button in the README and follow the prompts.

### Option B: Manual Deployment

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Add all environment variables from `.env.local`
5. Deploy!

## Step 6: Verify Cron Jobs

After deployment:
1. Go to your Vercel dashboard
2. Navigate to Functions tab
3. Check that `/api/cron` is listed
4. Cron jobs will run every 10 minutes

## Step 7: Monitor Usage

- Check Vercel Analytics for traffic
- Monitor Supabase dashboard for database usage
- Track API usage in each provider's dashboard

## Troubleshooting

### Cron jobs not running
- Ensure CRON_SECRET is set in Vercel environment variables
- Check Vercel Functions logs for errors

### API rate limits
- Reduce max_tokens in `ai-service.ts`
- Increase delay between messages
- Upgrade API plans if needed

### Database connection issues
- Verify Supabase credentials
- Check if database has reached row limits
- Ensure RLS is disabled for tables

## Cost Optimization

- Use GPT-3.5-turbo instead of GPT-4
- Limit conversation history to recent messages
- Implement caching for repeated queries
- Monitor and adjust cron frequency

## Security Considerations

- Never commit `.env.local` files
- Rotate API keys regularly
- Use environment variables for all secrets
- Enable Vercel deployment protection