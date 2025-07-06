# 🦷 Dental Clinic Management System

A comprehensive dental clinic management system with AI-powered features, multi-clinic support, and family management capabilities.

## 🚀 Features

### 👥 **Multi-Role Support**
- **Patients**: Family management, appointment booking, AI photo analysis
- **Doctors**: Patient management, clinical notes, task templates
- **Secretaries**: Appointment approval, scheduling, patient communication
- **Admins**: User management, system configuration, analytics
- **Moderators**: Treatment plan creation, task template management

### 🔐 **Authentication & Security**
- Role-based access control
- JWT token authentication
- Session persistence
- Route protection

### 🎨 **Medical Trust Design**
- Professional healthcare interface
- Responsive mobile-first design
- Accessibility compliant (WCAG 2.1 AA)
- Medical-appropriate color palette

### 🤖 **AI Integration Ready**
- Photo analysis for oral health
- Chat assistance
- Treatment plan generation
- Task automation

## 🛠️ **Technology Stack**

- **Frontend**: Vue.js 3 + Composition API
- **Styling**: Tailwind CSS
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL
- **AI**: OpenAI/DeepSeek API integration

## 📦 **Installation**

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Git

### Setup
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/denta-mind.git

# Navigate to project directory
cd denta-mind

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure your environment variables in .env
# VUE_APP_API_URL=http://localhost:8000

# Start development server
npm run serve