import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { PropertyKanban } from './components/PropertyKanban';
import { EntityForm } from './components/EntityForm';
import { Icons } from './components/icons';
import type {
  User,
  Owner,
  Property,
  Tenant
} from './types';
import { PropertyStatus } from './types';
import {
  ADMIN_USER,
  MOCK_OWNERS,
  MOCK_PROPERTIES,
  MOCK_TENANTS,
  initializeData
} from './services/mockData';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';

function App() {
  // State: Auth
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginCreds, setLoginCreds] = useState({ username: '', password: '' });

  // State: Data
  const [properties, setProperties] = useState<Property[]>([]);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [users] = useState<User[]>([ADMIN_USER]);

  // State: UI
  const [currentView, setCurrentView] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'property' | 'owner' | 'tenant' | 'settings' | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Initialize Data
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }

    // Load mock data
    initializeData();
    setProperties(MOCK_PROPERTIES);
    setOwners(MOCK_OWNERS);
    setTenants(MOCK_TENANTS);
  }, []);

  // Auth Handlers
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginCreds.username === 'vendoideias' && loginCreds.password === 'vendo1010') {
      loginUser(ADMIN_USER);
    } else {
      const foundUser = users.find(u => u.email === loginCreds.username); // Simple mock check
      if (foundUser) {
        loginUser(foundUser);
      } else {
        alert('Credenciais inválidas');
      }
    }
  };

  const loginUser = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    if (user.preferences?.appIconUrl) {
      updateAppIcon(user.preferences.appIconUrl);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setLoginCreds({ username: '', password: '' });
  };

  const handleGoogleLogin = () => {
    const googleUser: User = {
      id: `google_${Date.now()}`,
      name: 'Usuário Google',
      email: 'google@exemplo.com',
      role: 'user',
      photoUrl: 'https://ui-avatars.com/api/?name=Google+User&background=random'
    };
    loginUser(googleUser);
  };

  const updateAppIcon = (url: string) => {
    const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    if (link) link.href = url;
  };

  // CRUD Handlers
  const handleCreate = (type: 'property' | 'owner' | 'tenant') => {
    setModalType(type);
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: any, type: 'property' | 'owner' | 'tenant') => {
    setModalType(type);
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (data: any) => {
    if (modalType === 'property') {
      if (editingItem) {
        setProperties(prev => prev.map(p => p.id === editingItem.id ? { ...data, id: p.id } : p));
      } else {
        setProperties(prev => [...prev, { ...data, id: `prop_${Date.now()}` }]);
      }
    } else if (modalType === 'owner') {
      if (editingItem) {
        setOwners(prev => prev.map(o => o.id === editingItem.id ? { ...data, id: o.id } : o));
      } else {
        setOwners(prev => [...prev, { ...data, id: `own_${Date.now()}` }]);
      }
    } else if (modalType === 'tenant') {
      if (editingItem) {
        setTenants(prev => prev.map(t => t.id === editingItem.id ? { ...data, id: t.id } : t));
      } else {
        setTenants(prev => [...prev, { ...data, id: `ten_${Date.now()}` }]);
      }
    } else if (modalType === 'settings') {
      const updatedUser = { ...currentUser!, ...data };
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      if (data.preferences?.appIconUrl) {
        updateAppIcon(data.preferences.appIconUrl);
      }
    }
    setIsModalOpen(false);
  };

  const handleStatusChange = (propertyId: string, newStatus: PropertyStatus) => {
    setProperties(prev => prev.map(p => {
      if (p.id === propertyId) {
        return { ...p, status: newStatus };
      }
      return p;
    }));
  };

  // Export Handlers
  const exportToPDF = (property: Property) => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text(property.title, 20, 20);

    doc.setFontSize(12);
    doc.text(`Endereço: ${property.address}`, 20, 35);
    doc.text(`Tipo: ${property.type}`, 20, 45);
    doc.text(`Status: ${property.status}`, 20, 55);
    doc.text(`Valor: R$ ${property.value}`, 20, 65);

    if (property.features && property.features.length > 0) {
      doc.text('Características:', 20, 80);
      property.features.forEach((feature, index) => {
        doc.text(`- ${feature}`, 25, 90 + (index * 10));
      });
    }

    doc.save(`${property.title.replace(/\s+/g, '_')}_ficha.pdf`);
  };

  const exportDocumentsAsZip = async (tenant: Tenant) => {
    const zip = new JSZip();

    // Create a folder for the tenant
    const folder = zip.folder(tenant.name.replace(/\s+/g, '_'));

    if (folder) {
      // Add dummy documents
      folder.file("contrato.txt", `Contrato de Locação\nInquilino: ${tenant.name}\nCPF: ${tenant.cpf}`);
      folder.file("vistoria.txt", "Relatório de Vistoria Inicial\nStatus: OK");
      folder.file("recibo_caucao.txt", "Recibo de Pagamento de Caução");

      // Generate and download
      const content = await zip.generateAsync({ type: "blob" });
      const url = window.URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${tenant.name.replace(/\s+/g, '_')}_docs.zip`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  // Render Content
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
              <Icons.Building className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Vendo Ideias Imóveis</h1>
            <p className="text-gray-500">Faça login para acessar o sistema</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Usuário / Email</label>
              <input
                type="text"
                value={loginCreds.username}
                onChange={e => setLoginCreds({ ...loginCreds, username: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="vendoideias"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <input
                type="password"
                value={loginCreds.password}
                onChange={e => setLoginCreds({ ...loginCreds, password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="vendo1010"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Entrar
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Ou continue com</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGoogleLogin}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <Icons.Google className="w-5 h-5" />
                <span className="ml-2">Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        currentUser={currentUser}
        currentView={currentView}
        onNavigate={setCurrentView}
        onLogout={handleLogout}
        onOpenSettings={() => {
          setModalType('settings');
          setEditingItem(currentUser);
          setIsModalOpen(true);
        }}
      />

      <main className="flex-1 overflow-hidden flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            {currentView === 'dashboard' && 'Dashboard'}
            {currentView === 'properties' && 'Imóveis'}
            {currentView === 'owners' && 'Proprietários'}
            {currentView === 'tenants' && 'Inquilinos'}
            {currentView === 'users' && 'Usuários'}
          </h2>

          {currentView !== 'dashboard' && currentView !== 'users' && (
            <button
              onClick={() => handleCreate(currentView === 'properties' ? 'property' : currentView === 'owners' ? 'owner' : 'tenant')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Icons.Plus className="w-4 h-4" />
              Novo {currentView === 'properties' ? 'Imóvel' : currentView === 'owners' ? 'Proprietário' : 'Inquilino'}
            </button>
          )}
        </header>

        <div className="flex-1 overflow-auto p-6">
          {currentView === 'dashboard' && (
            <div className="h-full">
              <PropertyKanban
                properties={properties}
                onStatusChange={handleStatusChange}
                onPropertyClick={(p) => handleEdit(p, 'property')}
              />
            </div>
          )}

          {currentView === 'properties' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map(property => (
                <div key={property.id} className="relative group">
                  <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <button
                      onClick={() => exportToPDF(property)}
                      className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                      title="Exportar PDF"
                    >
                      <Icons.Calendar className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleEdit(property, 'property')}
                      className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                      title="Editar"
                    >
                      <Icons.Edit className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  {/* Reuse PropertyCard but disable drag here if desired, or keep it */}
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="font-bold">{property.title}</h3>
                    <p className="text-gray-500">{property.address}</p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-blue-600 font-bold">R$ {property.value}</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">{property.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {currentView === 'owners' && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {owners.map(owner => (
                    <tr key={owner.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{owner.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{owner.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{owner.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleEdit(owner, 'owner')} className="text-blue-600 hover:text-blue-900">Editar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {currentView === 'tenants' && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tenants.map(tenant => (
                    <tr key={tenant.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{tenant.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{tenant.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{tenant.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-3">
                        <button onClick={() => exportDocumentsAsZip(tenant)} className="text-green-600 hover:text-green-900 flex items-center gap-1">
                          <Icons.DollarSign className="w-4 h-4" /> Docs
                        </button>
                        <button onClick={() => handleEdit(tenant, 'tenant')} className="text-blue-600 hover:text-blue-900">Editar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            {modalType === 'settings' ? (
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleFormSubmit({
                  name: formData.get('name'),
                  email: formData.get('email'),
                  photoUrl: formData.get('photoUrl'),
                  preferences: {
                    appIconUrl: formData.get('appIconUrl')
                  }
                });
              }} className="space-y-4">
                <h2 className="text-xl font-bold mb-4">Configurações de Perfil</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nome</label>
                  <input name="name" defaultValue={currentUser.name} className="w-full border rounded p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input name="email" defaultValue={currentUser.email} className="w-full border rounded p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Foto URL</label>
                  <input name="photoUrl" defaultValue={currentUser.photoUrl} className="w-full border rounded p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ícone do App (URL)</label>
                  <input name="appIconUrl" defaultValue={currentUser.preferences?.appIconUrl} className="w-full border rounded p-2" />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded">Cancelar</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Salvar</button>
                </div>
              </form>
            ) : (
              <EntityForm
                type={modalType as any}
                initialData={editingItem}
                owners={owners}
                onSubmit={handleFormSubmit}
                onCancel={() => setIsModalOpen(false)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
