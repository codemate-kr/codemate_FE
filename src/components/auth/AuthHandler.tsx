import { useAuthToken } from '../../hooks/useAuthToken';

export default function AuthHandler() {
  useAuthToken();
  return null;
}