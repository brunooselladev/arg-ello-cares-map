import mongoose from 'mongoose';

export const mapPointTypes = ['nodo', 'centro_escucha', 'comunidad_practicas'];

const ActivitySchema = new mongoose.Schema(
  {
    name: { type: String, default: null },
    activity_type: { type: String, enum: ['principal', 'secundaria'], default: 'principal' },
    description: { type: String, default: null },
    schedule: { type: String, default: null },
    confirmation: { type: String, default: null },
    confirmation_other: { type: String, default: null },
  },
  { _id: false },
);

const MapPointSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio.'],
    },
    description: {
      type: String,
      default: null,
    },
    latitude: {
      type: Number,
      required: [true, 'La latitud es obligatoria.'],
    },
    longitude: {
      type: Number,
      required: [true, 'La longitud es obligatoria.'],
    },
    pointType: {
      type: String,
      enum: {
        values: mapPointTypes,
        message: 'El tipo de punto "{VALUE}" no es valido.',
      },
      required: [true, 'El tipo de punto es obligatorio.'],
    },
    address: { type: String, default: null },
    barrio: { type: String, default: null },
    phone: { type: String, default: null },
    email: { type: String, default: null },
    responsible: { type: String, default: null },
    organizationTypes: { type: [String], default: [] },
    targetPopulations: { type: [String], default: [] },
    hasInternet: { type: Boolean, default: null },
    hasDevice: { type: Boolean, default: null },
    activities: { type: [ActivitySchema], default: [] },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

MapPointSchema.index({ pointType: 1 });
MapPointSchema.index({ isActive: 1 });

const MapPoint = mongoose.models.MapPoint || mongoose.model('MapPoint', MapPointSchema);

export default MapPoint;
