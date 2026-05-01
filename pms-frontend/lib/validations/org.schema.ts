import * as Yup from 'yup';
import { AgentInvitationFormValues } from '@/types/org';

export const agentInitialValues: AgentInvitationFormValues = {
    fullName: '',
    email: '',
    phone: '',
    role: 'Senior Agent',
    office: 'Manhattan Flagship - New York',
    isAdmin: false,
};

export const agentSchema = Yup.object().shape({
    fullName: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    phone: Yup.string().optional(),
    role: Yup.string().optional(),
    office: Yup.string().optional(),
    isAdmin: Yup.boolean(),
});
