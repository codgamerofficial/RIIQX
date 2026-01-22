# Add Supabase environment variables to Vercel
# Run this script to add missing Supabase credentials

Write-Host "Adding Supabase environment variables to Vercel..." -ForegroundColor Green

# Add NEXT_PUBLIC_SUPABASE_URL
Write-Host "`nAdding NEXT_PUBLIC_SUPABASE_URL..." -ForegroundColor Yellow
echo "https://xxkywqwrybctmcviebcd.supabase.co" | npx vercel env add NEXT_PUBLIC_SUPABASE_URL production

# Add NEXT_PUBLIC_SUPABASE_ANON_KEY  
Write-Host "`nAdding NEXT_PUBLIC_SUPABASE_ANON_KEY..." -ForegroundColor Yellow
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4a3l3cXdyeWJjdG1jdmllYmNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MTkxNTQsImV4cCI6MjA4MzE5NTE1NH0.Yko1p9Uzr61nld8wtYTuFeNb82AgaP1tqtB40SEwzn0" | npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

Write-Host "`nEnvironment variables added successfully!" -ForegroundColor Green
Write-Host "Triggering production deployment..." -ForegroundColor Yellow

npx vercel deploy --prod

Write-Host "`nDeployment triggered!" -ForegroundColor Green
