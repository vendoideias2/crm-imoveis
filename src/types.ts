export type Role = 'admin' | 'user';

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    photoUrl?: string;
    preferences?: {
        appIconUrl?: string;
    };
}

export enum PropertyStatus {
    AVAILABLE = 'AVAILABLE',
    RENTED = 'RENTED',
    RESERVED = 'RESERVED',
}

export enum PropertyType {
    APARTMENT = 'Apartamento',
    HOUSE = 'Casa',
    COMMERCIAL = 'Comercial',
    LAND = 'Terreno',
}

export interface Owner {
    id: string;
    name: string;
    email: string;
    phone: string;
    cpf: string;
    properties?: string[]; // IDs of properties
}

export interface Tenant {
    id: string;
    name: string;
    email: string;
    phone: string;
    cpf: string;
    rentedPropertyId?: string;
}

export interface Property {
    id: string;
    title: string;
    address: string;
    type: PropertyType;
    status: PropertyStatus;
    value: number;
    ownerId: string;
    tenantId?: string;
    description?: string;
    features?: string[];
    images?: string[];
}

export interface Inspection {
    id: string;
    propertyId: string;
    date: string;
    status: 'pending' | 'completed';
    notes?: string;
}
