/* eslint-disable @typescript-eslint/no-unused-vars */
import emailjs from 'emailjs-com';

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';
const USER_ID = process.env.NEXT_PUBLIC_EMAILJS_USER_ID || '';

// Función para enviar correos usando EmailJS
export const sendEmail = async (toEmail: string, username: string, password: string): Promise<boolean> => {
    try {
        const response = await emailjs.send(
            SERVICE_ID,
            TEMPLATE_ID,
            {
                to_email: toEmail,
                username,
                password,
            },
            USER_ID
        );

        return true; // Retorna true si el correo se envió correctamente
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        return false; // Retorna false si hubo un error
    }
};
