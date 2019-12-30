export interface LoginReturn {
  return: boolean;
  data: LoginData;
  msg: string;
  code: number;
  JWT: string;
}

export interface LoginData {
  id: number;
  id_company: number;
  name: string;
  token: string;
  email: string;
  username: string;
  JWT?: string;
}
