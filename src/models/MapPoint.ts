import { Schema, model, Document } from 'mongoose';

// --- Enums ---
const mapPointTypes = ['nodo', 'centro_escucha', 'comunidad_practicas'] as const;
export type MapPointType = typeof mapPointTypes[number];

// --- Interfaces ---
export interface IMapPoint extends Document {
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  pointType: MapPointType;
  address?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// --- Schema ---
const MapPointSchema = new Schema<IMapPoint>({
  name: { 
    type: String, 
    required: [true, 'El nombre es obligatorio.'] 
  },
  description: { 
    type: String 
  },
  latitude: { 
    type: Number, 
    required: [true, 'La latitud es obligatoria.'] 
  },
  longitude: { 
    type: Number, 
    required: [true, 'La longitud es obligatoria.'] 
  },
  pointType: {
    type: String,
    enum: {
      values: mapPointTypes,
      message: 'El tipo de punto "{VALUE}" no es válido.'
    },
    required: [true, 'El tipo de punto es obligatorio.']
  },
  address: { 
    type: String 
  },
  phone: { 
    type: String 
  },
  email: { 
    type: String 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
}, {
  timestamps: true // Esto añade createdAt y updatedAt automáticamente
});

// --- Índices ---
// Para mejorar el rendimiento de las consultas geoespaciales y los filtros
MapPointSchema.index({ pointType: 1 });
MapPointSchema.index({ isActive: 1 });

// --- Modelo ---
const MapPoint = model<IMapPoint>('MapPoint', MapPointSchema);

export default MapPoint;
