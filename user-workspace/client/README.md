# Smart Monitoring Device Integration (SMDI) Admin Panel

A comprehensive admin panel for managing electrical systems, conducting energy audits, and monitoring system performance.

## Features

- **User Authentication & Authorization**
  - Role-based access control (Admin, Moderator, Staff)
  - Secure login system
  - Profile management

- **Electrical System Management**
  - Detailed lighting and power layout
  - Schedule of loads visualization
  - Real-time monitoring

- **Energy Audit Tools**
  - PEC 1 compliance assessment
  - Energy management standards evaluation
  - Automated audit reporting

- **System Analysis**
  - Performance monitoring
  - System health checks
  - Diagnostic tools

- **Technology Acceptance Model (TAM) Evaluation**
  - User acceptance assessment
  - Feedback collection
  - Performance metrics

## Tech Stack

- React 17.x
- TypeScript 4.x
- Material-UI 5.x
- Redux Toolkit
- React Router 6.x
- Formik & Yup
- Chart.js
- Axios

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/smdi-admin-panel.git
   cd smdi-admin-panel
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file in the root directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   REACT_APP_VERSION=1.0.0
   ```

4. Start the development server:
   ```bash
   npm start
   ```

## Project Structure

```
src/
├── components/       # Reusable UI components
├── contexts/        # React context providers
├── layouts/         # Page layout components
├── pages/          # Main application pages
├── store/          # Redux store configuration
├── theme/          # Material-UI theme customization
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Philippine Electrical Code 1 (2017 Edition)
- Energy Management Handbook (7th Edition)
- Material-UI Team
- React Development Community

## Contact

Your Name - your.email@example.com
Project Link: [https://github.com/your-username/smdi-admin-panel](https://github.com/your-username/smdi-admin-panel)
