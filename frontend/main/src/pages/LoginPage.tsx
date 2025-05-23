import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Lock } from 'lucide-react';
import FormInput from '../components/FormInput';
import { validateEmail } from '../utils/validation';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name as keyof typeof touched]) {
      validateField(name as keyof typeof errors, value);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name as keyof typeof errors, value);
  };

  const validateField = (field: keyof typeof errors, value: string) => {
    let errorMessage = '';
    
    if (field === 'email') {
      errorMessage = validateEmail(value);
    } else if (field === 'password' && !value) {
      errorMessage = 'Password is required';
    }
    
    setErrors(prev => ({ ...prev, [field]: errorMessage }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const emailError = validateEmail(formData.email);
    const passwordError = !formData.password ? 'Password is required' : '';
    
    setErrors({
      email: emailError,
      password: passwordError,
    });
    
    setTouched({
      email: true,
      password: true,
    });
    
    // Check if there are any errors
    if (!emailError && !passwordError) {
      setIsSubmitting(true);
      
      // Simulate API call
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        // Would normally redirect or show success message
      } catch (error) {
        console.error('Login error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const isFormValid = !errors.email && !errors.password && formData.email && formData.password;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
          <div className="bg-gradient-to-r from-blue-500 to-teal-500 p-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
              <p className="text-blue-100 mt-1">Log in to continue learning</p>
            </div>
            <GraduationCap className="text-white h-10 w-10" />
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            <FormInput
              label="Email Address"
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email ? errors.email : ''}
              icon={<span className="text-gray-400">@</span>}
              autoFocus
            />
            
            <FormInput
              label="Password"
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.password ? errors.password : ''}
              icon={<Lock className="h-5 w-5 text-gray-400" />}
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="text-blue-500 hover:underline">
                  Forgot your password?
                </a>
              </div>
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !isFormValid}
                className={`w-full py-3 px-4 flex justify-center items-center rounded-md text-white font-medium transition-all duration-300 ${
                  isFormValid
                    ? 'bg-blue-500 hover:bg-blue-600 shadow-md hover:shadow-lg'
                    : 'bg-blue-300 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                ) : null}
                {isSubmitting ? 'Logging In...' : 'Log In'}
              </button>
            </div>
          </form>
          
          <div className="px-6 sm:px-8 pb-8 pt-2 text-center">
            <div className="text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-500 font-medium hover:underline transition-colors duration-300">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;