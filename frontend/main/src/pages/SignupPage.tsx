import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Check } from 'lucide-react';
import FormInput from '../components/FormInput';
import PasswordStrength from '../components/PasswordStrength';
import { validateName, validateEmail, validatePassword } from '../utils/validation';

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
  });
  
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validate in real-time
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
    
    switch (field) {
      case 'name':
        errorMessage = validateName(value);
        break;
      case 'email':
        errorMessage = validateEmail(value);
        break;
      case 'password':
        errorMessage = validatePassword(value);
        break;
      default:
        break;
    }
    
    setErrors(prev => ({ ...prev, [field]: errorMessage }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    
    setErrors({
      name: nameError,
      email: emailError,
      password: passwordError,
    });
    
    setTouched({
      name: true,
      email: true,
      password: true,
    });
    
    // Check if there are any errors
    if (!nameError && !emailError && !passwordError) {
      setIsSubmitting(true);
      
      // Simulate API call
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSubmitSuccess(true);
        // Would normally redirect or show success message
      } catch (error) {
        console.error('Signup error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const isFormValid = !errors.name && !errors.email && !errors.password &&
    formData.name && formData.email && formData.password;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
          <div className="bg-gradient-to-r from-blue-500 to-teal-500 p-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">Join LearningHub</h1>
              <p className="text-blue-100 mt-1">Start your learning journey today</p>
            </div>
            <GraduationCap className="text-white h-10 w-10" />
          </div>
          
          {submitSuccess ? (
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Registration Successful!</h2>
              <p className="text-gray-600 mb-6">Your account has been created. You can now log in.</p>
              <Link 
                to="/login" 
                className="inline-block w-full py-3 px-4 text-center font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 transition-colors duration-300"
              >
                Go to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
              <FormInput
                label="Full Name"
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name ? errors.name : ''}
                icon={<span className="text-gray-400">Aa</span>}
                autoFocus
              />
              
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
              />
              
              <div className="space-y-2">
                <FormInput
                  label="Password"
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a secure password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password ? errors.password : ''}
                  icon={<span className="text-gray-400">***</span>}
                />
                {formData.password && (
                  <PasswordStrength password={formData.password} />
                )}
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
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
              
              <div className="mt-6 text-center text-sm">
                <p className="text-gray-600">
                  By signing up, you agree to our{' '}
                  <a href="#" className="text-blue-500 hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>
                </p>
              </div>
            </form>
          )}
          
          <div className="px-6 sm:px-8 pb-8 pt-2 text-center">
            <div className="text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-500 font-medium hover:underline transition-colors duration-300">
                Log in
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <div className="flex justify-center space-x-4">
            <a href="#" className="text-gray-600 hover:text-gray-800 text-sm">Help</a>
            <a href="#" className="text-gray-600 hover:text-gray-800 text-sm">Contact</a>
            <a href="#" className="text-gray-600 hover:text-gray-800 text-sm">About</a>
          </div>
          <p className="text-gray-500 text-sm mt-4">© 2025 LearningHub. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;