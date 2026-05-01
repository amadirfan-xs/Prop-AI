import * as Yup from 'yup';

export const OrganizationSchema = Yup.object().shape({
    // Brokerage Info
    name: Yup.string()
        .min(2, 'Too Short!')
        .max(100, 'Too Long!')
        .required('Brokerage Name is required'),
    taxId: Yup.string().nullable(),
    headquarters: Yup.string().nullable(),
    companyDescription: Yup.string().max(1000, 'Description too long').nullable(),
    privacyPolicy: Yup.string().nullable(),
    isAuthorizedSigner: Yup.boolean().oneOf([true], 'You must be an authorized signer'),

    // Contact Info
    contactName: Yup.string().required('Full Name is required'),
    contactEmail: Yup.string().email('Invalid email').required('Email is required'),
    contactPhone: Yup.string().required('Phone number is required'),
    contactJobTitle: Yup.string().required('Job title is required'),

    // Capacity Info
    numAgents: Yup.number().min(0).nullable(),
    numListings: Yup.number().min(0).nullable(),

    // Branding Info
    logoUrl: Yup.string().nullable(),
    primaryColor: Yup.string().nullable(),
    websiteUrl: Yup.string().url('Invalid URL').nullable(),

    // Notes
    additionalNotes: Yup.string().nullable(),
});

export const INITIAL_ORG_VALUES = {
    name: '',
    taxId: '',
    headquarters: '',
    companyDescription: '',
    privacyPolicy: '',
    isAuthorizedSigner: false,

    contactName: '',
    contactEmail: '',
    contactPhone: '',
    contactJobTitle: '',

    numAgents: 0,
    numListings: 0,

    logoUrl: '',
    primaryColor: '#3525CD',
    websiteUrl: '',

    additionalNotes: '',
};

export const ORG_LABELS = {
    PROFILE: {
        TITLE: 'Organization Profile',
        SUBTITLE: 'Your organizational status and lead request details.',
    }
};
