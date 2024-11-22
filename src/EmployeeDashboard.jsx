import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Spin } from 'antd';
import { Column, Pie, Line } from '@ant-design/plots';
import { AlertCircle } from 'lucide-react';

const EmployeeDashboard = () => {
  const [departmentData, setDepartmentData] = useState([]);
  const [positionData, setPositionData] = useState([]);
  const [monthlyHires, setMonthlyHires] = useState([]);
  const [employmentTypeData, setEmploymentTypeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('https://employee-api-gold.vercel.app/employees/search?field=all&value=');
      const employees = await response.json();

      const deptCount = {};
      employees.forEach(emp => {
        deptCount[emp.department_name] = (deptCount[emp.department_name] || 0) + 1;
      });
      setDepartmentData(Object.entries(deptCount).map(([name, value]) => ({ name, value })));

      const posCount = {};
      employees.forEach(emp => {
        posCount[emp.position_name] = (posCount[emp.position_name] || 0) + 1;
      });
      setPositionData(Object.entries(posCount).map(([name, value]) => ({ name, value })));

      const empTypeCount = {};
      employees.forEach(emp => {
        empTypeCount[emp.employment_type_name] = (empTypeCount[emp.employment_type_name] || 0) + 1;
      });
      setEmploymentTypeData(Object.entries(empTypeCount).map(([name, value]) => ({ name, value })));

      const hiresByMonth = {};
      employees.forEach(emp => {
        const date = new Date(emp.employment_date);
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        hiresByMonth[monthYear] = (hiresByMonth[monthYear] || 0) + 1;
      });
      
      const sortedMonths = Object.entries(hiresByMonth)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, count]) => ({
          month,
          employees: count
        }));
      
      setMonthlyHires(sortedMonths);
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

  const departmentConfig = {
    data: departmentData,
    xField: 'name',
    yField: 'value',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    meta: {
      name: {
        alias: 'Department',
      },
      value: {
        alias: 'Employees',
      },
    },
  };

  const positionPieConfig = {
    data: positionData,
    angleField: 'value',
    colorField: 'name',
    radius: 0.8,
    label: {
      type: 'outer',
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };

  const hiresConfig = {
    data: monthlyHires,
    xField: 'month',
    yField: 'employees',
    point: {
      size: 5,
      shape: 'diamond',
    },
  };

  const employmentTypePieConfig = {
    data: employmentTypeData,
    angleField: 'value',
    colorField: 'name',
    radius: 0.8,
    label: {
      type: 'outer',
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Employee Dashboard</h1>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} xl={12}>
          <Card title="Employees by Department" className="h-full">
            <Column {...departmentConfig} />
          </Card>
        </Col>
        
        <Col xs={24} xl={12}>
          <Card title="Position Distribution" className="h-full">
            <Pie {...positionPieConfig} />
          </Card>
        </Col>
        
        <Col xs={24} xl={12}>
          <Card title="Monthly Hiring Trends" className="h-full">
            <Line {...hiresConfig} />
          </Card>
        </Col>
        
        <Col xs={24} xl={12}>
          <Card title="Employment Type Distribution" className="h-full">
            <Pie {...employmentTypePieConfig} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EmployeeDashboard;