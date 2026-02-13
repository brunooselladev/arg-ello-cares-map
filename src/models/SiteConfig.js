import mongoose, { Schema } from 'mongoose';
const sanitizeColor = (value) => {
    if (typeof value !== 'string')
        return '#2d8f78';
    const color = value.trim();
    if (/^#(?:[0-9a-fA-F]{3}){1,2}$/.test(color))
        return color;
    return '#2d8f78';
};
const SiteConfigSchema = new Schema({
    primaryColor: {
        type: String,
        required: [true, 'El color primario es obligatorio.'],
        default: '#2d8f78',
        set: sanitizeColor,
    },
}, {
    timestamps: true,
});
const SiteConfig = mongoose.models.SiteConfig || mongoose.model('SiteConfig', SiteConfigSchema);
export default SiteConfig;
