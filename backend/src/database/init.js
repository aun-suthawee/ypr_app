/* eslint-disable */
const User = require('../models/User');
const StrategicIssue = require('../models/StrategicIssue');
const Strategy = require('../models/Strategy');
const Project = require('../models/Project');
const { pool } = require('../config/database');

const initDatabase = async () => {
  try {
    console.log('🔄 Initializing YPR Database...');

    // Create users table
    await User.createTable();

    // Check if admin user exists
    const adminExists = await User.findByEmail('admin@ypr.local');
    
    if (!adminExists) {
      console.log('👤 Creating default admin user...');
      
      const adminUser = await User.create({
        email: 'admin@ypr.local',
        password: 'admin123', // Change this in production!
        role: 'admin',
        title_prefix: 'ดร.',
        first_name: 'ผู้ดูแล',
        last_name: 'ระบบ',
        position: 'Administrator',
        department: 'IT Department'
      });

      console.log('✅ Admin user created:', adminUser.email);
    } else {
      console.log('👤 Admin user already exists');
    }

    // Check if demo department user exists
    const deptExists = await User.findByEmail('dept@ypr.local');
    
    if (!deptExists) {
      console.log('👥 Creating demo department user...');
      
      const deptUser = await User.create({
        email: 'dept@ypr.local',
        password: 'dept123', // Change this in production!
        role: 'department',
        title_prefix: 'นาย',
        first_name: 'สมชาย',
        last_name: 'ใจดี',
        position: 'หัวหน้าแผนก',
        department: 'แผนกยุทธศาสตร์'
      });

      console.log('✅ Department user created:', deptUser.email);
    } else {
      console.log('👥 Department user already exists');
    }

    // สร้างตาราง Strategic Issues
    await StrategicIssue.createTable();

    // สร้างตาราง Strategies
    await Strategy.createTable();

    // สร้างตาราง Projects
    await Project.createTable();

    // สร้างข้อมูลตัวอย่างประเด็นยุทธศาสตร์
    const [existingIssuesResult] = await pool.execute('SELECT COUNT(*) as count FROM strategic_issues');
    const issueCount = existingIssuesResult[0].count;
    
    if (issueCount === 0) {
      console.log('📋 Creating sample strategic issues...');

      // ดึงข้อมูล admin user เพื่อใช้เป็น created_by
      const adminUser = await User.findByEmail('admin@ypr.local');
      
      const sampleIssues = [
        {
          title: 'การพัฒนาทรัพยากรมนุษย์เพื่อความยั่งยืน',
          description: 'พัฒนาบุคลากรให้มีความรู้ ทักษะ และขีดความสามารถที่ทันสมัย สอดคล้องกับการเปลี่ยนแปลงของโลก เพื่อสร้างความสามารถในการแข่งขันและพัฒนาองค์กรอย่างยั่งยืน',
          start_year: 2024,
          end_year: 2028,
          status: 'active',
          created_by: adminUser.id
        },
        {
          title: 'การเสริมสร้างนวัตกรรมและเทคโนโลยีดิจิทัล',
          description: 'ส่งเสริมการใช้เทคโนโลยีดิจิทัลและนวัตกรรมในการดำเนินงาน เพื่อเพิ่มประสิทธิภาพและสร้างคุณค่าใหม่ให้กับผู้รับบริการและสังคม',
          start_year: 2025,
          end_year: 2030,
          status: 'active',
          created_by: adminUser.id
        },
        {
          title: 'การสร้างความร่วมมือเชิงยุทธศาสตร์',
          description: 'สร้างเครือข่ายความร่วมมือกับภาคส่วนต่างๆ ทั้งภาครัฐ เอกชน และสังคม เพื่อเสริมสร้างความแข็งแกร่งและขยายผลการดำเนินงาน',
          start_year: 2024,
          end_year: 2027,
          status: 'active',
          created_by: adminUser.id
        }
      ];

      for (const issueData of sampleIssues) {
        await StrategicIssue.create(issueData);
      }

      console.log('✅ Sample strategic issues created');
    } else {
      console.log('📋 Strategic issues already exist');
    }

    // สร้างข้อมูลตัวอย่างกลยุทธ์
    const [existingStrategiesResult] = await pool.execute('SELECT COUNT(*) as count FROM strategies');
    const strategyCount = existingStrategiesResult[0].count;
    
    if (strategyCount === 0) {
      console.log('🎯 Creating sample strategies...');

      // ดึงข้อมูล admin user เพื่อใช้เป็น created_by
      const adminUser = await User.findByEmail('admin@ypr.local');
      
      // ดึงประเด็นยุทธศาสตร์ที่มีอยู่
      const [issuesResult] = await pool.execute('SELECT id, title FROM strategic_issues LIMIT 3');
      
      if (issuesResult.length > 0 && adminUser) {
        const sampleStrategies = [
          {
            strategic_issue_id: issuesResult[0].id,
            name: 'โครงการพัฒนาทักษะดิจิทัลสำหรับบุคลากร',
            description: 'จัดอบรมเชิงปฏิบัติการเพื่อพัฒนาทักษะดิจิทัลของบุคลากร ให้สามารถใช้เทคโนโลยีใหม่ๆ ได้อย่างมีประสิทธิภาพ',
            created_by: adminUser.id
          },
          {
            strategic_issue_id: issuesResult[0].id,
            name: 'ระบบการเรียนรู้และพัฒนาอย่างต่อเนื่อง',
            description: 'พัฒนาแพลตฟอร์มการเรียนรู้ออนไลน์ เพื่อให้บุคลากรสามารถเรียนรู้และพัฒนาทักษะได้ตลอดเวลา',
            created_by: adminUser.id
          },
          {
            strategic_issue_id: issuesResult[1] ? issuesResult[1].id : issuesResult[0].id,
            name: 'ระบบการจัดการความรู้ดิจิทัล',
            description: 'สร้างระบบจัดเก็บและแบ่งปันความรู้ที่ทันสมัย เพื่อเพิ่มประสิทธิภาพในการทำงานและการตัดสินใจ',
            created_by: adminUser.id
          },
          {
            strategic_issue_id: issuesResult[2] ? issuesResult[2].id : issuesResult[0].id,
            name: 'เครือข่ายความร่วมมือเชิงนวัตกรรม',
            description: 'สร้างเครือข่ายความร่วมมือกับสถาบันการศึกษาและองค์กรต่างๆ เพื่อพัฒนานวัตกรรมร่วมกัน',
            created_by: adminUser.id
          }
        ];

        for (const strategyData of sampleStrategies) {
          await Strategy.create(strategyData);
        }

        console.log('✅ Sample strategies created');
      }
    } else {
      console.log('🎯 Strategies already exist');
    }

    console.log('\n📋 Default Users:');
    console.log('1. Admin: admin@ypr.local / admin123');
    console.log('2. Department: dept@ypr.local / dept123');
    console.log('\n⚠️  Please change default passwords in production!');
    console.log('✅ Database initialization completed successfully!');

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
};

// Run initialization
if (require.main === module) {
  initDatabase()
    .then(() => {
      console.log('🎉 Database setup completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Database setup failed:', error);
      process.exit(1);
    });
}

module.exports = { initDatabase };
