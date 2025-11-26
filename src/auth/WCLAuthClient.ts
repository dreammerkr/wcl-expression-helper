import axios, { AxiosInstance } from 'axios';
import { WCLConfig, WCLAuthToken } from '../types';

export class WCLAuthClient {
  private config: WCLConfig;
  private token: WCLAuthToken | null = null;
  private httpClient: AxiosInstance;

  constructor(config: WCLConfig) {
    this.config = {
      apiUrl: 'https://www.warcraftlogs.com/api/v2/client',
      tokenUrl: 'https://www.warcraftlogs.com/oauth/token',
      ...config,
    };

    this.httpClient = axios.create({
      timeout: 10000,
    });
  }

  async authenticate(): Promise<WCLAuthToken> {
    try {
      const params = new URLSearchParams();
      params.append('grant_type', 'client_credentials');

      const response = await this.httpClient.post<WCLAuthToken>(
        this.config.tokenUrl!,
        params,
        {
          auth: {
            username: this.config.clientId,
            password: this.config.clientSecret,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const now = Date.now();
      this.token = {
        ...response.data,
        expiresAt: now + response.data.expires_in * 1000,
      };

      return this.token;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `WCL Authentication failed: ${error.response?.data?.error || error.message}`
        );
      }
      throw error;
    }
  }

  async getValidToken(): Promise<string> {
    if (!this.token || this.isTokenExpired()) {
      await this.authenticate();
    }
    return this.token!.access_token;
  }

  private isTokenExpired(): boolean {
    if (!this.token) return true;
    const now = Date.now();
    const buffer = 60000; // 1 minute buffer
    return now >= this.token.expiresAt - buffer;
  }

  getToken(): WCLAuthToken | null {
    return this.token;
  }

  clearToken(): void {
    this.token = null;
  }
}
