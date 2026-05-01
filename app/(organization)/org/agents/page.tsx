import React from 'react';
import AgentManagementContainer from '@/components/org-agents/AgentManagementContainer';

export const metadata = {
    title: 'Agent Management - PropertyFlow Enterprise',
    description: 'Manage and monitor your agents performance and status.',
};

export default function AgentsPage() {
    return <AgentManagementContainer />;
}
