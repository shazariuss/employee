import React, { useState } from 'react';
import { Table, Input, Button, Modal, Space, Card, Descriptions, Row, Col } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EmployeeSearch = () => {
  const SERVER_URL = 'https://employee-api-gold.vercel.app';
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/employees/search?query=${searchQuery}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

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
      setSearchResults(searchResults.filter(emp => emp.id !== selectedEmployee.id));
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleEdit = (employeeId) => {
    navigate(`/edit/${employeeId}`);
  };

  const columns = [
    {
      title: 'ФИО',
      dataIndex: 'full_name',
      key: 'full_name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Телефон',
      dataIndex: 'phone_number',
      key: 'phone_number',
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            icon={<EyeOutlined />} 
            onClick={() => handleView(record.id)}
            type="primary"
            ghost
          >
            Просмотр
          </Button>
          <Button 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.id)}
            type="primary"
          >
            Изменить
          </Button>
          <Button 
            icon={<DeleteOutlined />}
            onClick={() => {
              setSelectedEmployee(record);
              setDeleteModalVisible(true);
            }}
            type="primary" 
            danger
          >
            Удалить
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col xs={24} md={16}>
            <Input
              placeholder="Поиск по ФИО, паспорту, телефону, email или университету"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%' }}
              prefix={<SearchOutlined />}
              size="large"
            />
          </Col>
          <Col xs={24} md={8}>
            <Button type="primary" onClick={handleSearch} size="large" block>
              Поиск
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={searchResults}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 400 }} // Add horizontal scroll for smaller screens
        />

        {/* View Modal */}
        <Modal
          title="Информация о сотруднике"
          open={viewModalVisible}
          onCancel={() => setViewModalVisible(false)}
          footer={null}
          width={window.innerWidth < 768 ? '100%' : 800} // Responsive width
        >
          {selectedEmployee && (
            <Descriptions column={1} bordered>
              <Descriptions.Item label="ФИО">
                {selectedEmployee.full_name}
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

        {/* Delete Confirmation Modal */}
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
