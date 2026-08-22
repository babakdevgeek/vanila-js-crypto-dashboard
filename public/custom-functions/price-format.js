export function price_decimals(value) {
    const amount = Math.abs(Number(value));
    if (!Number.isFinite(amount) || amount === 0 || amount >= 0.01) return 8;

    // Preserve two significant digits after the first non-zero decimal place.
    return Math.min(16, Math.max(8, Math.ceil(-Math.log10(amount)) + 2));
}

export function format_price(value, options = {}) {
    return format_number(value, {
        max_decimals: price_decimals(value),
        ...options
    });
}
