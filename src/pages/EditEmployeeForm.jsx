import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, message } from 'antd';

const EditEmployeeForm = () => {
  const SERVER_URL = 'https://employee-api-gold.vercel.app'
    const [formData, setFormData] = useState({
        full_name: '',
        dob: '',
        gender: '',
        nationality: '',
        passport_number: '',
        phone_number: '',
        email: '',
        country: '',
        city: '',
        postal_code: '',
        street_address: '',
        position_id: '',
        department_id: '',
        employment_date: '',
        employment_type_id: '',
        degree: '',
        university: '',
        graduation_year: '',
        prev_company: '',
        job_title: '',
        experience_years: '',
        emergency_contact_name: '',
        emergency_contact_relationship: '',
        emergency_contact_number: ''
      });
    
      const currentYear = new Date().getFullYear();
      const newErrors = {};
      const [errors, setErrors] = useState({});
      const [messageApi, contextHolder] = message.useMessage();
      const [referenceData, setReferenceData] = useState({
        departments: [],
        positions: [],
        employmentTypes: []
      });
    
      const { id } = useParams();
      const navigate = useNavigate();
    
      useEffect(() => {
        fetchEmployeeData();
        fetchReferenceData();
      }, []);
    
      const fetchEmployeeData = async () => {
        try {
          const response = await axios.get(`${SERVER_URL}/employees/${id}`);
          const employeeData = response.data;
          setFormData({
            ...employeeData,
            dob: new Date(employeeData.dob).toISOString().split('T')[0],
            employment_date: new Date(employeeData.employment_date).toISOString().split('T')[0],
            degree: employeeData.education.degree,
            university: employeeData.education.university,
            graduation_year: employeeData.education.graduation_year,
            prev_company: employeeData.experience.company_name,
            job_title: employeeData.experience.job_title,
            experience_years: employeeData.experience.years_of_experience,
            emergency_contact_name: employeeData.emergency_contact.contact_name,
            emergency_contact_relationship: employeeData.emergency_contact.relationship,
            emergency_contact_number: employeeData.emergency_contact.phone_number
          });
        } catch (error) {
          console.error('Error fetching employee data:', error);
        }
      };
    
      const fetchReferenceData = async () => {
        try {
          const response = await axios.get(`${SERVER_URL}/reference-data`);
          setReferenceData(response.data);
        } catch (error) {
          console.error('Error fetching reference data:', error);
        }
      };
      
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        const newErrors = { ...errors };
    
        
        if (name === 'full_name') {
          if (/^[A-Za-z\s]*$/.test(value)) {
    
            if (!/\s\s/.test(value)) {
              setFormData({ ...formData, [name]: value });
              if (value.length < 3) {
                newErrors[name] = 'ФИО должно содержать не менее 3 символов.';
              } else {
                delete newErrors[name];
              }
            }
          }
        } 
    
        else if (name === 'dob') {
          setFormData({ ...formData, [name]: value });
          const dobYear = new Date(value).getFullYear();
          if (!value || currentYear - dobYear < 18) {
            newErrors[name] = 'Сотрудник должен быть старше 18 лет.';
          } else {
            delete newErrors[name];
          }
        }
    
        else if (name === 'gender') {
          setFormData({ ...formData, [name]: value });
          if (!value) {
            newErrors[name] = 'Пол обязателен для заполнения.';
          } else {
            delete newErrors[name];
          }
        }
    
        else if (name === 'nationality') {
          if (/^[A-Za-z]*$/.test(value)) {
            setFormData({ ...formData, [name]: value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() });
            if (!value) {
              newErrors[name] = 'Укажите национальность.';
            } else {
              delete newErrors[name];
            }
          }
        } 
        else if (name === 'passport_number') {
          if (value.length <= 2) {
            if (/^[A-Za-z]{0,2}$/.test(value)) {
              setFormData({...formData, [name]: value.toUpperCase()});
            }
          } 
          else if (value.length <= 9 && /^[A-Z]{2}\d{0,7}$/.test(value)) {
            setFormData({...formData, [name]: value});
          }
          if (value.length !== 9) {
            newErrors[name] = 'Номер паспорта должен состоять из 9 символов.';
          } else {
            delete newErrors[name];
          }
        }
        else if (name === 'phone_number') {
          if (/^[0-9]*$/.test(value)) {
            setFormData({ ...formData, [name]: value });
          }
    
          if (value.length < 12) {
              newErrors[name] = 'Номер телефона должен содержать не менее 12 цифр и без +.';
          } else {
              delete newErrors[name];
          }
          }
        else if (name === 'email') {
          setFormData({ ...formData, [name]: value });
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            newErrors[name] = 'Неверный формат электронной почты.';
          } else {
            delete newErrors[name];
          }
        }
    
        else if (name === 'country') {
          setFormData({ ...formData, [name]: value });
          if (!value) {
            newErrors[name] = 'Укажите страну.';
          } else {
            delete newErrors[name];
          }
        }
    
        else if (name === 'city') {
          setFormData({ ...formData, [name]: value });
          if (!value) {
            newErrors[name] = 'Укажите город.';
          } else {
            delete newErrors[name];
          }
        }
    
        else if (name === 'postal_code') {
          if (/^[0-9]*$/.test(value)) {
            setFormData({ ...formData, [name]: value });
          }
    
          if (value.length < 5) {
            newErrors[name] = 'Почтовый индекс должен содержать не менее 5 символов.';
          } else {
            delete newErrors[name];
          }
        }
    
        else if (name === 'street_address') {
          setFormData({ ...formData, [name]: value });
          if (!value) {
            newErrors[name] = 'Укажите адрес.';
          } else {
            delete newErrors[name];
          }
        }
    
        else if (name === 'department_id') {
          setFormData({ ...formData, [name]: value });
          if (!value) {
            newErrors[name] = 'Выберите отдел.';
          } else {
            delete newErrors[name];
          }
        }
    
        else if (name === 'position_id') {
          setFormData({ ...formData, [name]: value });
          if (!value) {
            newErrors[name] = 'Выберите должность.';
          } else {
            delete newErrors[name];
          }
        }
    
        else if (name === 'employment_type_id') {
          setFormData({ ...formData, [name]: value });
          if (!value) {
            newErrors[name] = 'Выберите тип занятости.';
          } else {
            delete newErrors[name];
          }
        }
        
        else if (name === 'employment_date') {
          setFormData({ ...formData, [name]: value });
          const employmentDate = new Date(value);
          if (!value || employmentDate > new Date()) {
            newErrors[name] = 'Дата приема на работу должна быть в прошлом.';
          } else {
            delete newErrors[name];
          }
        }
    
        else if (name === 'degree') {
          if (/^[A-Za-z\s]*$/.test(value)) {
            setFormData({ ...formData, [name]: value });
          }
          if (!value) {
            newErrors[name] = 'Укажите уровень образования.';
          } else {
            delete newErrors[name];
          }
        }
        
        else if (name === 'university') {
          setFormData({ ...formData, [name]: value });
          if (!value) {
            newErrors[name] = 'Укажите учебное заведение.';
          } else {
            delete newErrors[name];
          }
        }
    
        else if (name === 'graduation_year') {
          setFormData({ ...formData, [name]: value });
                
          if (!value || isNaN(value) || value > currentYear || value < 1950 || value <= 0) {
    
            newErrors[name] = 'Укажите корректный год окончания.';
          } else {
            delete newErrors[name];
          }
        }
    
        else if (name === 'prev_company') {
          setFormData({ ...formData, [name]: value });
          if (!value) {
            newErrors[name] = 'Укажите предыдущую компанию.';
          } else {
            delete newErrors[name];
          }
        }
    
        else if (name === 'job_title') {
          setFormData({ ...formData, [name]: value });
          if (!value) {
            newErrors[name] = 'Укажите предыдущую должность.';
          } else {
            delete newErrors[name];
          }
        }
    
        else if (name === 'experience_years') {
          setFormData({ ...formData, [name]: value });
          if (!value || isNaN(value) || value < 0) {
            newErrors[name] = 'Укажите корректное количество лет опыта.';
          } else {
            delete newErrors[name];
          }
        }
    
        else if (name === 'emergency_contact_name') {
          setFormData({ ...formData, [name]: value });
          if (!value) {
            newErrors[name] = 'Укажите контактное лицо.';
          } else {
            delete newErrors[name];
          }
        }
    
        else if (name === 'emergency_contact_relationship') {
          setFormData({ ...formData, [name]: value });
          if (!value) {
            newErrors[name] = 'Укажите отношение к контактному лицу.';
          } else {
            delete newErrors[name];
          }
        }
    
        else if (name === 'emergency_contact_number') {
          if (/^[0-9]*$/.test(value)) {
            setFormData({ ...formData, [name]: value });
          }
          if (value.length < 12) {
            newErrors[name] = 'Номер телефона контактного лица должен содержать не менее 12 цифр и без +.';
          } else {
            delete newErrors[name];
          }
        }
    
        else {
          setFormData({ ...formData, [name]: value });
        }
        
        setErrors(newErrors);
      };
    
      

      const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.keys(newErrors).length === 0) {
          try {
            const response = await axios.put(`${SERVER_URL}/employees/${id}`, formData);
            
            if (response.data.success) {
              await messageApi.open({
                type: 'success',
                content: 'Данные сотрудника успешно обновлены',
              });
              navigate('/search');
            } else {
              await messageApi.open({
                type: 'success',
                content: 'Произошла ошибка при обновлении данных сотрудника',
              });
            }
          } catch (error) {
            console.error('Error updating employee:', error);
            alert(`Ошибка: ${error.response?.data?.error || 'Неизвестная ошибка'}`);
          }
        } else {
          alert('Пожалуйста, исправьте ошибки перед отправкой');
        }
      };

  return (
    <>
      {contextHolder}
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <Button
            type="primary"
            onClick={() => navigate(-1)}  // This will take you to the previous page
          >
            Назад
      </Button>
        <h2 className="text-2xl font-bold mb-6 text-center">Редактирование данных сотрудника</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <label className="block font-medium">ФИО:</label>
            <input
              placeholder='Иванов Иван Иванович'
              name="full_name"
              maxLength="50"
              value={formData.full_name}
              onChange={handleChange}
              required
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            />
            {errors.full_name && <p className="text-red-500 text-sm">{errors.full_name}</p>}
          </div>

          <div>
            <label className="block font-medium">Дата рождения:</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            />
            {errors.dob && <p className="text-red-500 text-sm">{errors.dob}</p>}
          </div>

          <div>
            <label className="block font-medium">Пол:</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            >
              <option value="">Выберите пол</option>
              <option value="Мужской">Мужской</option>
              <option value="Женский">Женский</option>
            </select>
            {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
          </div>

          <div>
            <label className="block font-medium">Национальность:</label>
            <input
              placeholder='Узбек'
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              required
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            />
            {errors.nationality && <p className="text-red-500 text-sm">{errors.nationality}</p>}
          </div>

          <div>
            <label className="block font-medium">Номер паспорта:</label>
            <input
              placeholder='AC1234567'
              name="passport_number"
              maxLength="9"
              value={formData.passport_number}
              onChange={handleChange}
              required
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            />
            {errors.passport_number && <p className="text-red-500 text-sm">{errors.passport_number}</p>}
          </div>

          <div>
            <label className="block font-medium">Номер телефона:</label>
            <input
              placeholder='998901234567'
              maxLength="12"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              required
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            />
            {errors.phone_number && <p className="text-red-500 text-sm">{errors.phone_number}</p>}
          </div>

          <div>
            <label className="block font-medium">Электронная почта:</label>
            <input
              placeholder='example@gmail.com'
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div>
            <label className="block font-medium">Страна:</label>
            <input
              placeholder='Узбекистан'
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            />
            {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
          </div>

          <div>
            <label className="block font-medium">Город:</label>
            <input
              placeholder='Ташкент'
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            />
            {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
          </div>

          <div>
            <label className="block font-medium">Почтовый индекс:</label>
            <input
              placeholder='100500'
              maxLength="6"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleChange}
              required
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            />
            {errors.postal_code && <p className="text-red-500 text-sm">{errors.postal_code}</p>}
          </div>

          <div>
            <label className="block font-medium">Адрес:</label>
            <input
              placeholder='Амир Темур 5А'
              name="street_address"
              value={formData.street_address}
              onChange={handleChange}
              required
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            />
            {errors.street_address && <p className="text-red-500 text-sm">{errors.street_address}</p>}
          </div>
          <div>
            <label className="block font-medium">Дата приема на работу:</label>
            <input
              type="date"
              name="employment_date"
              value={formData.employment_date}
              onChange={handleChange}
              required
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            />
            {errors.employment_date && <p className="text-red-500 text-sm">{errors.employment_date}</p>}
          </div>

          <div>
            <label className="block font-medium">Отдел:</label>
            <select
              name="department_id"
              value={formData.department_id}
              onChange={handleChange}
              required
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            >
              <option value="">Выберите отдел</option>
              {referenceData.departments.map((dept) => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
            {errors.department_id && <p className="text-red-500 text-sm">{errors.department_id}</p>}
          </div>

          <div>
            <label className="block font-medium">Должность:</label>
            <select
              name="position_id"
              value={formData.position_id}
              onChange={handleChange}
              required
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            >
              <option value="">Выберите должность</option>
              {referenceData.positions.map((position) => (
                <option key={position.id} value={position.id}>{position.name}</option>
              ))}
            </select>
            {errors.position_id && <p className="text-red-500 text-sm">{errors.position_id}</p>}
          </div>

          <div>
            <label className="block font-medium">Тип занятости:</label>
            <select
              name="employment_type_id"
              value={formData.employment_type_id}
              onChange={handleChange}
              required
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            >
              <option value="">Выберите тип занятости</option>
              {referenceData.employmentTypes.map((type) => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
            {errors.employment_type_id && <p className="text-red-500 text-sm">{errors.employment_type_id}</p>}
          </div>

          <div>
            <label className="block font-medium">Уровень образования:</label>
            <input
              placeholder='Высшее, Среднее'
              name="degree"
              value={formData.degree}
              onChange={handleChange}
              required
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            />
            {errors.degree && <p className="text-red-500 text-sm">{errors.degree}</p>}
          </div>

          <div>
            <label className="block font-medium">Учебное заведение:</label>
            <input
              placeholder='ТУИТ'
              name="university"
              value={formData.university}
              onChange={handleChange}
              required
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            />
            {errors.university && <p className="text-red-500 text-sm">{errors.university}</p>}
          </div>

          <div>
            <label className="block font-medium">Год окончания:</label>
            <input
              name="graduation_year"
              value={formData.graduation_year}
              onChange={handleChange}
              required
              type="number"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            />
            {errors.graduation_year && <p className="text-red-500 text-sm">{errors.graduation_year}</p>}
          </div>

          <div>
            <label className="block font-medium">Предыдущая компания:</label>
            <input
              placeholder='NBU'
              name="prev_company"
              value={formData.prev_company}
              onChange={handleChange}
              required
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            />
            {errors.prev_company && <p className="text-red-500 text-sm">{errors.prev_company}</p>}
          </div>

          <div>
            <label className="block font-medium">Предыдущая должность:</label>
            <input
              placeholder='Старшый программист'
              name="job_title"
              value={formData.job_title}
              onChange={handleChange}
              required
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            />
            {errors.job_title && <p className="text-red-500 text-sm">{errors.job_title}</p>}
          </div>

          <div>
            <label className="block font-medium">Опыт работы (лет):</label>
            <input
              placeholder='2'
              name="experience_years"
              value={formData.experience_years}
              onChange={handleChange}
              required
              type="number"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            />
            {errors.experience_years && <p className="text-red-500 text-sm">{errors.experience_years}</p>}
          </div>

          <div>
            <label className="block font-medium">Имя контактного лица в экстренной ситуации(ФИО):</label>
            <input
              placeholder='Олег Олегов Олегович'
              name="emergency_contact_name"
              value={formData.emergency_contact_name}
              onChange={handleChange}
              required
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            />
            {errors.emergency_contact_name && <p className="text-red-500 text-sm">{errors.emergency_contact_name}</p>}
          </div>

          <div>
            <label className="block font-medium">Кем является этот человек:</label>
            <input
              placeholder='Брат, Отец, т.д'
              name="emergency_contact_relationship"
              value={formData.emergency_contact_relationship}
              onChange={handleChange}
              required
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            />
            {errors.emergency_contact_relationship && <p className="text-red-500 text-sm">{errors.emergency_contact_relationship}</p>}
          </div>

          <div>
            <label className="block font-medium">Телефон контактного лица:</label>
            <input
              placeholder='998901234567'
              maxLength="12"
              name="emergency_contact_number"
              value={formData.emergency_contact_number}
              onChange={handleChange}
              required
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            />
            {errors.emergency_contact_number && <p className="text-red-500 text-sm">{errors.emergency_contact_number}</p>}
          </div>
        </div>

        <div className="mt-6">
          <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
            Обновить данные
          </button>
        </div>
      </form>
  </>
  );
};

export default EditEmployeeForm;