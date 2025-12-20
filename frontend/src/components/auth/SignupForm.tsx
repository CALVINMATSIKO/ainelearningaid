import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import FormInput from '../ui/FormInput';
import FormSelect from '../ui/FormSelect';

const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    grade_level: '',
    subjects: [] as string[]
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { success, error } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await register(formData);
      success('Account created successfully!');
    } catch (err) {
      error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string) => (value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Full Name"
          value={formData.full_name}
          onChange={(e) => handleChange('full_name')(e.target.value)}
          required
        />
        <FormInput
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email')(e.target.value)}
          required
        />
        <FormSelect
          label="Grade Level"
          value={formData.grade_level}
          onChange={(e) => handleChange('grade_level')(e.target.value)}
          options={[
            { value: 'primary', label: 'Primary School' },
            { value: 'secondary', label: 'Secondary School' },
            { value: 'advanced', label: 'Advanced Level' }
          ]}
          required
        />
        <FormInput
          label="Password"
          type="password"
          value={formData.password}
          onChange={(e) => handleChange('password')(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 mt-4"
        >
          {isLoading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
};

export default SignupForm;