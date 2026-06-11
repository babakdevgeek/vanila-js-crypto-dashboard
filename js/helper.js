export function toPersian(string) {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(string).replace(/\d/g, (digit) => persianDigits[digit]);
}