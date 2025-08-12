# CRM Platform

A full-stack Customer Relationship Management (CRM) and Marketing Automation platform built with React, Node.js, Express, and PostgreSQL.

## Features

### Core CRM Features
- **Authentication & Authorization**: JWT-based auth with role-based access control (Admin, Sales, Marketing, Support)
- **Lead Management**: Complete CRUD operations with status tracking, assignment, and scoring
- **Contact Management**: Comprehensive contact database with company associations
- **Company Management**: Organization profiles with detailed information
- **Opportunity Pipeline**: Deal tracking with stages, values, and forecasting
- **Task Management**: Assignment and tracking of follow-up activities
- **Activity Logging**: Automatic logging of all interactions and changes

### Marketing Automation
- **Email Campaigns**: Create, schedule, and track marketing campaigns
- **Contact Segmentation**: Filter and target specific audience segments
- **Campaign Analytics**: Track opens, clicks, and conversions

### Dashboard & Reporting
- **Sales Pipeline Visualization**: Interactive charts and metrics
- **Performance Metrics**: Conversion rates, revenue forecasting, task management
- **Real-time Updates**: WebSocket-powered notifications

### Technical Features
- **Real-time Notifications**: WebSocket integration for live updates
- **Multi-tenancy Support**: Organization-level data isolation
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **RESTful API**: Well-structured backend with proper error handling
- **Database Relations**: Comprehensive PostgreSQL schema with foreign keys

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Redux Toolkit** for state management
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Axios** for API communication
- **React Router** for navigation
- **Socket.IO Client** for real-time updates

### Backend
- **Node.js** with Express.js
- **PostgreSQL** with Sequelize ORM
- **JWT** for authentication
- **Socket.IO** for WebSocket support
- **Joi** for input validation
- **bcrypt** for password hashing
- **CORS, Helmet** for security

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- Docker & Docker Compose (optional)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd crm-platform
```

2. **Install dependencies**
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

3. **Environment Setup**
```bash
# Copy environment file
cp backend/.env.example backend/.env

# Edit the .env file with your database credentials
```

4. **Database Setup**
```bash
# Create PostgreSQL database
createdb crm_db

# Run migrations (if you have migration files)
cd backend
npm run migrate
```

5. **Start the application**
```bash
# Start both frontend and backend
npm run dev

# Or start them separately
npm run dev:frontend  # Runs on http://localhost:5173
npm run dev:backend   # Runs on http://localhost:5000
```

### Using Docker Compose (Recommended)

1. **Start all services**
```bash
docker-compose up -d
```

This will start:
- PostgreSQL database on port 5432
- Backend API on port 5000
- Frontend will be available on port 5173

2. **Stop services**
```bash
docker-compose down
```

## API Documentation

The backend provides a RESTful API with the following main endpoints:

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login

### Leads
- `GET /api/v1/leads` - Get leads with pagination and filters
- `POST /api/v1/leads` - Create new lead
- `GET /api/v1/leads/:id` - Get lead details
- `PUT /api/v1/leads/:id` - Update lead
- `DELETE /api/v1/leads/:id` - Delete lead

### Contacts
- `GET /api/v1/contacts` - Get contacts
- `POST /api/v1/contacts` - Create contact
- `PUT /api/v1/contacts/:id` - Update contact
- `DELETE /api/v1/contacts/:id` - Delete contact

### Companies
- `GET /api/v1/companies` - Get companies
- `POST /api/v1/companies` - Create company
- `PUT /api/v1/companies/:id` - Update company
- `DELETE /api/v1/companies/:id` - Delete company

### Opportunities
- `GET /api/v1/opportunities` - Get opportunities
- `POST /api/v1/opportunities` - Create opportunity
- `PUT /api/v1/opportunities/:id` - Update opportunity
- `DELETE /api/v1/opportunities/:id` - Delete opportunity

### Dashboard
- `GET /api/v1/dashboard/metrics` - Get dashboard metrics and analytics

## Database Schema

The application uses a PostgreSQL database with the following main tables:

- **Users**: Authentication and user management
- **Contacts**: Individual contact records
- **Leads**: Sales leads with status tracking
- **Companies**: Organization information
- **Opportunities**: Deal pipeline management
- **Tasks**: Follow-up activities and assignments
- **Activities**: Activity logging and history
- **Campaigns**: Marketing campaign management

## Project Structure

```
crm-platform/
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── config/         # Database and app configuration
│   │   ├── models/         # Sequelize models
│   │   ├── routes/         # API route handlers
│   │   ├── middleware/     # Authentication and error handling
│   │   ├── validations/    # Input validation schemas
│   │   └── server.js       # Express server setup
│   ├── package.json
│   └── Dockerfile
├── src/                    # React frontend
│   ├── components/         # Reusable UI components
│   ├── pages/              # Page components
│   ├── store/              # Redux store and slices
│   ├── services/           # API service layer
│   └── App.tsx             # Main app component
├── docker-compose.yml      # Docker services configuration
├── package.json           # Frontend dependencies
└── README.md
```

## Key Features in Detail

### Role-Based Access Control
Users can have different roles (Admin, Sales, Marketing, Support) with appropriate permissions for each module.

### Lead Scoring and Pipeline Management
- Automatic lead scoring based on interactions
- Visual pipeline with drag-and-drop functionality
- Stage-based probability and forecasting

### Marketing Automation
- Segmentation based on custom criteria
- Email campaign scheduling and tracking
- Analytics dashboard for campaign performance

### Real-time Updates
- WebSocket integration for live notifications
- Real-time pipeline updates
- Activity feed with live updates

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Optimized for all device sizes
- Touch-friendly interface elements

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the GitHub repository.