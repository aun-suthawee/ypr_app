// Mock data for the dashboard
import { ProjectStatus } from "./project-utils";

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  strategy: string;
  startDate: string;
  endDate: string;
  progress: number;
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  projects: Project[];
}

export interface StrategicIssue {
  id: string;
  name: string;
  description: string;
  strategies: Strategy[];
}

export const mockStrategicIssues: StrategicIssue[] = [
  {
    id: '1',
    name: 'การพัฒนาเศรษฐกิจดิจิทัล',
    description: 'ส่งเสริมการใช้เทคโนโลยีดิจิทัลในภาคธุรกิจและการบริการ',
    strategies: [
      {
        id: '1-1',
        name: 'การส่งเสริมการใช้เทคโนโลยี AI',
        description: 'พัฒนาระบบปัญญาประดิษฐ์เพื่อเพิ่มประสิทธิภาพการทำงาน',
        projects: [
          {
            id: '1-1-1',
            name: 'ระบบ AI สำหรับบริการลูกค้า',
            description: 'พัฒนาระบบ Chatbot สำหรับตอบคำถามลูกค้า',
            status: 'active',
            strategy: 'การส่งเสริมการใช้เทคโนโลยี AI',
            startDate: '2024-01-15',
            endDate: '2024-12-31',
            progress: 65
          },
          {
            id: '1-1-2',
            name: 'ระบบวิเคราะห์ข้อมูลด้วย ML',
            description: 'พัฒนาระบบวิเคราะห์ข้อมูลเชิงลึกด้วย Machine Learning',
            status: 'planning',
            strategy: 'การส่งเสริมการใช้เทคโนโลยี AI',
            startDate: '2024-06-01',
            endDate: '2025-03-31',
            progress: 15
          }
        ]
      },
      {
        id: '1-2',
        name: 'การพัฒนาโครงสร้างพื้นฐานดิจิทัล',
        description: 'ปรับปรุงโครงสร้างพื้นฐานด้าน IT และเครือข่าย',
        projects: [
          {
            id: '1-2-1',
            name: 'อัปเกรดระบบเครือข่าย',
            description: 'อัปเกรดระบบเครือข่ายองค์กรสู่ 5G',
            status: 'active',
            strategy: 'การพัฒนาโครงสร้างพื้นฐานดิจิทัล',
            startDate: '2024-03-01',
            endDate: '2024-09-30',
            progress: 80
          }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'การพัฒนาทรัพยากรมนุษย์',
    description: 'เพิ่มศักยภาพและทักษะของบุคลากรในองค์กร',
    strategies: [
      {
        id: '2-1',
        name: 'การฝึกอบรมด้านดิจิทัล',
        description: 'จัดอบรมพนักงานด้านทักษะดิจิทัล',
        projects: [
          {
            id: '2-1-1',
            name: 'หลักสูตรการใช้งาน AI',
            description: 'จัดอบรมพนักงานการใช้งาน AI ในการทำงาน',
            status: 'completed',
            strategy: 'การฝึกอบรมด้านดิจิทัล',
            startDate: '2024-01-01',
            endDate: '2024-03-31',
            progress: 100
          },
          {
            id: '2-1-2',
            name: 'หลักสูตรการวิเคราะห์ข้อมูล',
            description: 'อบรมการวิเคราะห์ข้อมูลด้วย Excel และ Power BI',
            status: 'active',
            strategy: 'การฝึกอบรมด้านดิจิทัล',
            startDate: '2024-04-01',
            endDate: '2024-08-31',
            progress: 45
          }
        ]
      }
    ]
  },
  {
    id: '3',
    name: 'การส่งเสริมความยั่งยืน',
    description: 'ส่งเสริมการดำเนินงานที่เป็นมิตรกับสิ่งแวดล้อม',
    strategies: [
      {
        id: '3-1',
        name: 'การลดการใช้กระดาษ',
        description: 'ส่งเสริมการใช้เอกสารดิจิทัลแทนกระดาษ',
        projects: [
          {
            id: '3-1-1',
            name: 'ระบบเอกสารดิจิทัล',
            description: 'พัฒนาระบบจัดการเอกสารดิจิทัล',
            status: 'active',
            strategy: 'การลดการใช้กระดาษ',
            startDate: '2024-02-01',
            endDate: '2024-10-31',
            progress: 55
          }
        ]
      }
    ]
  }
];

export const mockUsers = [
  {
    id: '1',
    name: 'นายสมชาย ใจดี',
    email: 'somchai@company.com',
    role: 'Project Manager',
    department: 'IT',
    avatar: 'SC'
  },
  {
    id: '2',
    name: 'นางสาวมาลี สวยงาม',
    email: 'malee@company.com',
    role: 'Developer',
    department: 'IT',
    avatar: 'ML'
  },
  {
    id: '3',
    name: 'นายวิชัย ขยันทำ',
    email: 'wichai@company.com',
    role: 'Business Analyst',
    department: 'Strategy',
    avatar: 'WC'
  }
];

// Helper function to get all projects
export const getAllProjects = (): Project[] => {
  const projects: Project[] = [];
  mockStrategicIssues.forEach(issue => {
    issue.strategies.forEach(strategy => {
      projects.push(...strategy.projects);
    });
  });
  return projects;
};

// Helper function to get recent projects
export const getRecentProjects = (limit: number = 5): Project[] => {
  return getAllProjects()
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    .slice(0, limit);
};

// Helper function to get projects by strategic issue
export const getProjectsByStrategicIssue = (strategicIssueId: string): Project[] => {
  const issue = mockStrategicIssues.find(i => i.id === strategicIssueId);
  if (!issue) return [];
  
  const projects: Project[] = [];
  issue.strategies.forEach(strategy => {
    projects.push(...strategy.projects);
  });
  return projects;
};
