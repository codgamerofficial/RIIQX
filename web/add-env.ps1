$env1 = "rzp_live_S5jyvUSX4Bzp2o"
$env2 = "lCGAh302DXTDoze5S0M05o41"

Write-Host "Adding NEXT_PUBLIC_RAZORPAY_KEY_ID..."
$env1 | npx vercel env add NEXT_PUBLIC_RAZORPAY_KEY_ID production --yes

Write-Host "Adding RAZORPAY_KEY_SECRET..."
$env2 | npx vercel env add RAZORPAY_KEY_SECRET production --yes

Write-Host "Environment variables added successfully!"
