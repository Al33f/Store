export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Store';
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'A modern store application built with Next.js and React.';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
export const LATEST_PRODUCTS_LIMIT = Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;

export const SignInDefaultValues = {
    email: 'john@example.com',
    password: '123456'
};

export const SignUpDefaultValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
};
