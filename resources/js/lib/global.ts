export const currencyFormatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
});
export const dateFormatter = new Intl.DateTimeFormat('en-UK', {
    dateStyle: 'short',
    timeStyle: 'short',
});
export const titleCaseToSnakeCase = (title: string): string => {
    return title
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, '');
};
