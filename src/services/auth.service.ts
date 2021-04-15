import { AccessToken } from '@/interfaces/AccessToken.interface';
import { User } from '@/interfaces/User.interface';
import ky from 'ky';

export class AuthService {
  private apiUrl: string = process.env.VUE_APP_API_URL;

  async login(user: User): Promise<AccessToken> {
    const token = await ky
      .post(`${this.apiUrl}/auth/login`, {
        json: user,
      })
      .json<AccessToken>();
    return token;
  }

  async checkToken(token: string): Promise<boolean> {
    try {
      await ky
        .get(`${this.apiUrl}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .json();
      return true;
    } catch (error) {
      return false;
    }
  }
}
