import { useState, useCallback } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import apiClient from '../networking/apiClient';
import { ApiResponse, ApiErrorResponse } from '../types';

interface ApiState<T> {
    data: T | null;
    error: string | null;
    loading: boolean;
}
interface UseApiReturn<T, D = any> extends ApiState<T> {
    callApi: (config?: AxiosRequestConfig<D>, options?: { showLoading?: boolean }) => Promise<T | null>;
    reset: () => void;
}

export const useApi = <T, D = any>(
    initialConfig?: AxiosRequestConfig<D>
): UseApiReturn<T, D> => {
    const [state, setState] = useState<ApiState<T>>({
        data: null,
        error: null,
        loading: false,
    });

    const callApi = useCallback(
        async (overrideConfig?: AxiosRequestConfig<D>, options?: { showLoading?: boolean }): Promise<T | null> => {
            const showLoading = options?.showLoading ?? true;
            if (showLoading) {
                setState((prev) => ({ ...prev, loading: true, error: null }));
            }

            try {
                const config = { ...initialConfig, ...overrideConfig };
                const response = await apiClient.request<ApiResponse<T>>(config);

                // Extract the data field from our standardized response
                const resultData = response.data.data;

                setState({
                    data: resultData,
                    loading: false,
                    error: null,
                });

                return resultData;
            } catch (err) {
                let errorMessage = 'An unexpected error occurred';

                if (axios.isAxiosError(err)) {
                    const errorData = err.response?.data as ApiErrorResponse;
                    errorMessage = errorData?.message || err.message;
                } else if (err instanceof Error) {
                    errorMessage = err.message;
                }

                setState({
                    data: null,
                    loading: false,
                    error: errorMessage,
                });

                return null;
            }
        },
        [initialConfig]
    );

    const reset = useCallback(() => {
        setState({
            data: null,
            error: null,
            loading: false,
        });
    }, []);

    return {
        ...state,
        callApi,
        reset,
    };
};

export default useApi;
