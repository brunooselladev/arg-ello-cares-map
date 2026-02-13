import mongoose, { Schema } from 'mongoose';
export const newsCategories = ['nodos', 'campanas', 'centros', 'comunidad'];
const sanitizeRequiredString = (value) => {
    if (typeof value !== 'string')
        return '';
    return value.trim();
};
const sanitizeOptionalString = (value) => {
    if (typeof value !== 'string')
        return null;
    const sanitized = value.trim();
    return sanitized.length > 0 ? sanitized : null;
};
const sanitizeTags = (value) => {
    if (value === null || value === undefined)
        return null;
    if (!Array.isArray(value))
        return null;
    const sanitized = value
        .map((item) => (typeof item === 'string' ? item.trim() : ''))
        .filter(Boolean);
    return sanitized.length > 0 ? sanitized : null;
};
const nonEmptyValidator = {
    validator: (value) => typeof value === 'string' && value.trim().length > 0,
    message: 'Este campo no puede estar vacio.',
};
const NewsSchema = new Schema({
    title: {
        type: String,
        required: [true, 'El titulo es obligatorio.'],
        set: sanitizeRequiredString,
        validate: nonEmptyValidator,
    },
    content: {
        type: String,
        required: [true, 'El contenido es obligatorio.'],
        set: sanitizeRequiredString,
        validate: nonEmptyValidator,
    },
    summary: {
        type: String,
        required: [true, 'El resumen es obligatorio.'],
        set: sanitizeRequiredString,
        validate: nonEmptyValidator,
    },
    image: {
        type: String,
        default: null,
        set: sanitizeOptionalString,
    },
    category: {
        type: String,
        enum: {
            values: newsCategories,
            message: 'La categoria "{VALUE}" no es valida.',
        },
        required: [true, 'La categoria es obligatoria.'],
    },
    videoUrl: {
        type: String,
        default: null,
        set: sanitizeOptionalString,
    },
    date: {
        type: Date,
        default: null,
    },
    author: {
        type: String,
        default: null,
        set: sanitizeOptionalString,
    },
    tags: {
        type: [String],
        default: null,
        set: sanitizeTags,
    },
    visible: {
        type: Boolean,
        default: true,
    },
    excerpt: {
        type: String,
        default: null,
        set: sanitizeOptionalString,
    },
    imageUrl: {
        type: String,
        default: null,
        set: sanitizeOptionalString,
    },
    imageCaption: {
        type: String,
        default: null,
        set: sanitizeOptionalString,
    },
    section: {
        type: String,
        default: null,
        set: sanitizeOptionalString,
    },
    isVisible: {
        type: Boolean,
        default: null,
    },
    publishedAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});
NewsSchema.index({ category: 1, date: -1 });
NewsSchema.index({ visible: 1, date: -1 });
const News = mongoose.models.News || mongoose.model('News', NewsSchema);
export default News;
