import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Spin, Progress, Statistic } from 'antd';
import { Column, Pie, Area, DualAxes, Radar } from '@ant-design/plots';
import { AlertCircle, Users, Briefcase, GraduationCap } from 'lucide-react';

const EmployeeDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    departmentData: [],
    positionData: [],
    monthlyHires: [],
    employmentTypeData: [],
    genderData: [],
    ageGroups: [],
    educationStats: [],
    experienceData: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('https://employee-api-gold.vercel.app/employees/search?field=all&value=');
      const employees = await response.json();

      // Process department distribution
      const deptCount = {};
      employees.forEach(emp => {
        deptCount[emp.department_name] = (deptCount[emp.department_name] || 0) + 1;
      });

      // Process positions
      const posCount = {};
      employees.forEach(emp => {
        posCount[emp.position_name] = (posCount[emp.position_name] || 0) + 1;
      });

      // Process employment types
      const empTypeCount = {};
      employees.forEach(emp => {
        empTypeCount[emp.employment_type_name] = (empTypeCount[emp.employment_type_name] || 0) + 1;
      });

      // Process monthly hires with cumulative total
      const hiresByMonth = {};
      let cumulative = 0;
      employees
        .sort((a, b) => new Date(a.employment_date) - new Date(b.employment_date))
        .forEach(emp => {
          const date = new Date(emp.employment_date);
          const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          hiresByMonth[monthYear] = (hiresByMonth[monthYear] || 0) + 1;
          cumulative += 1;
        });

      // Process gender distribution
      const genderCount = {};
      employees.forEach(emp => {
        genderCount[emp.gender] = (genderCount[emp.gender] || 0) + 1;
      });

      // Process age groups
      const ageGroups = {};
      employees.forEach(emp => {
        const age = new Date().getFullYear() - new Date(emp.dob).getFullYear();
        const group = Math.floor(age / 5) * 5;
        ageGroups[`${group}-${group + 4}`] = (ageGroups[`${group}-${group + 4}`] || 0) + 1;
      });

      // Process education stats
      const eduStats = {};
      employees.forEach(emp => {
        if (emp.degree) {
          eduStats[emp.degree] = (eduStats[emp.degree] || 0) + 1;
        }
      });

      // Process experience data
      const expData = employees.map(emp => ({
        department: emp.department_name,
        experience: emp.experience?.years_of_experience || 0,
        count: 1
      }));

      setDashboardData({
        departmentData: Object.entries(deptCount).map(([name, value]) => ({ name, value })),
        positionData: Object.entries(posCount).map(([name, value]) => ({ name, value })),
        monthlyHires: Object.entries(hiresByMonth).map(([month, count]) => ({
          month,
          new: count,
          cumulative: cumulative
        })),
        employmentTypeData: Object.entries(empTypeCount).map(([name, value]) => ({ name, value })),
        genderData: Object.entries(genderCount).map(([name, value]) => ({ name, value })),
        ageGroups: Object.entries(ageGroups).map(([range, value]) => ({ range, value })),
        educationStats: Object.entries(eduStats).map(([degree, count]) => ({ degree, count })),
        experienceData: expData
      });

      setLoading(false);
    } catch (err) {
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        <AlertCircle className="mr-2" />
        <span>{error}</span>
      </div>
    );
  }

  // Department Visualization - 3D Column Chart
  const departmentConfig = {
    data: dashboardData.departmentData,
    xField: 'name',
    yField: 'value',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.8,
      },
    },
    columnStyle: {
      radius: [20, 20, 0, 0],
    },
    theme: 'dark',
    columnWidthRatio: 0.8,
    color: ({ name }) => {
      const colors = {
        'HR': '#FF6B6B',
        'IT': '#4ECDC4',
        'Finance': '#45B7D1',
        'Marketing': '#96CEB4'
      };
      return colors[name] || '#FFE66D';
    }
  };

  // Position Distribution - Donut Chart
  const positionPieConfig = {
    data: dashboardData.positionData,
    angleField: 'value',
    colorField: 'name',
    radius: 0.8,
    innerRadius: 0.6,
    label: {
      type: 'outer',
      content: '{name}: {percentage}',
    },
    statistic: {
      title: {
        style: {
          fontSize: '16px',
        },
        content: 'Positions',
      },
    },
    interactions: [{ type: 'element-active' }],
    color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFE66D']
  };

  // Monthly Hiring Trends - Area Chart with Dual Axes
  const hiresConfig = {
    data: [dashboardData.monthlyHires, dashboardData.monthlyHires],
    xField: 'month',
    yField: ['new', 'cumulative'],
    geometryOptions: [
      {
        geometry: 'column',
        color: '#FF6B6B',
      },
      {
        geometry: 'line',
        lineStyle: {
          lineWidth: 2,
          stroke: '#45B7D1',
        },
      },
    ],
  };

  // Gender Distribution - Progress Circle
  const genderData = dashboardData.genderData;
  const totalEmployees = genderData.reduce((sum, { value }) => sum + value, 0);
  const malePercentage = (genderData.find(g => g.name.toLowerCase() === 'male')?.value || 0) / totalEmployees * 100;

  // Experience by Department - Radar Chart
  const radarConfig = {
    data: dashboardData.experienceData,
    xField: 'department',
    yField: 'experience',
    seriesField: 'department',
    meta: {
      experience: {
        alias: 'Years of Experience',
        min: 0,
        max: 20,
      },
    },
    xAxis: {
      line: null,
      tickLine: null,
    },
    yAxis: {
      label: false,
      grid: {
        alternateColor: 'rgba(0, 0, 0, 0.04)',
      },
    },
    point: {
      size: 2,
    },
    area: {
      smooth: true,
    },
  };

  return (
    <div className="p-6 bg-gray-50">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Employee Analytics Dashboard</h1>
        <p className="text-gray-600">Comprehensive overview of workforce demographics and distribution</p>
      </div>
      
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center">
            <Statistic 
              title="Total Employees"
              value={totalEmployees}
              prefix={<Users className="inline-block mr-2" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center">
            <Statistic 
              title="Departments"
              value={dashboardData.departmentData.length}
              prefix={<Briefcase className="inline-block mr-2" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center">
            <Statistic 
              title="Positions"
              value={dashboardData.positionData.length}
              prefix={<GraduationCap className="inline-block mr-2" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center">
            <Progress 
              type="circle" 
              percent={Math.round(malePercentage)} 
              format={percent => `${percent}% Male`}
              strokeColor="#45B7D1"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={12}>
          <Card 
            title="Department Distribution" 
            className="h-full shadow-md hover:shadow-lg transition-shadow"
            bordered={false}
          >
            <Column {...departmentConfig} />
          </Card>
        </Col>
        
        <Col xs={24} xl={12}>
          <Card 
            title="Position Distribution" 
            className="h-full shadow-md hover:shadow-lg transition-shadow"
            bordered={false}
          >
            <Pie {...positionPieConfig} />
          </Card>
        </Col>
        
        <Col xs={24} xl={12}>
          <Card 
            title="Monthly Hiring Trends" 
            className="h-full shadow-md hover:shadow-lg transition-shadow"
            bordered={false}
          >
            <DualAxes {...hiresConfig} />
          </Card>
        </Col>
        
        <Col xs={24} xl={12}>
          <Card 
            title="Experience Distribution by Department" 
            className="h-full shadow-md hover:shadow-lg transition-shadow"
            bordered={false}
          >
            <Radar {...radarConfig} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EmployeeDashboard;