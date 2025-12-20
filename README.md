# Aine Learning Aid

A web application designed to support Ugandan Competency-Based Assessment (CBA) curriculum through AI-powered learning assistance. The system provides personalized learning experiences aligned with NCDC guidelines, featuring content generation, Q&A support, and optional visual aids.

## Features

- **Personalized Learning**: AI-generated content tailored to Ugandan CBA competencies
- **Interactive Assessments**: Quizzes, practical exercises, and essay evaluations
- **Progress Tracking**: Monitor student advancement through lessons and assessments
- **AI Assistance**: Real-time Q&A and content generation using Groq API
- **Responsive Design**: Optimized for low-bandwidth environments and mobile devices
- **Accessibility**: Support for screen readers and keyboard navigation

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Vite for build tooling
- Mobile-first responsive design

### Backend
- Node.js with Express
- SQLite database
- JWT authentication
- Groq AI SDK for content generation

### AI Integration
- Groq API for fast inference
- Prompt engineering for CBA alignment
- Response caching for performance

## Project Structure

```
aine-learning-aid/
├── frontend/                 # React/TypeScript app
│   ├── public/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API service functions
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Utility functions
│   │   ├── styles/          # Tailwind CSS styles
│   │   └── App.tsx
│   ├── package.json
│   └── tailwind.config.js
├── backend/                  # Node.js/Express server
│   ├── src/
│   │   ├── routes/          # API route handlers
│   │   ├── models/          # Database models
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Express middleware
│   │   ├── config/          # Configuration files
│   │   └── app.js
│   ├── database/            # SQLite files and migrations
│   ├── package.json
│   └── server.js
├── shared/                   # Shared types/interfaces
│   ├── types/
│   └── constants/
├── docs/                     # Documentation
├── tests/                    # Test files
├── docker/                   # Docker configurations
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd aine-learning-aid
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Environment Configuration**

   Copy the example environment files and update with your values:

   **Backend (.env)**
   ```env
   PORT=5000
   DATABASE_PATH=./database/aine.db
   JWT_SECRET=your-secret-key-change-this
   GROQ_API_KEY=your-groq-api-key
   ```

   **Frontend (.env)**
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

5. **Database Setup**
   ```bash
   cd backend
   # The database will be initialized automatically on first run
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## API Documentation

The backend provides RESTful APIs for:
- User authentication and management
- Lesson content management
- Assessment handling
- AI-powered content generation

See the [API documentation](./docs/api.md) for detailed endpoints.

## Development

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting

### Testing
```bash
# Run tests
npm test
```

### Building for Production
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm run start
```

## Deployment

The application can be deployed using:
- Docker containers
- Cloud platforms (Heroku, Vercel, etc.)
- Traditional web servers

See [deployment guide](./docs/deployment.md) for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

ISC License

## Acknowledgments

- Built for the Ugandan education system
- Powered by Groq AI for content generation
- Designed with accessibility and performance in mind