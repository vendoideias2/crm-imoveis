import React, { useState, useEffect } from 'react';
import { Owner, Property, PropertyType, Tenant, PropertyStatus } from '../types';
import { Icons } from './icons';

interface EntityFormProps {
    type: 'property' | 'owner' | 'tenant';
    initialData?: any;
    owners?: Owner[];
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

export const EntityForm: React.FC<EntityFormProps> = ({
    type,
    initialData,
    owners = [],
    onSubmit,
    onCancel
}) => {
    const [formData, setFormData] = useState<any>(initialData || {});

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            // Set defaults
            if (type === 'property') {
                setFormData({
                    type: PropertyType.APARTMENT,
                    status: PropertyStatus.AVAILABLE,
                    features: [],
                    images: []
                });
            }
        }
    }, [initialData, type]);

    const handleChange = (field: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const renderOwnerTenantFields = () => (
        <>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                    <input
                        type="text"
                        required
                        value={formData.name || ''}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                    <input
                        type="text"
                        required
                        value={formData.cpf || ''}
                        onChange={(e) => handleChange('cpf', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        required
                        value={formData.email || ''}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                    <input
                        type="tel"
                        required
                        value={formData.phone || ''}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>
        </>
    );

    const renderPropertyFields = () => (
        <>
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                    <input
                        type="text"
                        required
                        value={formData.title || ''}
                        onChange={(e) => handleChange('title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                    <input
                        type="text"
                        required
                        value={formData.address || ''}
                        onChange={(e) => handleChange('address', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                    <select
                        value={formData.type || PropertyType.APARTMENT}
                        onChange={(e) => handleChange('type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                        {Object.values(PropertyType).map(t => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
                    <input
                        type="number"
                        required
                        value={formData.value || ''}
                        onChange={(e) => handleChange('value', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Proprietário</label>
                    <select
                        required
                        value={formData.ownerId || ''}
                        onChange={(e) => handleChange('ownerId', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Selecione...</option>
                        {owners.map(o => (
                            <option key={o.id} value={o.id}>{o.name}</option>
                        ))}
                    </select>
                </div>
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Características (separadas por vírgula)</label>
                    <input
                        type="text"
                        value={formData.features?.join(', ') || ''}
                        onChange={(e) => handleChange('features', e.target.value.split(',').map(s => s.trim()))}
                        placeholder="Ex: Piscina, 2 Quartos, Garagem"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>
        </>
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                    {initialData ? 'Editar' : 'Novo'} {type === 'property' ? 'Imóvel' : type === 'owner' ? 'Proprietário' : 'Inquilino'}
                </h2>
                <button type="button" onClick={onCancel} className="text-gray-400 hover:text-gray-500">
                    <Icons.X className="w-6 h-6" />
                </button>
            </div>

            {type === 'property' ? renderPropertyFields() : renderOwnerTenantFields()}

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                    Salvar
                </button>
            </div>
        </form>
    );
};
