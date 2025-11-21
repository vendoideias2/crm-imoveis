import React from 'react';
import { Property, PropertyStatus } from '../types';
import { PropertyCard } from './PropertyCard';

interface PropertyKanbanProps {
    properties: Property[];
    onStatusChange: (propertyId: string, newStatus: PropertyStatus) => void;
    onPropertyClick: (property: Property) => void;
}

export const PropertyKanban: React.FC<PropertyKanbanProps> = ({
    properties,
    onStatusChange,
    onPropertyClick
}) => {
    const columns = [
        { id: PropertyStatus.AVAILABLE, title: 'Disponível', color: 'border-green-500' },
        { id: PropertyStatus.RESERVED, title: 'Reservado', color: 'border-yellow-500' },
        { id: PropertyStatus.RENTED, title: 'Alugado', color: 'border-blue-500' },
    ];

    const handleDragStart = (e: React.DragEvent, id: string) => {
        e.dataTransfer.setData('propertyId', id);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, status: PropertyStatus) => {
        e.preventDefault();
        const propertyId = e.dataTransfer.getData('propertyId');
        if (propertyId) {
            onStatusChange(propertyId, status);
        }
    };

    return (
        <div className="flex gap-6 h-full overflow-x-auto pb-4">
            {columns.map((column) => (
                <div
                    key={column.id}
                    className="flex-1 min-w-[300px] bg-gray-50 rounded-xl p-4 flex flex-col"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, column.id)}
                >
                    <div className={`flex items-center justify-between mb-4 pb-2 border-b-2 ${column.color}`}>
                        <h2 className="font-semibold text-gray-700">{column.title}</h2>
                        <span className="bg-white px-2 py-1 rounded-full text-sm text-gray-500 font-medium shadow-sm">
                            {properties.filter(p => p.status === column.id).length}
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3">
                        {properties
                            .filter(p => p.status === column.id)
                            .map(property => (
                                <PropertyCard
                                    key={property.id}
                                    property={property}
                                    onDragStart={handleDragStart}
                                    onClick={onPropertyClick}
                                />
                            ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
