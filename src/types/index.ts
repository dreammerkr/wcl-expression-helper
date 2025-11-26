export interface WCLConfig {
  clientId: string;
  clientSecret: string;
  apiUrl?: string;
  tokenUrl?: string;
}

export interface WCLAuthToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  expiresAt: number;
}

export interface GraphQLQuery {
  query: string;
  variables?: Record<string, any>;
}

export interface GraphQLResponse<T = any> {
  data?: T;
  errors?: GraphQLError[];
}

export interface GraphQLError {
  message: string;
  locations?: Array<{ line: number; column: number }>;
  path?: string[];
  extensions?: Record<string, any>;
}

export interface ReportQuery {
  code: string;
  startTime?: number;
  endTime?: number;
  fightIDs?: number[];
  sourceID?: number;
  targetID?: number;
}

export interface CharacterQuery {
  name: string;
  serverSlug: string;
  serverRegion: string;
}

export interface GuildQuery {
  name: string;
  serverSlug: string;
  serverRegion: string;
}
