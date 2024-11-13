import React, { useState } from 'react';
import { Table, Input, Button, Modal, Space, Card, Descriptions, Row, Col, Select, Form } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

const { Option } = Select;

const EmployeeSearch = () => {
  const SERVER_URL = 'https://employee-api-gold.vercel.app';
  const [searchParams, setSearchParams] = useState({
    field: 'full_name',
    value: ''
  });
  const [searchResults, setSearchResults] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const navigate = useNavigate();

  const searchFields = [
    { value: 'full_name', label: 'ФИО' },
    { value: 'email', label: 'Email' },
    { value: 'phone_number', label: 'Телефон' },
    { value: 'passport_number', label: 'Номер паспорта' },
    { value: 'nationality', label: 'Национальность' },
    { value: 'gender', label: 'Пол' },
    { value: 'university', label: 'Университет' },
    { value: 'degree', label: 'Степень' },
    { value: 'graduation_year', label: 'Год выпуска' },
    { value: 'company_name', label: 'Предыдущая компания' },
    { value: 'job_title', label: 'Предыдущая должность' },
    { value: 'department', label: 'Отдел' },
    { value: 'position', label: 'Должность' },
    { value: 'city', label: 'Город' },
    { value: 'country', label: 'Страна' }
  ];

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `${SERVER_URL}/employees/search?field=${searchParams.field}&value=${searchParams.value}`
      );
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
      title: (
        <div>
          <label htmlFor="full-name-input">ФИО:</label>
          <Input
            id="full-name-input"
            placeholder="Введите наименование"
            style={{ width: '100%' }}
            onChange={(e) =>
              setSearchParams((prev) => ({ ...prev, field: 'full_name', value: e.target.value }))
            }
          />
        </div>
      ),
      dataIndex: 'full_name',
      key: 'full_name',
    },
    {
      title: (
        <div>
          <label htmlFor="email-input">Email:</label>
          <Input
            id="email-input"
            placeholder="Введите email"
            style={{ width: '100%' }}
            onChange={(e) =>
              setSearchParams((prev) => ({ ...prev, field: 'email', value: e.target.value }))
            }
          />
        </div>
      ),
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: (
        <div>
          <label htmlFor="phone-input">Телефон:</label>
          <Input
            id="phone-input"
            placeholder="Введите телефон"
            style={{ width: '100%' }}
            onChange={(e) =>
              setSearchParams((prev) => ({ ...prev, field: 'phone_number', value: e.target.value }))
            }
          />
        </div>
      ),
      dataIndex: 'phone_number',
      key: 'phone_number',
    },
    {
      title: (
        <div>
          <label htmlFor="position-input">Должность:</label>
          <Input
            id="position-input"
            placeholder="Введите должность"
            style={{ width: '100%' }}
            onChange={(e) =>
              setSearchParams((prev) => ({ ...prev, field: 'position_name', value: e.target.value }))
            }
          />
        </div>
      ),
      dataIndex: 'position_name',
      key: 'position_name',
    },
    {
      title: (
        <div>
          <label htmlFor="department-input">Отдел:</label>
          <Input
            id="department-input"
            placeholder="Введите отдел"
            style={{ width: '100%' }}
            onChange={(e) =>
              setSearchParams((prev) => ({ ...prev, field: 'department_name', value: e.target.value }))
            }
          />
        </div>
      ),
      dataIndex: 'department_name',
      key: 'department_name',
    },
    {
      title: (
        <div>
          <label htmlFor="city-input">Город:</label>
          <Input
            id="city-input"
            placeholder="Введите город"
            style={{ width: '100%' }}
            onChange={(e) =>
              setSearchParams((prev) => ({ ...prev, field: 'city', value: e.target.value }))
            }
          />
        </div>
      ),
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: (
        <div>
          <label htmlFor="employment-type-input">Тип занятости:</label>
          <Input
            id="employment-type-input"
            placeholder="Введите тип занятости"
            style={{ width: '100%' }}
            onChange={(e) =>
              setSearchParams((prev) => ({ ...prev, field: 'employment_type_name', value: e.target.value }))
            }
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
    <>
      <Header link={''} text={"Добавить сотрудника"} />
      <div className="p-6" style={{ marginTop: '70px' }}>
        <Card>
          <Form layout="vertical">
            <Row gutter={[16, 16]} align="bottom" style={{ display: 'flex', alignItems: 'center' }}>
              <Col xs={24} md={8}>
                <Form.Item label="Параметр поиска">
                  <Select
                    value={searchParams.field}
                    onChange={(value) => setSearchParams(prev => ({ ...prev, field: value }))}
                    className="w-full"
                  >
                    {searchFields.map(field => (
                      <Option key={field.value} value={field.value}>
                        {field.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Поисковый запрос">
                  <Input
                    value={searchParams.value}
                    onChange={(e) => setSearchParams(prev => ({ ...prev, value: e.target.value }))}
                    placeholder="Введите текст для поиска"
                    prefix={<SearchOutlined />}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={4} style={{ transform: 'translateY(10%)' }}>
                <Button type="primary" onClick={handleSearch} block>
                  Поиск
                </Button>
              </Col>
            </Row>
          </Form>

          <Table
            columns={columns}
            dataSource={searchResults}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1300 }}
            className="mt-6"
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
    </>
  );
};

export default EmployeeSearch;