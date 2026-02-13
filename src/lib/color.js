const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
export function hexToHslChannels(hexColor) {
    const normalized = hexColor.trim().replace('#', '');
    if (![3, 6].includes(normalized.length))
        return null;
    const expanded = normalized.length === 3
        ? normalized
            .split('')
            .map((char) => `${char}${char}`)
            .join('')
        : normalized;
    const r = parseInt(expanded.slice(0, 2), 16) / 255;
    const g = parseInt(expanded.slice(2, 4), 16) / 255;
    const b = parseInt(expanded.slice(4, 6), 16) / 255;
    if ([r, g, b].some((channel) => Number.isNaN(channel)))
        return null;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            default:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }
    const hue = Math.round(clamp(h * 360, 0, 360));
    const saturation = Math.round(clamp(s * 100, 0, 100));
    const lightness = Math.round(clamp(l * 100, 0, 100));
    return `${hue} ${saturation}% ${lightness}%`;
}
