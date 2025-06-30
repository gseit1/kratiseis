# ReserveEasy - Vue.js Frontend

A modern, responsive Vue.js frontend application for the ReserveEasy online restaurant reservation system.

## 🚀 Features

- **Modern UI/UX**: Beautiful, responsive design with Bootstrap 5
- **Authentication**: User registration and login with role-based access
- **Restaurant Discovery**: Browse and search restaurants with advanced filters
- **Reservation System**: Book tables with real-time availability
- **User Dashboard**: Manage reservations and profile
- **Shop Owner Dashboard**: Manage restaurants and bookings
- **Admin Panel**: System administration
- **Real-time Updates**: Socket.IO integration for live updates
- **Progressive Enhancement**: Works on all devices

## 🛠️ Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **Vue Router 4** - Official router for Vue.js
- **Pinia** - State management
- **Bootstrap 5** - CSS framework
- **Bootstrap Icons** - Icon library
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time communication
- **Vite** - Build tool
- **SCSS** - CSS preprocessor

## 📦 Installation

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 🔧 Configuration

The application is configured to proxy API requests to your backend server running on port 300. The proxy configuration is in `vite.config.js`:

```javascript
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:300',
      changeOrigin: true,
    },
    '/search': {
      target: 'http://localhost:300',
      changeOrigin: true,
    }
  }
}
```

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (#667eea to #764ba2)
- **Secondary**: Various accent colors
- **Success**: Green for positive actions
- **Warning**: Yellow for featured items
- **Danger**: Red for destructive actions

### Components
- **Cards**: Elevated with hover effects
- **Buttons**: Gradient and outline variants
- **Forms**: Floating labels with validation
- **Navigation**: Fixed navbar with user dropdown
- **Modals**: Rounded corners with backdrop blur

## 📁 Project Structure

```
src/
├── assets/
│   └── styles/
│       └── main.scss          # Global styles and variables
├── components/
│   ├── layout/
│   │   ├── NavBar.vue         # Main navigation
│   │   └── AppFooter.vue      # Footer component
│   ├── shops/
│   │   └── ShopCard.vue       # Restaurant card component
│   └── search/
│       └── SearchWidget.vue   # Search form component
├── router/
│   └── index.js               # Vue Router configuration
├── stores/
│   ├── auth.js                # Authentication store
│   ├── shop.js                # Shop/restaurant store
│   └── reservation.js         # Reservation store
├── views/
│   ├── auth/
│   │   ├── Login.vue          # Login page
│   │   └── Register.vue       # Registration page
│   ├── dashboard/
│   │   ├── UserDashboard.vue  # User dashboard
│   │   ├── ShopOwnerDashboard.vue
│   │   └── AdminDashboard.vue
│   ├── shops/
│   │   ├── ShopList.vue       # Restaurant listing
│   │   ├── ShopDetail.vue     # Restaurant details
│   │   ├── CreateShop.vue     # Create restaurant
│   │   └── ManageShop.vue     # Manage restaurant
│   └── ...
├── App.vue                    # Root component
└── main.js                    # Application entry point
```

## 🔐 Authentication

The application supports three user roles:

1. **User/Customer**: Browse restaurants and make reservations
2. **Shop Owner**: Manage restaurants and handle bookings
3. **Admin**: System administration and analytics

Role-based routing ensures users can only access appropriate pages.

## 🌐 API Integration

The frontend communicates with your backend API through:

- **Axios**: HTTP requests with automatic token handling
- **Pinia Stores**: Centralized state management for API data
- **Error Handling**: User-friendly error messages
- **Loading States**: Spinners and skeleton screens

### API Endpoints Used

- `POST /api/login` - User authentication
- `POST /api/signup` - User registration
- `GET /api/shop` - Fetch restaurants
- `POST /api/reservation/user` - Create reservation
- `GET /search/city/:cityId` - Search restaurants
- And many more...

## 📱 Responsive Design

The application is fully responsive with:

- **Mobile-first approach**
- **Bootstrap grid system**
- **Flexible layouts**
- **Touch-friendly interfaces**
- **Optimized images**

### Breakpoints
- **xs**: < 576px (Mobile)
- **sm**: ≥ 576px (Large mobile)
- **md**: ≥ 768px (Tablet)
- **lg**: ≥ 992px (Desktop)
- **xl**: ≥ 1200px (Large desktop)

## 🎭 Animations

Enhanced user experience with:

- **AOS (Animate On Scroll)**: Entrance animations
- **CSS Transitions**: Smooth hover effects
- **Loading States**: Skeleton screens and spinners
- **Page Transitions**: Smooth navigation

## 🚀 Performance

Optimized for performance:

- **Code Splitting**: Automatic route-based splitting
- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: Proper sizing and formats
- **Caching**: API response caching
- **Minimal Bundle Size**: Tree shaking and minification

## 🔍 SEO & Accessibility

- **Semantic HTML**: Proper markup structure
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: WCAG compliant colors
- **Focus Management**: Proper focus indicators

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Variables

Create a `.env` file for environment-specific configuration:

```env
VITE_API_BASE_URL=http://localhost:300
VITE_SOCKET_URL=http://localhost:300
```

## 🚀 Deployment

### Production Build

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Deployment Options

1. **Static Hosting**: Netlify, Vercel, GitHub Pages
2. **CDN**: AWS CloudFront, Cloudflare
3. **Traditional Hosting**: Upload `dist/` contents

### Nginx Configuration Example

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:300;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Happy coding! 🎉**
