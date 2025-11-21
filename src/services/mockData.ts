import type { Owner, Property, Tenant, User } from '../types';
import { PropertyStatus, PropertyType } from '../types';

export const ADMIN_USER: User = {
    id: 'admin-master',
    name: 'Admin Principal',
    email: 'admin@vendoideias.com',
    role: 'admin',
    photoUrl: 'https://ui-avatars.com/api/?name=Admin+Principal&background=0D8ABC&color=fff',
};

export const MOCK_OWNERS: Owner[] = [
    {
        id: 'own_1',
        name: 'Carlos Silva',
        email: 'carlos@email.com',
        phone: '(11) 99999-1111',
        cpf: '111.111.111-11',
        properties: [],
    },
    {
        id: 'own_2',
        name: 'Mariana Souza',
        email: 'mariana@email.com',
        phone: '(21) 98888-2222',
        cpf: '222.222.222-22',
        properties: [],
    },
];

export const MOCK_PROPERTIES: Property[] = [
    {
        id: 'prop_1',
        title: 'Apartamento Jardins',
        address: 'Rua Oscar Freire, 100 - SP',
        type: PropertyType.APARTMENT,
        status: PropertyStatus.AVAILABLE,
        value: 4500,
        ownerId: 'own_1',
        features: ['2 Quartos', '1 Suíte', '2 Vagas'],
    },
    {
        id: 'prop_2',
        title: 'Casa Barra da Tijuca',
        address: 'Av. das Américas, 5000 - RJ',
        type: PropertyType.HOUSE,
        status: PropertyStatus.RENTED,
        value: 8500,
        ownerId: 'own_2',
        tenantId: 'ten_1',
        features: ['4 Quartos', 'Piscina', 'Churrasqueira'],
    },
    {
        id: 'prop_3',
        title: 'Sala Comercial Centro',
        address: 'Av. Paulista, 1000 - SP',
        type: PropertyType.COMMERCIAL,
        status: PropertyStatus.RESERVED,
        value: 2500,
        ownerId: 'own_1',
        features: ['40m²', 'Ar Condicionado'],
    },
];

export const MOCK_TENANTS: Tenant[] = [
    {
        id: 'ten_1',
        name: 'Roberto Almeida',
        email: 'roberto@email.com',
        phone: '(21) 97777-3333',
        cpf: '333.333.333-33',
        rentedPropertyId: 'prop_2',
    },
    {
        id: 'ten_2',
        name: 'Fernanda Costa',
        email: 'fernanda@email.com',
        phone: '(11) 96666-4444',
        cpf: '444.444.444-44',
    },
];

// Logic to link relationships
export const initializeData = () => {
    // Link Owners to Properties
    MOCK_PROPERTIES.forEach(prop => {
        const owner = MOCK_OWNERS.find(o => o.id === prop.ownerId);
        if (owner) {
            if (!owner.properties) owner.properties = [];
            if (!owner.properties.includes(prop.id)) {
                owner.properties.push(prop.id);
            }
        }
    });

    // Ensure consistency for Rented properties
    MOCK_TENANTS.forEach(tenant => {
        if (tenant.rentedPropertyId) {
            const prop = MOCK_PROPERTIES.find(p => p.id === tenant.rentedPropertyId);
            if (prop) {
                prop.status = PropertyStatus.RENTED;
                prop.tenantId = tenant.id;
            }
        }
    });
};

// Run initialization
initializeData();
