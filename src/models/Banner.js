import mongoose, { Schema } from 'mongoose';
const sanitizeRequiredString = (value) => {
    if (typeof value !== 'string')
        return '';
    return value.trim();
};
const BannerSchema = new Schema({
    imageUrl: {
        type: String,
        required: [true, 'La imagen es obligatoria.'],
        set: sanitizeRequiredString,
        validate: {
            validator: (value) => value.trim().length > 0,
            message: 'La imagen es obligatoria.',
        },
    },
}, {
    timestamps: true,
});
BannerSchema.index({ createdAt: -1 });
const Banner = mongoose.models.Banner || mongoose.model('Banner', BannerSchema);
export default Banner;
