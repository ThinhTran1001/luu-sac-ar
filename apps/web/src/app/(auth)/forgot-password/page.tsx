import { ROUTES } from '../../../constants/routes';
import { ForgotPasswordForm } from '../../../components/auth/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold">Forgot Password</h2>
        <ForgotPasswordForm />
        <div className="mt-4 text-center">
          <p className="text-sm">
            <a href={ROUTES.AUTH.LOGIN} className="text-blue-500">
              Back to Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
