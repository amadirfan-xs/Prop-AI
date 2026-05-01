import { AxiosRequestConfig } from 'axios';

export class ProfileService {
    static updateProfile(data: any): AxiosRequestConfig {
        return {
            url: '/api/profile',
            method: 'PATCH',
            data,
        };
    }

    static uploadAvatar(file: File): AxiosRequestConfig {
        const formData = new FormData();
        formData.append('file', file);
        return {
            url: '/api/profile/avatar',
            method: 'POST',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        };
    }
}

export default ProfileService;
