# 🌱 ZeroWasteLink 2.0

> **A Production-Ready Food Redistribution Platform for India**

## 🚀 Overview

ZeroWasteLink 2.0 is a comprehensive, production-ready food redistribution platform designed specifically for India. It connects food donors (restaurants, hotels, events) with NGOs and volunteers to reduce food waste and feed those in need.

### 🎯 Key Features

- **🔐 Multi-Role Authentication** - Admin, Donor, NGO, and Volunteer dashboards
- **🗺️ Real-Time Mapping** - Leaflet.js integration with OpenStreetMap (no API keys required)
- **🤖 AI-Powered Analytics** - Spoilage detection, impact analysis, and route optimization
- **💬 Real-Time Chat** - Integrated communication system for coordination
- **📱 PWA Ready** - Progressive Web App with offline capabilities
- **🇮🇳 India-Localized** - Phone numbers, Aadhaar integration, and Indian address formats
- **🎨 Modern UI/UX** - Beautiful, responsive design with Tailwind CSS and ShadCN UI
- **📊 Comprehensive Analytics** - Admin dashboard with detailed insights and reporting

## 📱 Screenshots

### 🏠 Landing Page
<img width="1920" height="1080" alt="Screenshot (135)" src="https://github.com/user-attachments/assets/b1fcd2f7-31ca-4377-a90c-10469f60ba73" />

<img width="1899" height="865" alt="Screenshot 2025-07-10 192405" src="https://github.com/user-attachments/assets/3a29a565-7a9b-42a6-bcbc-6f1fe7985b8a" />

<img width="1920" height="1080" alt="Screenshot (129)" src="https://github.com/user-attachments/assets/0c6ec035-12ec-445d-9a7e-a36432a90880" />

<img width="1920" height="1080" alt="Screenshot (141)" src="https://github.com/user-attachments/assets/4c3ea183-f605-443c-af9f-dc735d488984" />

<img width="1920" height="1080" alt="Screenshot (133)" src="https://github.com/user-attachments/assets/0d4adc39-fa49-42ec-a19b-dba2709ff8b5" />



## 🛠️ Technology Stack

### Frontend
- **Next.js 13.5.1** - React framework with App Router
- **React 18.2.0** - UI library
- **TypeScript 5.2.2** - Type safety
- **Tailwind CSS 3.3.0** - Styling
- **ShadCN UI** - Component library
- **Leaflet.js** - Interactive maps (no API keys required)
- **React Hook Form** - Form management
- **Zustand** - State management
- **NextAuth.js** - Authentication

### Backend
- **Node.js 20.11.0** - Runtime environment
- **Express.js 4.18.2** - Web framework
- **MongoDB 7.0** - Database
- **Mongoose 7.6.3** - ODM
- **Socket.IO** - Real-time communication
- **JWT** - Token-based authentication
- **bcryptjs** - Password hashing
- **Multer** - File uploads
- **Cloudinary** - Image storage

### AI & Analytics
- **OpenAI GPT-4** - AI-powered features
- **DeepSeek API** - Alternative AI provider
- **Chart.js** - Data visualization
- **Recharts** - React charting library

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0.0 or higher
- MongoDB 6.0.0 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ZeroWasteLink_2.0.git
   cd ZeroWasteLink_2.0
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/zerowaste-link
   
   # Authentication
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key
   
   # AI Services
   OPENAI_API_KEY=your-openai-key
   DEEPSEEK_API_KEY=your-deepseek-key
   
   # Image Storage
   CLOUDINARY_CLOUD_NAME=your-cloudinary-name
   CLOUDINARY_API_KEY=your-cloudinary-key
   CLOUDINARY_API_SECRET=your-cloudinary-secret
   
   # JWT
   JWT_SECRET=your-jwt-secret
   
   # Email (Optional)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

