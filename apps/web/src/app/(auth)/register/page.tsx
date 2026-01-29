import { ROUTES } from '../../../constants/routes';
import { RegisterForm } from '../../../components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold">Sign Up</h2>
        <RegisterForm />
        <div className="mt-4 text-center">
          <p className="text-sm">
            Already have an account?{' '}
            <a href={ROUTES.AUTH.LOGIN} className="text-blue-500">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
