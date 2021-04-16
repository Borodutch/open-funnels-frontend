import ky from 'ky';
import { Funnel } from '@/interfaces/Funnel.interface';
import store from '@/store';

const apiUrl = process.env.VUE_APP_API_URL;

export async function addFunnel(
  name: string,
  description: string,
  steps: string[]
): Promise<void> {
  const token: string = store.state.UserStore.token;
  await ky.post(`${apiUrl}/funnel`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    json: {
      name: name,
      description: description,
      steps: steps,
    },
  });
}

export async function getFunnels(): Promise<Funnel[]> {
  const token: string = store.state.UserStore.token;
  const funnels = await ky
    .get(`${apiUrl}/funnel`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .json<Funnel[]>();
  return funnels;
}

export async function getMeta(
  id: string,
  platform: string,
  dates: string[]
): Promise<number[]> {
  const token: string = store.state.UserStore.token;
  const meta = await ky
    .get(`${apiUrl}/meta/${id}?p=${platform}&ds=${dates[0]}&de=${dates[1]}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .json<number[]>();
  return meta;
}

export async function isDbOk(): Promise<boolean> {
  try {
    const dbStatus: { status: string } = await ky
      .get(`${apiUrl}/status`)
      .json();
    return dbStatus.status === 'ok';
  } catch (error) {
    return false;
  }
}

export async function distinctPlatforms(): Promise<string[]> {
  const token: string = store.state.UserStore.token;
  const distinct = await ky
    .get(`${apiUrl}/event/distinct/platform`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .json<string[]>();
  return distinct;
}

export async function distinctNames(): Promise<string[]> {
  const token: string = store.state.UserStore.token;
  const distinct = await ky
    .get(`${apiUrl}/event/distinct/name`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .json<string[]>();
  return distinct;
}
