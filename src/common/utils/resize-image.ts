import { Injectable, InternalServerErrorException } from '@nestjs/common';
import sharp from 'sharp';

type ThumbnailSet = {
  large: Buffer;
  medium: Buffer;
  small: Buffer;
  contentType: string;
};

@Injectable()
export class ResizeImageService {
  async createThumbnails(
    imageBuffer: Buffer,
    mimeType: string,
  ): Promise<ThumbnailSet> {
    try {
      const pipeline = sharp(imageBuffer).rotate();
      const outputFormat = this.resolveOutputFormat(mimeType);

      const large = await pipeline
        .clone()
        .resize({
          width: 1600,
          height: 1600,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .toFormat(outputFormat, { quality: 82 })
        .toBuffer();
      const medium = await pipeline
        .clone()
        .resize({
          width: 900,
          height: 900,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .toFormat(outputFormat, { quality: 80 })
        .toBuffer();
      const small = await pipeline
        .clone()
        .resize({
          width: 480,
          height: 480,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .toFormat(outputFormat, { quality: 76 })
        .toBuffer();

      return {
        large,
        medium,
        small,
        contentType: outputFormat === 'png' ? 'image/png' : 'image/jpeg',
      };
    } catch {
      throw new InternalServerErrorException(
        'Failed to generate image thumbnails',
      );
    }
  }

  private resolveOutputFormat(mimeType: string): 'jpeg' | 'png' {
    return mimeType === 'image/png' ? 'png' : 'jpeg';
  }
}
