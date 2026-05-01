export type MetaPage = {
  id: string;
  name: string;
  access_token: string;
};

export type MetaInstagramAccount = {
  id: string;
  username?: string;
};

export type MetaConnectResult = {
  platformUserId: string;
  displayName: string;
  accessToken: string;
  expiresAt: Date | null;
  scopes: string[];
  pages: MetaPage[];
  instagramAccounts: Array<{ id: string; name: string; accessToken: string }>;
};
