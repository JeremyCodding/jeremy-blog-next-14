import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { intl } from '@/config/intl';

export default getRequestConfig(async ({ locale }) => {
    if (!intl.locales.includes(locale!)) notFound();

    return {
        messages: (await import(`../langs/${locale}.json`)).default
    };
});