import useSWR from 'swr';

export const useAuth = () => {
    const { data, isValidating, ...otherResults } = useSWR('auth', () => {
        // fake auth user
        return localStorage.getItem('token');
    });

    return {
        isLoggedIn: Boolean(data) && !isValidating,
        isValidating,
        ...otherResults,
    };
};
