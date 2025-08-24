# Launchr

🚀 A powerful CLI tool to scaffold modern frontend and backend projects with the latest tools and best practices.

🔗 **GitHub Repository**: [pradeep-kalyan/launchr](https://github.com/pradeep-kalyan/launchr)

## Features

- ⚛️ **Frontend Frameworks**: React, Next.js, Vue.js, Angular with TypeScript support
- 🎨 **Styling**: Tailwind CSS v4 integration
- 🌐 **Backend Frameworks**: Express.js, Hapi.js, Koa with TypeScript support
- 🗄️ **Databases**: MongoDB, PostgreSQL, MySQL, SQLite
- 🔗 **ORMs**: Prisma, Sequelize, TypeORM
- 🛠️ **Developer Tools**: Pre-configured with essential packages
- ⚙️ **Environment Files**: Auto-generated `.env` files with common variables
- 📦 **Package Management**: Ready-to-use npm configurations

## Installation

```bash
npm install -g launchr
```

## Usage

Run the CLI tool in your desired directory:

```bash
mps
```

Or using npx:

```bash
npx launchr
```

## Project Types

### Frontend Only

Choose from various modern frontend frameworks:

- React + Tailwind CSS
- React + TypeScript + Tailwind CSS
- Next.js + Tailwind CSS
- Next.js + TypeScript + Tailwind CSS
- Vue.js + Tailwind CSS
- Angular + Tailwind CSS

### Backend Only

Set up robust backend services:

- Node.js
- Express.js (JavaScript/TypeScript)
- Hapi.js (JavaScript/TypeScript)
- Koa.js (JavaScript/TypeScript)

### Fullstack

Combine frontend and backend in a single project setup.

## Frontend Tools Available

- **UI Libraries**: shadcn/ui, Material-UI
- **Icons**: Lucide Icons, React Icons
- **State Management**: Redux Toolkit, Zustand
- **Data Validation**: Zod
- **HTTP Client**: Axios
- **Animations**: Framer Motion

## Backend Tools Available

- **Authentication**: bcrypt, JWT, JOSE
- **Security**: Helmet, CORS
- **Validation**: Zod
- **Email**: Nodemailer
- **Caching**: Redis
- **Environment**: dotenv
- **Development**: Nodemon

## Environment Files

The tool automatically creates `.env` files for both frontend and backend with commonly used environment variables:

### Frontend `.env`

- API URLs
- App configuration
- Third-party API keys (client-safe)

### Backend `.env`

- Server configuration
- Database URLs
- JWT secrets
- Email configuration
- Third-party API keys

## Directory Structure

After running the tool, your project will have the following structure:

```
your-project/
├── frontend/          # Frontend application
│   ├── .env          # Frontend environment variables
│   ├── package.json  # Frontend dependencies
│   └── ...           # Framework-specific files
├── backend/           # Backend application
│   ├── .env          # Backend environment variables
│   ├── package.json  # Backend dependencies
│   ├── server.js/ts  # Main server file
│   └── ...           # Additional backend files
└── README.md         # This file
```

## Getting Started

1. Navigate to your project directory
2. Run `mps` and follow the interactive prompts
3. Install dependencies in both directories:
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```
4. Configure your `.env` files with actual values
5. Start development:

   ```bash
   # Frontend
   cd frontend && npm run dev

   # Backend (in another terminal)
   cd backend && npm run dev
   ```

## Requirements

- Node.js 16+
- npm 7+

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC License
