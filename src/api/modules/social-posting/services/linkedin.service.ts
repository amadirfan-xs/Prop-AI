import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ENVConfigService } from '@/common/config/env.config';
import { LINKEDIN_API } from '@/common/constants/social-api.constants';

@Injectable()
export class LinkedInService {
  constructor(private readonly envConfigService: ENVConfigService) {}

  private formatUrn(id: string): string {
    return id.startsWith('urn:li:') ? id : `urn:li:person:${id}`;
  }

  getAuthorizationUrl(state: string): string {
    const clientId = this.envConfigService.getSafe<string>('LINKEDIN_CLIENT_ID');
    const redirectUri = this.envConfigService.getSafe<string>('LINKEDIN_REDIRECT_URI');
    
    if (!clientId || !redirectUri) {
      return '#';
    }

    const url = new URL(LINKEDIN_API.AUTH_URL);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('client_id', clientId);
    url.searchParams.set('redirect_uri', redirectUri);
    url.searchParams.set('state', state);
    url.searchParams.set('scope', 'w_member_social openid profile email');
    return url.toString();
  }

  async connectWithCode(code: string) {
    const clientId = this.envConfigService.get<string>('LINKEDIN_CLIENT_ID');
    const clientSecret = this.envConfigService.get<string>('LINKEDIN_CLIENT_SECRET');
    const redirectUri = this.envConfigService.get<string>('LINKEDIN_REDIRECT_URI');

    const tokenResponse = await fetch(LINKEDIN_API.TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      throw new BadRequestException(tokenData.error_description || 'Failed to exchange LinkedIn code');
    }

    const accessToken = tokenData.access_token;
    const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000);

    const userResponse = await fetch(LINKEDIN_API.USER_INFO_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const userData = await userResponse.json();

    if (!userResponse.ok) {
      throw new InternalServerErrorException('Failed to fetch LinkedIn profile info');
    }

    const platformUserId = userData.sub; 
    const displayName = userData.name || `${userData.given_name} ${userData.family_name}`;

    return {
      platformUserId,
      displayName,
      accessToken,
      expiresAt,
      scopes: ['w_member_social', 'openid', 'profile', 'email'],
      destinations: [
        { 
          id: platformUserId, 
          name: `Personal Profile (${displayName})`, 
          platform: 'linkedin' 
        }
      ]
    };
  }

  async publishPost(accessToken: string, personId: string, text: string, imageUrls: string[]) {
    try {
      let mediaAsset: string | null = null;
      const authorUrn = this.formatUrn(personId);

      if (imageUrls && imageUrls.length > 0) {
        mediaAsset = await this.uploadImage(accessToken, authorUrn, imageUrls[0]);
      }

      const body: any = {
        author: authorUrn,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: text
            },
            shareMediaCategory: mediaAsset ? 'IMAGE' : 'NONE'
          }
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
        }
      };

      if (mediaAsset) {
        body.specificContent['com.linkedin.ugc.ShareContent'].media = [
          {
            status: 'READY',
            description: {
              text: 'Property Image'
            },
            media: mediaAsset,
            title: {
              text: 'Property Highlight'
            }
          }
        ];
      }

      const response = await fetch(LINKEDIN_API.UGC_POSTS_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0',
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'LinkedIn UGC Post failed');
      }

      return { postId: result.id };
    } catch (error: any) {
      console.error('LinkedIn Publish Error:', error);
      throw new InternalServerErrorException(`LinkedIn Post Failed: ${error?.message || 'Unknown error'}`);
    }
  }

  private async uploadImage(accessToken: string, authorUrn: string, imageUrl: string): Promise<string> {
    const registerResponse = await fetch(`${LINKEDIN_API.ASSETS_URL}?action=registerUpload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        registerUploadRequest: {
          recipes: [LINKEDIN_API.UPLOAD_RECIPE],
          owner: authorUrn,
          serviceRelationships: [
            {
              relationshipType: 'OWNER',
              identifier: 'urn:li:userGeneratedContent',
            },
          ],
        },
      }),
    });

    const registerData = await registerResponse.json();
    if (!registerResponse.ok) {
      console.error('LinkedIn Register Upload Error Details:', JSON.stringify(registerData, null, 2));
      throw new Error(`Failed to register LinkedIn upload: ${registerData.message || 'Unknown error'}`);
    }

    const uploadUrl = registerData.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
    const assetId = registerData.value.asset;

    const imageFetch = await fetch(imageUrl);
    const imageBlob = await imageFetch.blob();

    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: imageBlob,
    });

    if (!uploadResponse.ok) throw new Error('Failed to upload image binary to LinkedIn');

    return assetId;
  }
}
