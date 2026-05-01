import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import type {
  MetaConnectResult,
  MetaInstagramAccount,
  MetaPage,
} from '@/api/modules/social-posting/types/meta-graph.types';
import { ENVConfigService } from '@/common/config/env.config';

@Injectable()
export class MetaGraphService {
  private readonly graphBase = 'https://graph.facebook.com/v20.0';
  private readonly oauthBase = 'https://www.facebook.com/v20.0/dialog/oauth';

  constructor(private readonly envConfigService: ENVConfigService) {}

  getAuthorizationUrl(platform: string, state: string): string {
    const appId = this.requireEnv('META_APP_ID');
    const redirectUri = this.requireEnv('META_REDIRECT_URI');
    const scope =
      platform === 'instagram'
        ? 'pages_show_list pages_read_engagement pages_manage_posts business_management instagram_basic instagram_content_publish'
        : 'pages_show_list pages_read_engagement pages_manage_posts business_management';
    const url = new URL(this.oauthBase);
    url.searchParams.set('client_id', appId);
    url.searchParams.set('redirect_uri', redirectUri);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('scope', scope);
    url.searchParams.set('state', state);
    return url.toString();
  }

  async connectWithCode(
    code: string,
    redirectUri?: string,
  ): Promise<MetaConnectResult> {
    const appId = this.requireEnv('META_APP_ID');
    const appSecret = this.requireEnv('META_APP_SECRET');
    const callbackUri = redirectUri || this.requireEnv('META_REDIRECT_URI');
    const tokenData = await this.exchangeCode(
      code,
      callbackUri,
      appId,
      appSecret,
    );
    const profile = await this.getProfile(tokenData.access_token);
    const pages = await this.getPages(tokenData.access_token);
    const instagramAccounts = await this.getInstagramAccounts(pages);

    return {
      platformUserId: String(profile.id),
      displayName: String(profile.name ?? 'Meta User'),
      accessToken: tokenData.access_token,
      expiresAt:
        typeof tokenData.expires_in === 'number'
          ? new Date(Date.now() + tokenData.expires_in * 1000)
          : null,
      scopes: [],
      pages,
      instagramAccounts,
    };
  }

  async publishToFacebookPage(
    pageId: string,
    pageAccessToken: string,
    message: string,
    imageUrls: string[] = [],
  ): Promise<{ postId: string }> {
    if (imageUrls.length <= 1) {
      const imageUrl = imageUrls[0];
      const endpoint = imageUrl
        ? `${this.graphBase}/${pageId}/photos`
        : `${this.graphBase}/${pageId}/feed`;
      const body = new URLSearchParams({
        access_token: pageAccessToken,
      });

      if (imageUrl) {
        body.set('url', imageUrl);
        body.set('caption', message);
      } else {
        body.set('message', message);
      }

      const response = await fetch(endpoint, { method: 'POST', body });
      const json = (await response.json()) as { id?: string; error?: any };
      if (!response.ok || !json.id) {
        throw new BadRequestException(
          'Failed to publish to Facebook: ' +
            (json.error?.message || 'Unknown error'),
        );
      }
      return { postId: json.id };
    }

    // Multi-photo logic
    const photoIds: string[] = [];
    for (const url of imageUrls) {
      const res = await fetch(`${this.graphBase}/${pageId}/photos`, {
        method: 'POST',
        body: new URLSearchParams({
          url,
          published: 'false',
          access_token: pageAccessToken,
        }),
      });
      const data = (await res.json()) as { id: string };
      if (data.id) photoIds.push(data.id);
    }

    const attachedMedia = photoIds.map((id) => ({ media_fbid: id }));
    const feedRes = await fetch(`${this.graphBase}/${pageId}/feed`, {
      method: 'POST',
      body: new URLSearchParams({
        message,
        attached_media: JSON.stringify(attachedMedia),
        access_token: pageAccessToken,
      }),
    });
    const feedJson = (await feedRes.json()) as { id: string };
    return { postId: feedJson.id };
  }

  async publishToInstagramBusiness(
    instagramBusinessId: string,
    pageAccessToken: string,
    caption: string,
    imageUrls: string[],
  ): Promise<{ postId: string }> {
    if (imageUrls.length === 1) {
      return this.publishSingleToInstagram(
        instagramBusinessId,
        pageAccessToken,
        caption,
        imageUrls[0],
      );
    }

    // Carousel Logic
    const itemIds: string[] = [];
    for (const url of imageUrls) {
      const res = await fetch(`${this.graphBase}/${instagramBusinessId}/media`, {
        method: 'POST',
        body: new URLSearchParams({
          image_url: url,
          is_carousel_item: 'true',
          access_token: pageAccessToken,
        }),
      });
      const data = (await res.json()) as { id: string };
      if (data.id) itemIds.push(data.id);
    }

    const containerRes = await fetch(
      `${this.graphBase}/${instagramBusinessId}/media`,
      {
        method: 'POST',
        body: new URLSearchParams({
          media_type: 'CAROUSEL',
          children: itemIds.join(','),
          caption,
          access_token: pageAccessToken,
        }),
      },
    );
    const containerJson = (await containerRes.json()) as { id: string };

    const publishRes = await fetch(
      `${this.graphBase}/${instagramBusinessId}/media_publish`,
      {
        method: 'POST',
        body: new URLSearchParams({
          creation_id: containerJson.id,
          access_token: pageAccessToken,
        }),
      },
    );
    const publishJson = (await publishRes.json()) as { id: string };
    return { postId: publishJson.id };
  }

