import { ROUTES } from '../../../constants/routes';
import { LoginForm } from '../../../components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold">Sign In</h2>
        <LoginForm />
        <div className="mt-4 text-center">
          <p className="text-sm">
            Don't have an account? <a href={ROUTES.AUTH.REGISTER} className="text-blue-500">Sign Up</a>
          </p>
          <p className="text-sm mt-2">
            <a href={ROUTES.AUTH.FORGOT_PASSWORD} className="text-blue-500">Forgot Password?</a>
          </p>
        </div>
      </div>
    </div>
  );
}
