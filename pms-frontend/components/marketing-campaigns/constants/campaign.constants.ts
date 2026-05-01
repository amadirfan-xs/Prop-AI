import * as Yup from 'yup';

export const CampaignSchema = Yup.object().shape({
    name: Yup.string()
        .min(3, 'Campaign name is too short')
        .required('Campaign name is required'),
    propertyId: Yup.string()
        .required('Please select a property'),
    emailConfigId: Yup.string()
        .required('Please select an email app to send from'),
    subject: Yup.string()
        .required('Subject line is required'),
    content: Yup.string()
        .min(10, 'Email content is too short')
        .required('Email content is required'),
    recipients: Yup.array().of(Yup.string().email('Invalid email')).min(1, 'Please add at least one recipient'),
    scheduleType: Yup.string().oneOf(['now', 'later']),
    scheduledAt: Yup.string().nullable().when('scheduleType', {
        is: 'later',
        then: (schema) => schema.required('Please select a date and time for scheduled launch'),
        otherwise: (schema) => schema.nullable()
    })
});

export const INITIAL_CAMPAIGN_VALUES = {
    name: "Luxury Collection Launch",
    propertyId: "",
    emailConfigId: "",
    subject: "Experience the height of luxury at {property_name}",
    content:
        "<p>Hi there,</p><p>We are excited to present <strong>{property_name}</strong>. This architectural masterpiece offers unparalleled views and premium finishes throughout.</p><p>Would you like to schedule a private viewing?</p>",
    scheduledAt: null,
    scheduleType: 'now',
    recipients: [] as string[],
};