  private async publishSingleToInstagram(
    instagramBusinessId: string,
    pageAccessToken: string,
    caption: string,
    imageUrl: string,
  ): Promise<{ postId: string }> {
    const containerRes = await fetch(
      `${this.graphBase}/${instagramBusinessId}/media`,
      {
        method: 'POST',
        body: new URLSearchParams({
          image_url: imageUrl,
          caption,
          access_token: pageAccessToken,
        }),
      },
    );
    const containerJson = (await containerRes.json()) as { id: string };

    const publishRes = await fetch(
      `${this.graphBase}/${instagramBusinessId}/media_publish`,
      {
        method: 'POST',
        body: new URLSearchParams({
          creation_id: containerJson.id,
          access_token: pageAccessToken,
        }),
      },
    );
    const publishJson = (await publishRes.json()) as { id: string };
    return { postId: publishJson.id };
  }

  private async exchangeCode(
    code: string,
    redirectUri: string,
    appId: string,
    appSecret: string,
  ): Promise<{ access_token: string; expires_in?: number }> {
    const url = new URL(`${this.graphBase}/oauth/access_token`);
    url.searchParams.set('client_id', appId);
    url.searchParams.set('client_secret', appSecret);
    url.searchParams.set('redirect_uri', redirectUri);
    url.searchParams.set('code', code);
    const response = await fetch(url.toString());
    const json = (await response.json()) as {
      access_token?: string;
      expires_in?: number;
      error?: unknown;
    };
    if (!response.ok || !json.access_token) {
      throw new BadRequestException('Meta OAuth code exchange failed');
    }
    return {
      access_token: json.access_token,
      expires_in: json.expires_in,
    };
  }

  private async getProfile(
    accessToken: string,
  ): Promise<{ id: string; name: string }> {
    const url = new URL(`${this.graphBase}/me`);
    url.searchParams.set('fields', 'id,name');
    url.searchParams.set('access_token', accessToken);
    const response = await fetch(url.toString());
    const json = (await response.json()) as { id?: string; name?: string };
    if (!response.ok || !json.id) {
      throw new BadRequestException('Unable to fetch Meta profile');
    }
    return { id: json.id, name: json.name ?? 'Meta User' };
  }

  private async getPages(accessToken: string): Promise<MetaPage[]> {
    const url = new URL(`${this.graphBase}/me/accounts`);
    url.searchParams.set('fields', 'id,name,access_token');
    url.searchParams.set('access_token', accessToken);
    
    console.log('--- Fetching Meta Pages ---');
    console.log('URL:', url.toString().replace(accessToken, 'REDACTED'));
    
    const response = await fetch(url.toString());
    const json = (await response.json()) as {
      data?: MetaPage[];
      error?: any;
    };
    
    console.log('Meta Response Status:', response.status);
    console.log('Meta Response Data:', JSON.stringify(json, null, 2));

    if (!response.ok) {
      throw new BadRequestException('Unable to fetch Facebook pages: ' + (json.error?.message || 'Unknown error'));
    }
    return Array.isArray(json.data) ? json.data : [];
  }

  private async getInstagramAccounts(
    pages: MetaPage[],
  ): Promise<Array<{ id: string; name: string; accessToken: string }>> {
    const accounts: Array<{ id: string; name: string; accessToken: string }> =
      [];
    for (const page of pages) {
      const url = new URL(`${this.graphBase}/${page.id}`);
      url.searchParams.set('fields', 'instagram_business_account{id,username}');
      url.searchParams.set('access_token', page.access_token);
      
      console.log(`--- Checking IG for Page: ${page.name} (${page.id}) ---`);
      
      const response = await fetch(url.toString());
      const json = (await response.json()) as {
        instagram_business_account?: MetaInstagramAccount;
        error?: any;
      };

      if (!response.ok) {
        console.log(`IG Fetch Error for ${page.name}:`, JSON.stringify(json.error, null, 2));
        continue;
      }

      console.log(`IG Account Found for ${page.name}:`, JSON.stringify(json.instagram_business_account, null, 2));

      if (json.instagram_business_account?.id) {
        accounts.push({
          id: json.instagram_business_account.id,
          name:
            json.instagram_business_account.username ||
            `IG ${json.instagram_business_account.id}`,
          accessToken: page.access_token,
        });
      }
    }
    return accounts;
  }

  private requireEnv(name: string): string {
    const value = this.envConfigService.get<string>(name);
    if (!value?.trim()) {
      throw new InternalServerErrorException(`${name} is required`);
    }
    return value;
  }
}
