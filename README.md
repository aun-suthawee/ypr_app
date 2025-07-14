# YPR Dashboard - ระบบจัดการยุทธศาสตร์

A modern, responsive dashboard for strategic planning and project management built with Next.js, TailwindCSS, and Shadcn UI.

## ✨ Features

- **📊 Strategic Issues Management** - จัดการประเด็นยุทธศาสตร์ขององค์กร
- **🎯 Strategy Tracking** - ติดตามกลยุทธ์และแผนงาน
- **📁 Project Management** - จัดการโครงการและความก้าวหน้า
- **👥 User Management** - จัดการผู้ใช้งานในระบบ
- **📱 Responsive Design** - ใช้งานได้ทุกอุปกรณ์
- **🎨 Modern UI** - ออกแบบด้วย Clean และ Minimal aesthetic

## 🚀 Technology Stack

- **Frontend**: Next.js 15.3.5
- **Styling**: TailwindCSS 4.1.11
- **UI Components**: Shadcn UI
- **Icons**: Lucide React
- **Font**: Geist Sans
- **Language**: TypeScript

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ypr_app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
src/
├── app/
│   ├── dashboard/
│   │   ├── page.tsx              # Dashboard homepage
│   │   ├── strategic-issues/
│   │   │   └── page.tsx         # Strategic issues page
│   │   ├── strategies/
│   │   │   └── page.tsx         # Strategies page
│   │   ├── projects/
│   │   │   └── page.tsx         # Projects page
│   │   └── users/
│   │       └── page.tsx         # Users page
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Homepage (redirects to dashboard)
│   └── globals.css              # Global styles
├── components/
│   ├── ui/                      # Shadcn UI components
│   ├── dashboard-layout.tsx     # Dashboard layout wrapper
│   ├── dashboard-index.tsx      # Dashboard homepage content
│   ├── footer.tsx               # Footer component
│   ├── ui-utils.tsx            # Utility components
│   └── ui-components.tsx        # Custom UI components
└── lib/
    ├── utils.ts                 # Utility functions
    └── mock-data.ts             # Mock data for development
```

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (#3B82F6 to #8B5CF6)
- **Background**: Soft muted blue/white (#FAFBFC)
- **Text**: Slate colors for hierarchy
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)

### Typography
- **Primary Font**: Geist Sans
- **Weights**: Regular (400), Medium (500), Semibold (600), Bold (700)

### Components
- **Rounded corners**: 0.5rem default
- **Shadows**: Soft shadows with blur effects
- **Hover states**: Smooth transitions (300ms)
- **Glass morphism**: Backdrop blur effects

## 📊 Data Structure

### Strategic Issues (ประเด็นยุทธศาสตร์)
```typescript
interface StrategicIssue {
  id: string;
  name: string;
  description: string;
  strategies: Strategy[];
}
```

### Strategies (กลยุทธ์)
```typescript
interface Strategy {
  id: string;
  name: string;
  description: string;
  projects: Project[];
}
```

### Projects (โครงการ)
```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'planning';
  strategy: string;
  startDate: string;
  endDate: string;
  progress: number;
}
```

## 🔧 Development

### Adding New Components
1. Create component in `src/components/`
2. Use Shadcn UI components when possible:
```bash
npx shadcn@latest add [component-name]
```

### Styling Guidelines
- Use TailwindCSS classes
- Follow the established color palette
- Maintain responsive design principles
- Use consistent spacing (4, 6, 8, 12 units)

### Mock Data
All data is currently mocked in `src/lib/mock-data.ts`. In a real application, this would be replaced with API calls to a backend service.

## 📱 Responsive Design

- **Mobile**: Full-width layout with collapsible sidebar
- **Tablet**: Balanced layout with side navigation
- **Desktop**: Full sidebar with main content area

## 🎯 Future Enhancements

- [ ] Real-time data updates
- [ ] Advanced filtering and search
- [ ] Export functionality
- [ ] Email notifications
- [ ] Multi-language support
- [ ] Dark mode support
- [ ] API integration
- [ ] User authentication
- [ ] Role-based permissions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support, email support@ypr-dashboard.com or create an issue in the GitHub repository.

---

Built with ❤️ using Next.js and TailwindCSS
