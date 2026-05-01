import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ENVConfigService } from '@/common/config/env.config';
import { TIKTOK_API } from '@/common/constants/social-api.constants';

@Injectable()
export class TikTokService {
  constructor(private readonly envConfigService: ENVConfigService) {}

  getAuthorizationUrl(state: string): string {
    const clientKey = this.envConfigService.get<string>('TIKTOK_CLIENT_KEY');
    const redirectUri = this.envConfigService.get<string>('TIKTOK_REDIRECT_URI');
    
    if (!clientKey || !redirectUri) {
      return '#';
    }

    const url = new URL(TIKTOK_API.AUTH_URL);
    url.searchParams.set('client_key', clientKey);
    // TikTok V2 Scopes
    url.searchParams.set('scope', 'user.info.basic,video.upload,video.publish');
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('redirect_uri', redirectUri);
    url.searchParams.set('state', state);
    return url.toString();
  }

  async connectWithCode(code: string) {
    const clientKey = this.envConfigService.get<string>('TIKTOK_CLIENT_KEY');
    const clientSecret = this.envConfigService.get<string>('TIKTOK_CLIENT_SECRET');

    const response = await fetch(TIKTOK_API.TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_key: clientKey || '',
        client_secret: clientSecret || '',
        code,
        grant_type: 'authorization_code',
        redirect_uri: this.envConfigService.get<string>('TIKTOK_REDIRECT_URI') || '',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new BadRequestException(data.error_description || 'Failed to connect to TikTok');
    }

    // Fetch user info
    const userResponse = await fetch(TIKTOK_API.USER_INFO_URL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${data.access_token}`,
      },
    });

    const userData = await userResponse.json();
    const userInfo = userData.data?.user;

    if (!userResponse.ok || !userInfo) {
      throw new InternalServerErrorException('Failed to fetch TikTok user info');
    }

    return {
      platformUserId: userInfo.open_id,
      displayName: userInfo.display_name || userInfo.username,
      accessToken: data.access_token,
      expiresAt: new Date(Date.now() + data.expires_in * 1000),
      scopes: (data.scope || '').split(','),
      destinations: [
        { 
            id: userInfo.open_id, 
            name: `My Profile (${userInfo.display_name || userInfo.username})`, 
            platform: 'tiktok' 
        }
      ]
    };
  }

  async publishVideo(accessToken: string, openId: string, text: string, videoUrl: string) {
    // TikTok Content Posting API (Direct Post via URL)
    const response = await fetch(TIKTOK_API.VIDEO_PUBLISH_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        post_info: {
          title: text.substring(0, 150), // TikTok title limit
          privacy_level: 'PUBLIC_TO_EVERYONE',
        },
        source_info: {
          source: 'PULL_FROM_URL',
          video_url: videoUrl,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('TikTok Publish Error:', JSON.stringify(data, null, 2));
      throw new InternalServerErrorException(data.error?.message || 'Failed to publish video to TikTok');
    }

    return { postId: data.data?.publish_id || 'pending' };
  }
}