4. **Start MongoDB**
   ```bash
   # Using MongoDB service
   sudo systemctl start mongod
   
   # Or using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

5. **Create dummy users for testing**
   ```bash
   cd server
   node create-dummy-users.js
   ```

6. **Start the development servers**
   ```bash
   npm run dev
   ```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🔐 Test Credentials

### 👨‍💼 Admin
- **Email**: admin@zerowaste.com
- **Password**: admin123

### 🏢 Donors
- **Email**: donor1@zerowaste.com
- **Password**: donor123
- **Email**: donor2@zerowaste.com
- **Password**: donor123

### 🏛️ NGOs
- **Email**: ngo1@zerowaste.com
- **Password**: ngo123
- **Email**: ngo2@zerowaste.com
- **Password**: ngo123

### 🚚 Volunteers
- **Email**: volunteer1@zerowaste.com
- **Password**: volunteer123
- **Email**: volunteer2@zerowaste.com
- **Password**: volunteer123

## 📁 Project Structure

```
ZeroWasteLink_2.0/
├── app/                          # Next.js App Router
│   ├── admin/                    # Admin dashboard
│   ├── api/                      # API routes
│   ├── auth/                     # Authentication pages
│   ├── dashboard/                # Donor dashboard
│   ├── donate/                   # Donation forms
│   ├── ngo/                      # NGO dashboard
│   ├── volunteer/                # Volunteer dashboard
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── components/                   # React components
│   ├── ui/                       # ShadCN UI components
│   ├── ai-analytics.tsx          # AI-powered analytics
│   ├── chat-interface.tsx        # Real-time chat
│   ├── map-interface.tsx         # Leaflet.js maps
│   └── ...                       # Other components
├── hooks/                        # Custom React hooks
├── lib/                          # Utility functions
├── public/                       # Static assets
├── server/                       # Backend server
│   ├── middleware/               # Express middleware
│   ├── models/                   # MongoDB models
│   ├── routes/                   # API routes
│   ├── create-dummy-users.js     # Test data script
│   └── index.js                  # Server entry point
├── docs/                         # Documentation
├── .env                          # Environment variables
├── package.json                  # Dependencies
└── README.md                     # This file
```

## 🔧 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Donations Endpoints
- `GET /api/donations` - Get all donations
- `POST /api/donations` - Create new donation
- `PUT /api/donations/:id` - Update donation
- `DELETE /api/donations/:id` - Delete donation

### AI Endpoints
- `POST /api/ai/detect-spoilage` - Analyze food spoilage
- `POST /api/ai/impact` - Calculate impact metrics
- `POST /api/ai/optimize-route` - Route optimization

### Admin Endpoints
- `GET /api/admin/users` - Get all users
- `GET /api/admin/analytics` - Get platform analytics
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user

## 🌟 Features in Detail

### 🔐 Authentication System
- **Multi-role support** (Admin, Donor, NGO, Volunteer)
- **NextAuth.js integration** with custom providers
- **JWT token management** with refresh tokens
- **Role-based access control** (RBAC)
- **Indian phone number validation**
- **Aadhaar number integration**

### 🗺️ Interactive Maps
- **Leaflet.js integration** with OpenStreetMap
- **No API keys required** - completely free
- **Real-time location tracking**
- **Custom markers** for different roles
- **Route optimization** and navigation
- **Geolocation services**

### 🤖 AI-Powered Features
- **Spoilage detection** using computer vision
- **Impact analysis** and predictions
- **Route optimization** for efficient pickups
- **Demand forecasting** for better planning
- **Automated matching** between donors and NGOs

### 💬 Real-Time Communication
- **Socket.IO integration** for instant messaging
- **Multi-role chat support**
- **File sharing** and image attachments
- **Notification system**
- **Offline message handling**

### 📊 Analytics Dashboard
- **Comprehensive metrics** and KPIs
- **Data visualization** with charts and graphs
- **Real-time monitoring** of platform activity
- **Export capabilities** for reports
- **Customizable date ranges**

## 🔒 Security Features

- **Password hashing** with bcrypt
- **JWT token authentication**
- **Input validation** and sanitization
- **Rate limiting** on API endpoints
- **CORS configuration**
- **Environment variable protection**
- **SQL injection prevention**
- **XSS protection**

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start
```

### Docker Deployment
```bash
# Build the Docker image
docker build -t zerowaste-link .

# Run the container
docker run -p 3000:3000 -p 5000:5000 zerowaste-link
```

### Vercel Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel --prod
```

## 📈 Performance Optimizations

- **Next.js App Router** for better performance
- **Image optimization** with Next.js Image component
- **Code splitting** and lazy loading
- **Server-side rendering** (SSR)
- **Static generation** for better SEO
- **CDN integration** for assets
- **Database indexing** for faster queries

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development servers
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

### Code Quality
- **ESLint** configuration for code quality
- **Prettier** for code formatting
- **TypeScript** for type safety
- **Husky** for Git hooks
- **Conventional commits** for better Git history

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenStreetMap** for free mapping data
- **ShadCN UI** for beautiful components
- **Tailwind CSS** for utility-first styling
- **Next.js** team for the amazing framework
- **MongoDB** for flexible database solutions

## 📞 Support

For support, email support@zerowaste.com or join our Slack channel.

## 🔗 Links

- **Website**: https://zerowaste-link.vercel.app
- **Documentation**: https://docs.zerowaste-link.com
- **API Documentation**: https://api.zerowaste-link.com/docs
- **GitHub**: https://github.com/yourusername/ZeroWasteLink_2.0

---

<div align="center">
  <p><strong>Made with ❤️ for a better world</strong></p>
  <p>Reducing food waste • Feeding the hungry • Building community</p>
</div>
