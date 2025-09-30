# 🚀 Dhreeti Jain - Portfolio Development Environment

A responsive, modern portfolio website built with pure PERN stack (PostgreSQL, Express.js, React, Node.js) featuring a stunning dark theme with smooth animations.

## ⚡ Quick Start (Just Double-Click!)

### 🎯 Super Easy Start
- **Double-click `quick-start.bat`** - Starts everything and opens your browser automatically!

### 🔧 Detailed Start  
- **Double-click `dev-start.bat`** - Shows detailed output while starting servers

## 🌐 Your Portfolio URLs
- **Frontend**: http://localhost:5175 (or 5173/5174)
- **Backend API**: http://localhost:5000/api

## ✨ Features

- **Dark Theme**: Beautiful black gradient with purple/blue accents and glassmorphism
- **Smooth Animations**: Fade-ins, hover effects, particle backgrounds
- **Fully Responsive**: Mobile-first design with clamp() typography
- **Pure PERN**: No Prisma, no Tailwind - just raw PostgreSQL and custom CSS
- **Auto Port Detection**: Finds available ports automatically

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Framer Motion** - Smooth animations and transitions
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Hook Form** - Form handling and validation

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Prisma** - Database ORM
- **JWT** - Authentication
- **Nodemailer** - Email functionality
- **Multer** - File upload handling
- **Helmet** - Security middleware

### DevOps & Tools
- **Vite** - Fast build tool
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Docker** - Containerization

## 📁 Project Structure

```
portfolio-dev/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   ├── utils/         # Utility functions
│   │   ├── styles/        # CSS and theme files
│   │   └── assets/        # Images, icons, etc.
│   ├── package.json
│   └── vite.config.js
├── server/                # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   ├── config/           # Configuration files
│   ├── uploads/          # File uploads
│   ├── package.json
│   └── index.js
├── database/             # Database files
│   ├── migrations/
│   ├── seeds/
│   └── schema.sql
├── docs/                 # Documentation
├── docker-compose.yml    # Docker configuration
├── .env.example         # Environment variables template
├── README.md
└── package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd portfolio-dev
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up the database**
   ```bash
   cd server
   npx prisma migrate dev
   npx prisma db seed
   ```

5. **Start the development servers**
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📊 Performance Targets

- **Lighthouse Score**: >90
- **First Contentful Paint**: <1.5s
- **Largest Contentful Paint**: <2.5s
- **Cumulative Layout Shift**: <0.1
- **Mobile Responsiveness**: 100%

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/portfolio_dev"

# Server
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Client URL
CLIENT_URL=http://localhost:5173

# Analytics
GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
```

## 🚀 Deployment

### Using Docker

```bash
docker-compose up -d
```

### Manual Deployment

1. Build the client
   ```bash
   cd client && npm run build
   ```

2. Deploy to your preferred hosting platform:
   - **Frontend**: Netlify, Vercel, AWS S3
   - **Backend**: Heroku, Railway, DigitalOcean
   - **Database**: ElephantSQL, AWS RDS, Supabase

## 🎨 Customization

### Themes
Edit `client/src/styles/theme.js` to customize colors, fonts, and spacing.

### Content
Update the content in:
- `server/database/seeds/` - Initial data
- `client/src/data/` - Static content

### Animations
Modify animations in `client/src/components/` using Framer Motion.

## 📈 SEO Optimization

- Meta tags configuration
- Open Graph tags
- Structured data (JSON-LD)
- Sitemap generation
- Robots.txt

## 🧪 Testing

```bash
# Run frontend tests
cd client && npm test

# Run backend tests
cd server && npm test

# Run e2e tests
npm run test:e2e
```

## 📱 Browser Support

- Chrome: Latest 2 versions
- Firefox: Latest 2 versions  
- Safari: Latest 2 versions
- Edge: Latest 2 versions
- Mobile: iOS Safari, Chrome Mobile

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Design inspiration from modern developer portfolios
- Animation patterns from Framer Motion community
- Performance optimizations following web.dev guidelines

## 📞 Support

For support or questions, please contact:
- Email: your-email@domain.com
- LinkedIn: [Your LinkedIn Profile]
- GitHub: [Your GitHub Profile]

---

# Dhreeti Jain - Portfolio Website

## Quick Setup Instructions

### Backend Setup

1. **Install Dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Database Setup**
   ```bash
   # Create database
   createdb portfolio_dev
   
   # Run schema
   psql -d portfolio_dev -f database/schema.sql
   
   # Seed with your data
   node database/seed.js
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd ../client
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

## Default Admin Login
- Email: dhreetijain04@gmail.com
- Password: admin123

## Technology Stack
- **Frontend**: React.js with regular CSS (no Tailwind)
- **Backend**: Node.js, Express.js 
- **Database**: PostgreSQL with raw SQL queries (no Prisma)
- **Authentication**: JWT

Built with ❤️ using pure PERN stack