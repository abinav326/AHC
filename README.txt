ANASWARA HEALTH CLUB WEBSITE

1. Install Node.js 18+.
2. Open a terminal in this folder.
3. Run: npm install
4. Change the admin password:
   Linux/macOS: ADMIN_PASSWORD="your-strong-password" npm start
   Windows PowerShell: $env:ADMIN_PASSWORD="your-strong-password"; npm start
5. Open http://localhost:3000
6. Owner dashboard: http://localhost:3000/admin.html

The owner can:
- Upload multiple equipment photos.
- Add equipment name and description.
- Upload activity/event photos with date and description.
- Delete old equipment and activities.
- Public website updates immediately.

Important:
- The uploads/ folder and data.json must be kept when moving the site.
- This version stores photos on the server. For Vercel/serverless hosting, use cloud storage such as Cloudinary, Supabase Storage or an S3-compatible service instead.
- Replace the placeholder phone/WhatsApp number and membership prices before launch.
