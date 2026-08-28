ANASWARA HEALTH CLUB - VERCEL STATIC WEBSITE

NO ADMIN PAGE. NO DATABASE. NO SERVER.

PHOTO FOLDERS
public/equipment/  -> put equipment photos here
public/activities/ -> put activity/event photos here
public/images/     -> logo and fixed images

HOW TO ADD PHOTOS
1. Put a photo in the appropriate folder.
2. Use useful filenames, e.g. treadmill.jpg, bench-press.jpg,
   independence-day.jpg.
3. Push to GitHub / redeploy Vercel.
4. The build script automatically scans the folders and the photos appear.

SUPPORTED: JPG, JPEG, PNG, WEBP, GIF, AVIF

VERCEL
The included vercel.json runs `npm run build` and publishes `public`.

IMPORTANT: Vercel deployments are immutable. A photo added to your local
folder AFTER a deployment will not magically appear on the already-live
site; commit/push it and redeploy. No admin page is needed.

EDIT public/index.html for phone/WhatsApp number and membership prices.
