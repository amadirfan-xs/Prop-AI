import * as Yup from 'yup';
import { InviteStakeholderFormValues } from '@/types/stakeholder';

export const stakeholderInitialValues: InviteStakeholderFormValues = {
    name: '',
    email: '',
    role: 'buyer',
};

export const stakeholderSchema = Yup.object().shape({
    name: Yup.string().required('Full name is required').max(150, 'Name too long'),
    email: Yup.string().email('Invalid email address').required('Email is required').max(255, 'Email too long'),
    role: Yup.string().oneOf(['buyer', 'seller']).required('Role is required'),
});
