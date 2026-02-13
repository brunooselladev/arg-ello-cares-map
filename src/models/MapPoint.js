import mongoose from 'mongoose';

export const mapPointTypes = ['nodo', 'centro_escucha', 'comunidad_practicas'];

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
    address: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      default: null,
    },
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
