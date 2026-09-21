import React, { useState } from 'react';
import { 
  Package, 
  Layers, 
  AlertTriangle, 
  TrendingUp, 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Tag,
  CheckCircle,
  X,
  Boxes
} from 'lucide-react';
import { ProductItem, ProductType } from '../types';
import { formatCurrency } from '../utils/formatters';

interface WarehouseScreenProps {
  products: ProductItem[];
  onAddProduct: (product: ProductItem) => void;
  onUpdateStock: (id: string, delta: number) => void;
  onShowToast: (msg: string) => void;
}

export const WarehouseScreen: React.FC<WarehouseScreenProps> = ({
  products,
  onAddProduct,
  onUpdateStock,
  onShowToast
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('Tutte');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form Nuovo Prodotto
  const [formData, setFormData] = useState({
    sku: `MSW-ART-0${products.length + 10}`,
    name: '',
    category: 'Sviluppo Web' as ProductItem['category'],
    type: 'servizio' as ProductType,
    unit: 'ore' as ProductItem['unit'],
    costPrice: '',
    sellingPrice: '',
    stockQuantity: '10',
    minStockAlert: '3',
    description: ''
  });

  const categories = ['Tutte', 'Sviluppo Web', 'Design & UX', 'Hardware & Server', 'Marketing & SEO'];

  const filteredProducts = products.filter(prod => {
    if (categoryFilter !== 'Tutte' && prod.category !== categoryFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        prod.name.toLowerCase().includes(term) ||
        prod.sku.toLowerCase().includes(term) ||
        prod.description.toLowerCase().includes(term)
      );
    }
    return true;
  });

  // Metriche
  const totalStockValue = products.reduce((acc, p) => acc + (p.costPrice * p.stockQuantity), 0);
  const potentialRevenue = products.reduce((acc, p) => acc + (p.sellingPrice * p.stockQuantity), 0);
  const lowStockCount = products.filter(p => p.stockQuantity <= p.minStockAlert).length;
  const avgMargin = products.length > 0 
    ? Math.round(products.reduce((acc, p) => acc + (((p.sellingPrice - p.costPrice) / p.sellingPrice) * 100), 0) / products.length)
    : 0;

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.sellingPrice) {
      onShowToast('Compila almeno il nome e il prezzo di vendita.');
      return;
    }

    const newProd: ProductItem = {
      id: `prod-${Date.now()}`,
      sku: formData.sku,
      name: formData.name,
      category: formData.category,
      type: formData.type,
      unit: formData.unit,
      costPrice: parseFloat(formData.costPrice) || 0,
      sellingPrice: parseFloat(formData.sellingPrice) || 0,
      stockQuantity: parseInt(formData.stockQuantity) || 0,
      minStockAlert: parseInt(formData.minStockAlert) || 2,
      description: formData.description
    };

    onAddProduct(newProd);
    setIsAddModalOpen(false);
    onShowToast(`Articolo ${newProd.sku} inserito con successo nel catalogo!`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Intestazione */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Magazzino, Servizi & Catalogo Listini
            </h1>
            <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full border border-indigo-200">
              WMS Light
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Gestione articoli fisici, pacchetti di sviluppo, licenze software cloud e calcolo del margine reale.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nuovo Articolo / Servizio</span>
        </button>
      </div>

      {/* KPI Cards Magazzino */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Valore Magazzino a Costo</span>
          <div className="text-lg sm:text-xl font-bold text-slate-900 mt-1">{formatCurrency(totalStockValue)}</div>
          <span className="text-[11px] text-slate-400">Valore di carico effettivo</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-indigo-600">Valore Vendita Potenziale</span>
          <div className="text-lg sm:text-xl font-bold text-indigo-600 mt-1">{formatCurrency(potentialRevenue)}</div>
          <span className="text-[11px] text-slate-400">Totale listino a realizzo</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-emerald-600">Margine Medio Ricarico</span>
          <div className="text-lg sm:text-xl font-bold text-emerald-600 mt-1">+{avgMargin}%</div>
          <span className="text-[11px] text-slate-400">Redditività media catalogo</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-amber-600">Allerte Sotto-Scorta</span>
          <div className={`text-lg sm:text-xl font-bold mt-1 ${lowStockCount > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
            {lowStockCount} Articoli
          </div>
          <span className="text-[11px] text-slate-400">
            {lowStockCount > 0 ? 'Richiede riordino licenze/stock' : 'Scorte ottimali'}
          </span>
        </div>
      </div>

      {/* Barra Filtri Categorie & Ricerca */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                categoryFilter === cat 
                  ? 'bg-slate-900 text-white shadow-xs' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cerca per SKU, nome o tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-slate-900"
          />
        </div>
      </div>

      {/* Tabella Magazzino & Catalogo */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4">Codice SKU & Prodotto</th>
                <th className="py-3 px-4">Categoria & Tipologia</th>
                <th className="py-3 px-4">Giacenza Disponibile</th>
                <th className="py-3 px-4">Costo Acquisto</th>
                <th className="py-3 px-4">Prezzo Listino</th>
                <th className="py-3 px-4">Margine %</th>
                <th className="py-3 px-4 text-center">Giacenza +/-</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((prod) => {
                const marginPercent = Math.round(((prod.sellingPrice - prod.costPrice) / prod.sellingPrice) * 100);
                const isLowStock = prod.stockQuantity <= prod.minStockAlert;

                return (
                  <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          {prod.sku}
                        </span>
                        <span className="font-bold text-slate-900">{prod.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{prod.description}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-700">{prod.category}</div>
                      <span className="inline-block text-[10px] text-slate-500 uppercase tracking-wider">
                        {prod.type.replace('_', ' ')} • per {prod.unit}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${isLowStock ? 'text-rose-600' : 'text-slate-900'}`}>
                          {prod.stockQuantity} {prod.unit}
                        </span>
                        {isLowStock && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                            <AlertTriangle className="w-3 h-3" />
                            Sotto-scorta
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Soglia min: {prod.minStockAlert} {prod.unit}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-600">
                      {formatCurrency(prod.costPrice)}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {formatCurrency(prod.sellingPrice)}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded font-bold text-xs ${
                        marginPercent >= 60 ? 'bg-emerald-50 text-emerald-700' :
                        marginPercent >= 40 ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        +{marginPercent}%
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center border border-slate-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => {
                            if (prod.stockQuantity > 0) {
                              onUpdateStock(prod.id, -1);
                              onShowToast(`Scaricata 1 unità di ${prod.sku}`);
                            }
                          }}
                          className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 font-bold"
                          title="Scarica 1 unità"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-mono font-bold text-slate-900 bg-slate-50">
                          {prod.stockQuantity}
                        </span>
                        <button
                          onClick={() => {
                            onUpdateStock(prod.id, 1);
                            onShowToast(`Caricata 1 unità di ${prod.sku}`);
                          }}
                          className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 font-bold"
                          title="Carica 1 unità"
                        >
                          +
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Aggiungi Articolo / Servizio */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900">Nuovo Articolo / Servizio a Catalogo</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Codice SKU</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Categoria</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="Sviluppo Web">Sviluppo Web</option>
                    <option value="Design & UX">Design & UX</option>
                    <option value="Marketing & SEO">Marketing & SEO</option>
                    <option value="Hardware & Server">Hardware & Server</option>
                    <option value="Consulenza">Consulenza</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nome Articolo / Servizio</label>
                <input
                  type="text"
                  placeholder="es. Modulo Integrazione Pagamenti Stripe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Costo Acquisto (€)</label>
                  <input
                    type="number"
                    placeholder="100"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Prezzo Vendita (€)</label>
                  <input
                    type="number"
                    placeholder="250"
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unità</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="ore">ore</option>
                    <option value="pz">pz</option>
                    <option value="forfait">forfait</option>
                    <option value="mese">mese</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Giacenza Iniziale</label>
                  <input
                    type="number"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Allarme Sotto-Scorta</label>
                  <input
                    type="number"
                    value={formData.minStockAlert}
                    onChange={(e) => setFormData({ ...formData, minStockAlert: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Descrizione Dettagliata</label>
                <textarea
                  rows={2}
                  placeholder="Specifiche tecniche e vantaggi per il cliente..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-all shadow-xs"
                >
                  Salva nel Catalogo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
