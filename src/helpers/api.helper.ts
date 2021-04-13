import ky from 'ky';
import { AccessToken } from '@/interfaces/AccessToken.interface';

const apiUrl = process.env.VUE_APP_API_URL;

export async function login(
  login: string,
  password: string
): Promise<AccessToken> {
  const token = await ky
    .post(`${apiUrl}/auth/login`, {
      json: { login, password },
    })
    .json<AccessToken>();
  return token;
}
