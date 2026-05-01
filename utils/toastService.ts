import toast from 'react-hot-toast';

export const toastService = {
    success: (message: string) => {
        toast.success(message);
    },
    error: (message: string) => {
        toast.error(message, {
            style: {
                background: '#ffdad6',
                color: '#93000a',
                border: '1px solid rgba(186, 26, 26, 0.1)',
                fontWeight: 500,
                fontSize: '0.875rem',
                fontFamily: 'Inter, sans-serif'
            },
            iconTheme: {
                primary: '#ba1a1a',
                secondary: '#ffdad6',
            },
            duration: 5000,
        });
    },
    info: (message: string) => {
        toast(message);
    },
    loading: (message: string) => {
        return toast.loading(message);
    },
    dismiss: (id?: string) => {
        toast.dismiss(id);
    }
};
