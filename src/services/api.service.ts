import ky from 'ky';
import { Funnel } from '@/interfaces/Funnel.interface';

const apiUrl = process.env.VUE_APP_API_URL;

export async function getFunnels(): Promise<Funnel[]> {
  const funnels = await ky.get(`${apiUrl}/funnel`).json<Funnel[]>();
  return funnels;
}

export async function getMeta(id: string): Promise<number[]> {
  const meta = await ky.get(`${apiUrl}/meta/${id}`).json<number[]>();
  return meta;
}

export async function isDbOk(): Promise<boolean> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dbStatus: any = await ky.get(`${apiUrl}/status`).json();
    return dbStatus.status === 'ok';
  } catch (error) {
    return false;
  }
}

export async function distinctPlatforms(): Promise<string[]> {
  const distinct = await ky
    .get(`${apiUrl}/event/distinct/platform`)
    .json<string[]>();
  return distinct;
}
