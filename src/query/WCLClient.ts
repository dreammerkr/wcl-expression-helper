import axios, { AxiosInstance } from 'axios';
import { WCLAuthClient } from '../auth/WCLAuthClient';
import { GraphQLQuery, GraphQLResponse, WCLConfig } from '../types';

export class WCLClient {
  private authClient: WCLAuthClient;
  private httpClient: AxiosInstance;
  private apiUrl: string;

  constructor(config: WCLConfig) {
    this.authClient = new WCLAuthClient(config);
    this.apiUrl = config.apiUrl || 'https://www.warcraftlogs.com/api/v2/client';

    this.httpClient = axios.create({
      baseURL: this.apiUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Execute a GraphQL query against the WCL API
   */
  async query<T = any>(graphqlQuery: GraphQLQuery): Promise<GraphQLResponse<T>> {
    try {
      const token = await this.authClient.getValidToken();

      const response = await this.httpClient.post<GraphQLResponse<T>>(
        '',
        {
          query: graphqlQuery.query,
          variables: graphqlQuery.variables,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.errors && response.data.errors.length > 0) {
        console.error('GraphQL Errors:', response.data.errors);
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.errors?.[0]?.message
          || error.response?.data?.error
          || error.message;
        throw new Error(`WCL Query failed: ${errorMessage}`);
      }
      throw error;
    }
  }

  /**
   * Get the authentication client for manual token management
   */
  getAuthClient(): WCLAuthClient {
    return this.authClient;
  }

  /**
   * Test connection to WCL API
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.authClient.authenticate();
      return true;
    } catch (error) {
      return false;
    }
  }
}
