import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

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
    
      const [errors, setErrors] = useState({});
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
          const response = await axios.get(`${SERVER_URL}/${id}`);
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
        setFormData({ ...formData, [name]: value });
      };
    
      const validateForm = () => {
        const newErrors = {};
        const currentYear = new Date().getFullYear();
    
        if (!formData.full_name || formData.full_name.length < 3) {
          newErrors.full_name = 'ФИО должно содержать не менее 3 символов.';
        }
    
        const dobYear = new Date(formData.dob).getFullYear();
        if (!formData.dob || currentYear - dobYear < 18) {
          newErrors.dob = 'Сотрудник должен быть старше 18 лет.';
        }
    
        if (!formData.gender) {
          newErrors.gender = 'Пол обязателен для заполнения.';
        }
    
        if (!formData.nationality) {
          newErrors.nationality = 'Укажите национальность.';
        }
    
        if (!formData.passport_number || formData.passport_number.length !== 9) {
          newErrors.passport_number = 'Номер паспорта должен состоять из 9 символов.';
        }
    
        const phoneNumberRegex = /^\d{7,}$/;
        if (!phoneNumberRegex.test(formData.phone_number)) {
          newErrors.phone_number = 'Номер телефона должен содержать не менее 7 цифр и без +.';
        }
    
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          newErrors.email = 'Неверный формат электронной почты.';
        }
    
        if (!formData.country) {
          newErrors.country = 'Укажите страну.';
        }
    
        if (!formData.city) {
          newErrors.city = 'Укажите город.';
        }
    
        if (!formData.postal_code || formData.postal_code.length < 5) {
          newErrors.postal_code = 'Почтовый индекс должен содержать не менее 5 символов.';
        }
    
        if (!formData.street_address) {
          newErrors.street_address = 'Укажите адрес.';
        }
    
        if (!formData.department_id) {
          newErrors.department_id = 'Выберите отдел.';
        }
    
        if (!formData.position_id) {
          newErrors.position_id = 'Выберите должность.';
        }
    
        if (!formData.employment_type_id) {
          newErrors.employment_type_id = 'Выберите тип занятости.';
        }
    
        const employmentDate = new Date(formData.employment_date);
        if (!formData.employment_date || employmentDate > new Date()) {
          newErrors.employment_date = 'Дата приема на работу должна быть в прошлом.';
        }
    
        if (!formData.degree) {
          newErrors.degree = 'Укажите уровень образования.';
        }
    
        if (!formData.university) {
          newErrors.university = 'Укажите учебное заведение.';
        }
    
        if (!formData.graduation_year || isNaN(formData.graduation_year) || formData.graduation_year > currentYear) {
          newErrors.graduation_year = 'Укажите корректный год окончания.';
        }
    
        if (!formData.prev_company) {
          newErrors.prev_company = 'Укажите предыдущую компанию.';
        }
    
        if (!formData.job_title) {
          newErrors.job_title = 'Укажите предыдущую должность.';
        }
    
        if (!formData.experience_years || isNaN(formData.experience_years) || formData.experience_years < 0) {
          newErrors.experience_years = 'Укажите корректное количество лет опыта.';
        }
    
        if (!formData.emergency_contact_name) {
          newErrors.emergency_contact_name = 'Укажите контактное лицо.';
        }
    
        if (!formData.emergency_contact_relationship) {
          newErrors.emergency_contact_relationship = 'Укажите отношение к контактному лицу.';
        }
    
        if (!phoneNumberRegex.test(formData.emergency_contact_number)) {
          newErrors.emergency_contact_number = 'Номер телефона контактного лица должен содержать не менее 7 цифр и без +.';
        }
    
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
          try {
            const response = await axios.put(`${SERVER_URL}/employees/${id}`, formData);
            
            if (response.data.success) {
              alert('Данные сотрудника успешно обновлены');
              navigate('/search');
            } else {
              alert('Произошла ошибка при обновлении данных сотрудника');
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
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Редактирование данных сотрудника</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">ФИО:</label>
          <input
            name="full_name"
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
            name="passport_number"
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
  );
};

export default EditEmployeeForm;