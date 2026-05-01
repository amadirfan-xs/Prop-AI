import * as Yup from 'yup';
import { SOCIAL_MEDIA_PLATFORMS } from '@/constants/properties';
import { SocialPostFormValues, SocialPlatform } from '@/types/social';

export const socialPostSchema = Yup.object().shape({
    content: Yup.string().required('Post content is required').max(5000, 'Content too long'),
    strategy: Yup.string().oneOf(['now', 'later']).required(),
    targets: Yup.array().of(
        Yup.object().shape({
            platform: Yup.string().required(),
            socialDestinationId: Yup.number().nullable(),
            scheduleDate: Yup.string().when('strategy', {
                is: 'later',
                then: (schema) => schema.required('Date is required'),
                otherwise: (schema) => schema.optional()
            }),
            scheduleTime: Yup.string().when('strategy', {
                is: 'later',
                then: (schema) => schema.required('Time is required'),
                otherwise: (schema) => schema.optional()
            })
        })
    ).min(1, 'Select at least one platform and schedule')
});

export const getSocialPostInitialValues = (
    propertyTitle: string = '', 
    propertyDescription: string = ''
): SocialPostFormValues => {
    const now = new Date();
    const defaultDate = now.toISOString().split('T')[0];
    const defaultTime = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    return {
        platforms: SOCIAL_MEDIA_PLATFORMS.map(p => ({ 
            id: p.id as SocialPlatform,
            name: p.name,
            handle: p.handle,
            icon: p.icon,
            isSelected: p.id === 'facebook'
        })),
        content: propertyDescription || `Check out this stunning new listing: ${propertyTitle}! \uD83C\uDFE0 #RealEstate #NewHome`,
        strategy: 'now',
        applyToAll: false,
        targets: [
            { 
                platform: 'facebook', 
                socialDestinationId: null as any, 
                scheduleDate: defaultDate, 
                scheduleTime: defaultTime 
            }
        ]
    };
};
