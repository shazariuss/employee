import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Modal, Space, Card, Descriptions, Row, Col } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EmployeeSearch = () => {
  const SERVER_URL = 'https://employee-api-gold.vercel.app';
  const [allEmployees, setAllEmployees] = useState([]); 
  const [filteredEmployees, setFilteredEmployees] = useState([]); 
  const [filters, setFilters] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    position_name: '',
    department_name: '',
    city: '',
    employment_type_name: ''
  });
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${SERVER_URL}/employees/search?field=full_name&value=`);
        setAllEmployees(response.data);
        setFilteredEmployees(response.data);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const filterEmployees = () => {
      let results = allEmployees;
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          results = results.filter(employee => {
            const employeeValue = employee[key]?.toString().toLowerCase() || '';
            return employeeValue.includes(value.toLowerCase());
          });
        }
      });
      
      setFilteredEmployees(results);
    };

    filterEmployees();
  }, [filters, allEmployees]);

  const handleView = async (employeeId) => {
    try {
      const response = await axios.get(`${SERVER_URL}/employees/${employeeId}`);
      setSelectedEmployee(response.data);
      setViewModalVisible(true);
    } catch (error) {
      console.error('Error fetching employee details:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${SERVER_URL}/employees/${selectedEmployee.id}`);
      setDeleteModalVisible(false);
      setAllEmployees(allEmployees.filter(emp => emp.id !== selectedEmployee.id));
      setFilteredEmployees(filteredEmployees.filter(emp => emp.id !== selectedEmployee.id));
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleEdit = (employeeId) => {
    navigate(`/edit/${employeeId}`);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const columns = [
    {
      title: (
        <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
          <label htmlFor="full-name-input">ФИО:</label>
          <Input
            id="full-name-input"
            placeholder="Введите наименование"
            style={{ width: '100%' }}
            value={filters.full_name}
            onChange={(e) => handleFilterChange('full_name', e.target.value)}
          />
        </div>
      ),
      dataIndex: 'full_name',
      key: 'full_name',
    },
    {
      title: (
        <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
          <label htmlFor="email-input">Email:</label>
          <Input
            id="email-input"
            placeholder="Введите email"
            style={{ width: '100%' }}
            value={filters.email}
            onChange={(e) => handleFilterChange('email', e.target.value)}
          />
        </div>
      ),
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: (
        <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
          <label htmlFor="phone-input">Телефон:</label>
          <Input
            id="phone-input"
            placeholder="Введите телефон"
            style={{ width: '100%' }}
            value={filters.phone_number}
            onChange={(e) => handleFilterChange('phone_number', e.target.value)}
          />
        </div>
      ),
      dataIndex: 'phone_number',
      key: 'phone_number',
    },
    {
      title: (
        <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
          <label htmlFor="position-input">Должность:</label>
          <Input
            id="position-input"
            placeholder="Введите должность"
            style={{ width: '100%' }}
            value={filters.position_name}
            onChange={(e) => handleFilterChange('position_name', e.target.value)}
          />
        </div>
      ),
      dataIndex: 'position_name',
      key: 'position_name',
    },
    {
      title: (
        <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
          <label htmlFor="department-input">Отдел:</label>
          <Input
            id="department-input"
            placeholder="Введите отдел"
            style={{ width: '100%' }}
            value={filters.department_name}
            onChange={(e) => handleFilterChange('department_name', e.target.value)}
          />
        </div>
      ),
      dataIndex: 'department_name',
      key: 'department_name',
    },
    {
      title: (
        <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
          <label htmlFor="city-input">Город:</label>
          <Input
            id="city-input"
            placeholder="Введите город"
            style={{ width: '100%' }}
            value={filters.city}
            onChange={(e) => handleFilterChange('city', e.target.value)}
          />
        </div>
      ),
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: (
        <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
          <label htmlFor="employment-type-input">Тип занятости:</label>
          <Input
            id="employment-type-input"
            placeholder="Введите тип занятости"
            style={{ width: '100%' }}
            value={filters.employment_type_name}
            onChange={(e) => handleFilterChange('employment_type_name', e.target.value)}
          />
        </div>
      ),
      dataIndex: 'employment_type_name',
      key: 'employment_type_name',
    },
    {
      title: 'Действия',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleView(record.id)}
            type="primary"
            ghost
          />
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.id)}
            type="primary"
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => {
              setSelectedEmployee(record);
              setDeleteModalVisible(true);
            }}
            type="primary"
            danger
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card>
        <Table
          columns={columns}
          dataSource={filteredEmployees}
          rowKey="id"
          pagination={{ pageSize: 10, position:['bottomCenter'] }}
          scroll={{ x: 1300 }}
          className="mt-5"
          rowClassName="custom-row"
        />

        <Modal
          title="Информация о сотруднике"
          open={viewModalVisible}
          onCancel={() => setViewModalVisible(false)}
          footer={null}
          width={800}
        >
          {selectedEmployee && (
            <Descriptions column={1} bordered>
              <Descriptions.Item label="ФИО">
                {selectedEmployee.full_name}
              </Descriptions.Item>
              <Descriptions.Item label="Должность">
                {selectedEmployee.position_name}
              </Descriptions.Item>
              <Descriptions.Item label="Отдел">
                {selectedEmployee.department_name}
              </Descriptions.Item>
              <Descriptions.Item label="Тип занятости">
                {selectedEmployee.employment_type_name}
              </Descriptions.Item>
              <Descriptions.Item label="Дата рождения">
                {new Date(selectedEmployee.dob).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="Пол">
                {selectedEmployee.gender}
              </Descriptions.Item>
              <Descriptions.Item label="Национальность">
                {selectedEmployee.nationality}
              </Descriptions.Item>
              <Descriptions.Item label="Номер паспорта">
                {selectedEmployee.passport_number}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {selectedEmployee.email}
              </Descriptions.Item>
              <Descriptions.Item label="Телефон">
                {selectedEmployee.phone_number}
              </Descriptions.Item>
              <Descriptions.Item label="Адрес">
                {`${selectedEmployee.country}, ${selectedEmployee.city}, ${selectedEmployee.street_address}`}
              </Descriptions.Item>
              <Descriptions.Item label="Образование">
                {selectedEmployee.education?.university}, {selectedEmployee.education?.degree}, {selectedEmployee.education?.graduation_year}
              </Descriptions.Item>
              <Descriptions.Item label="Опыт работы">
                {selectedEmployee.experience?.company_name}, {selectedEmployee.experience?.job_title}, {selectedEmployee.experience?.years_of_experience} лет
              </Descriptions.Item>
              <Descriptions.Item label="Экстренный контакт">
                {selectedEmployee.emergency_contact?.contact_name}, {selectedEmployee.emergency_contact?.relationship}, {selectedEmployee.emergency_contact?.phone_number}
              </Descriptions.Item>
            </Descriptions>
          )}
        </Modal>

        <Modal
          title="Подтверждение удаления"
          open={deleteModalVisible}
          onOk={handleDelete}
          onCancel={() => setDeleteModalVisible(false)}
          okText="Удалить"
          cancelText="Отмена"
          okButtonProps={{ danger: true }}
        >
          <p>Вы уверены, что хотите удалить этого сотрудника? Это действие нельзя отменить.</p>
        </Modal>
      </Card>
    </div>
  );
};

export default EmployeeSearch;