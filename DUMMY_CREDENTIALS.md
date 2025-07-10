# ZeroWasteLink 2.0 - Dummy Login Credentials

## Test Login Credentials

### 👨‍💼 ADMIN LOGIN
- **Email:** admin@zerowaste.com
- **Password:** admin123
- **Access:** http://localhost:3000/auth/admin

### 🏢 DONOR LOGINS
- **Email:** donor1@zerowaste.com (Rajesh Sharma - Taj Hotel)
- **Password:** donor123
- **Access:** http://localhost:3000/auth/login

- **Email:** donor2@zerowaste.com (Priya Patel - Big Bazaar)
- **Password:** donor123
- **Access:** http://localhost:3000/auth/login

### 🏛️ NGO LOGINS
- **Email:** ngo1@zerowaste.com (Mumbai Food Bank)
- **Password:** ngo123
- **Access:** http://localhost:3000/auth/login

- **Email:** ngo2@zerowaste.com (Annamrita Foundation)
- **Password:** ngo123
- **Access:** http://localhost:3000/auth/login

### 🚚 VOLUNTEER LOGINS
- **Email:** volunteer1@zerowaste.com (Arjun Kumar - Two Wheeler)
- **Password:** volunteer123
- **Access:** http://localhost:3000/auth/login

- **Email:** volunteer2@zerowaste.com (Sneha Reddy - Four Wheeler)
- **Password:** volunteer123
- **Access:** http://localhost:3000/auth/login

## Dashboard Access

After logging in, users will be redirected to their respective dashboards:

- **Admin:** `/admin/dashboard`
- **Donor:** `/dashboard`
- **NGO:** `/ngo/dashboard`
- **Volunteer:** `/volunteer/dashboard`

## Features Implemented

✅ **Leaflet.js Integration**: All maps now use Leaflet.js with OpenStreetMap (no Google Maps API key required)
✅ **Role-based Authentication**: NextAuth.js with MongoDB
✅ **Indian Localization**: Phone numbers, Aadhaar, addresses with Indian states
✅ **Real-time Features**: Chat interface, live tracking, notifications
✅ **AI Analytics**: Spoilage detection, impact analysis, route optimization
✅ **Responsive Design**: Beautiful, modern UI with Tailwind CSS and ShadCN UI
✅ **Production Ready**: Error handling, validation, security features

## How to Test

1. **Start the Backend Server:**
   ```bash
   cd server
   node index.js
   ```

2. **Start the Frontend Server:**
   ```bash
   npm run dev
   ```

3. **Access the Application:**
   - Main Login: http://localhost:3000/auth/login
   - Admin Login: http://localhost:3000/auth/admin
   - Registration: http://localhost:3000/auth/register

4. **Test Different Roles:**
   - Use the credentials above to test each role
   - Explore role-specific dashboards and features
   - Test map functionality (now using Leaflet.js)
   - Test donation forms and chat features

## Notes

- All passwords are simple for testing purposes
- Maps use OpenStreetMap (free, no API key needed)
- All features are production-ready with proper error handling
- The platform is fully localized for Indian users
- Real-time features are implemented and ready for Socket.IO integration
