import React from 'react';
import { Property, PropertyStatus } from '../types';
import { Icons } from './icons';

interface PropertyCardProps {
    property: Property;
    onDragStart: (e: React.DragEvent, id: string) => void;
    onClick: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onDragStart, onClick }) => {
    const getStatusColor = (status: PropertyStatus) => {
        switch (status) {
            case PropertyStatus.AVAILABLE: return 'bg-green-100 text-green-800';
            case PropertyStatus.RESERVED: return 'bg-yellow-100 text-yellow-800';
            case PropertyStatus.RENTED: return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, property.id)}
            onClick={() => onClick(property)}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-shadow mb-3"
        >
            <div className="relative mb-3">
                <div className="h-32 bg-gray-200 rounded-md overflow-hidden">
                    {property.images && property.images.length > 0 ? (
                        <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Icons.Building className="w-12 h-12" />
                        </div>
                    )}
                </div>
                <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                    {property.status}
                </span>
            </div>

            <h3 className="font-semibold text-gray-900 mb-1">{property.title}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-1 mb-2">
                <Icons.MapPin className="w-3 h-3" />
                {property.address}
            </p>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <span className="font-bold text-blue-600">
                    {formatCurrency(property.value)}
                </span>
                <div className="flex gap-2 text-xs text-gray-500">
                    {property.features?.slice(0, 2).map((feature, idx) => (
                        <span key={idx} className="bg-gray-50 px-2 py-1 rounded">
                            {feature}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};
