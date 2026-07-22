import React, { useState } from 'react';
import { MenuItem, DietaryTag } from '../../types';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Image as ImageIcon, 
  Clock, 
  DollarSign, 
  Tag, 
  Check, 
  X, 
  Sparkles, 
  AlertCircle,
  Utensils,
  Layers,
  ChefHat
} from 'lucide-react';

interface MenuManagerProps {
  menu: MenuItem[];
  onUpdateMenu: (updatedMenu: MenuItem[]) => void;
}

const DEFAULT_CATEGORIES = [
  'appetizers',
  'mains',
  'desserts',
  'drinks',
  'specials'
];

const PRESET_IMAGES = [
  { name: 'Wagyu Burger', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80' },
  { name: 'Truffle Pasta', url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&auto=format&fit=crop&q=80' },
  { name: 'Artisan Pizza', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80' },
  { name: 'Crispy Calamari', url: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80' },
  { name: 'Matcha Latte', url: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop&q=80' },
  { name: 'Tiramisu', url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&auto=format&fit=crop&q=80' },
  { name: 'Cocktail', url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&auto=format&fit=crop&q=80' },
  { name: 'Salmon Bowl', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80' },
];

const ALL_DIETARY_TAGS: DietaryTag[] = [
  'vegetarian',
  'vegan',
  'gluten-free',
  'contains-nuts',
  'chef-special',
  'spicy'
];

export const MenuManager: React.FC<MenuManagerProps> = ({ menu, onUpdateMenu }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form State
  const [formName, setFormName] = useState<string>('');
  const [formCategory, setFormCategory] = useState<string>('mains');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formPrice, setFormPrice] = useState<number>(15.99);
  const [formPrepTime, setFormPrepTime] = useState<number>(15);
  const [formImage, setFormImage] = useState<string>('');
  const [formCalories, setFormCalories] = useState<number>(450);
  const [formDietaryTags, setFormDietaryTags] = useState<DietaryTag[]>([]);
  const [formStockQuantity, setFormStockQuantity] = useState<number>(25);
  const [formLowStockThreshold, setFormLowStockThreshold] = useState<number>(5);

  const categories = Array.from(new Set([...DEFAULT_CATEGORIES, ...menu.map((m) => m.category.toLowerCase())]));

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormName('');
    setFormCategory('mains');
    setFormDescription('');
    setFormPrice(14.99);
    setFormPrepTime(12);
    setFormImage(PRESET_IMAGES[0].url);
    setFormCalories(400);
    setFormDietaryTags([]);
    setFormStockQuantity(20);
    setFormLowStockThreshold(5);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormDescription(item.description);
    setFormPrice(item.price);
    setFormPrepTime(item.prepTimeMinutes);
    setFormImage(item.image);
    setFormCalories(item.calories || 350);
    setFormDietaryTags(item.dietaryTags || []);
    setFormStockQuantity(item.stockQuantity);
    setFormLowStockThreshold(item.lowStockThreshold);
    setIsModalOpen(true);
  };

  const handleToggleDietaryTag = (tag: DietaryTag) => {
    if (formDietaryTags.includes(tag)) {
      setFormDietaryTags(formDietaryTags.filter((t) => t !== tag));
    } else {
      setFormDietaryTags([...formDietaryTags, tag]);
    }
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || formPrice <= 0) return;

    if (editingItem) {
      // Update existing item
      const updatedMenu = menu.map((item) =>
        item.id === editingItem.id
          ? {
              ...item,
              name: formName.trim(),
              category: formCategory.toLowerCase(),
              description: formDescription.trim(),
              price: formPrice,
              prepTimeMinutes: formPrepTime,
              image: formImage || PRESET_IMAGES[0].url,
              calories: formCalories,
              dietaryTags: formDietaryTags,
              stockQuantity: formStockQuantity,
              lowStockThreshold: formLowStockThreshold,
              isAvailable: formStockQuantity > 0 ? item.isAvailable : false,
            }
          : item
      );
      onUpdateMenu(updatedMenu);
    } else {
      // Add brand new item
      const newItem: MenuItem = {
        id: `dish-${Date.now()}`,
        name: formName.trim(),
        category: formCategory.toLowerCase(),
        description: formDescription.trim(),
        price: formPrice,
        prepTimeMinutes: formPrepTime,
        image: formImage || PRESET_IMAGES[0].url,
        calories: formCalories,
        dietaryTags: formDietaryTags,
        isAvailable: true,
        stockQuantity: formStockQuantity,
        lowStockThreshold: formLowStockThreshold,
      };
      onUpdateMenu([newItem, ...menu]);
    }

    setIsModalOpen(false);
  };

  const handleDeleteItem = (itemId: string, itemName: string) => {
    if (window.confirm(`Are you sure you want to remove "${itemName}" from the restaurant menu?`)) {
      const updatedMenu = menu.filter((item) => item.id !== itemId);
      onUpdateMenu(updatedMenu);
    }
  };

  const filteredItems = menu.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 pb-24">
      {/* Top Banner */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center text-stone-950 font-black shadow-lg">
            <Utensils className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-stone-100">Menu & Recipe Editor</h1>
            <p className="text-xs text-stone-400">Add dishes, edit prices, descriptions, prep times & dietary tags</p>
          </div>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs rounded-2xl flex items-center space-x-2 shadow-lg transition-all transform active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Dish</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-stone-900 p-4 rounded-2xl border border-stone-800">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
          <input
            type="text"
            placeholder="Search dish by name or ingredient..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Categories Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all capitalize whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'bg-stone-950 text-stone-400 border border-stone-800 hover:text-white'
            }`}
          >
            All Categories ({menu.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all capitalize whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'bg-stone-950 text-stone-400 border border-stone-800 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-stone-900 border border-stone-800 hover:border-amber-500/40 rounded-3xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              {/* Image & Quick Status Header */}
              <div className="relative h-44 w-full overflow-hidden bg-stone-950">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-80" />

                <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                  <span className="px-2.5 py-1 bg-stone-950/80 backdrop-blur-md border border-stone-700/60 rounded-full text-[10px] font-bold uppercase text-amber-400">
                    {item.category}
                  </span>
                  {!item.isAvailable && (
                    <span className="px-2.5 py-1 bg-rose-500/90 text-white font-extrabold rounded-full text-[10px] uppercase shadow-md">
                      86'd
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                  <span className="text-xl font-black text-amber-300 drop-shadow-md">
                    ${item.price.toFixed(2)}
                  </span>
                  <span className="text-[11px] text-stone-300 font-medium flex items-center space-x-1 bg-stone-900/80 px-2 py-0.5 rounded-md backdrop-blur-sm">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>{item.prepTimeMinutes} mins</span>
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="p-5 space-y-3">
                <h3 className="text-base font-bold text-stone-100 group-hover:text-amber-300 transition-colors">
                  {item.name}
                </h3>
                <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                {/* Dietary Badges */}
                {item.dietaryTags && item.dietaryTags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.dietaryTags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 bg-stone-800 text-stone-300 border border-stone-700 rounded-md capitalize"
                      >
                        {tag.replace('-', ' ')}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Manager Actions Bar */}
            <div className="p-4 bg-stone-950/60 border-t border-stone-800 flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold text-stone-400">
                Stock: <strong className="text-stone-200">{item.stockQuantity}</strong>
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleOpenEditModal(item)}
                  className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Dish</span>
                </button>

                <button
                  onClick={() => handleDeleteItem(item.id, item.name)}
                  className="p-1.5 bg-stone-800 hover:bg-rose-900/40 text-stone-400 hover:text-rose-400 border border-stone-700 hover:border-rose-700/50 rounded-xl transition-colors"
                  title="Remove Item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Add / Edit Dish Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl my-8 animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-stone-800 flex items-center justify-between bg-stone-950">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <ChefHat className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-stone-100">
                    {editingItem ? `Edit Menu Item: ${editingItem.name}` : 'Add New Dish to Menu'}
                  </h2>
                  <p className="text-xs text-stone-400">Manage pricing, description, stock & dietary information</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveItem} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              
              {/* Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1.5">
                    Dish Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lobster Ravioli"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1.5">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. mains, appetizers, drinks..."
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400 capitalize"
                  />
                </div>
              </div>

              {/* Price, Prep Time, Calories */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1.5">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.5"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1.5">
                    Prep Time (mins)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formPrepTime}
                    onChange={(e) => setFormPrepTime(parseInt(e.target.value, 10) || 5)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1.5">
                    Calories (kcal)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formCalories}
                    onChange={(e) => setFormCalories(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1.5">
                  Description & Ingredients
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the dish ingredients, flavor profile, sauces, and cooking style..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-stone-100 focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              {/* Image URL & Preset Pickers */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-300">
                  Dish Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                />
                
                {/* Preset image suggestions */}
                <p className="text-[11px] text-stone-500 font-semibold">Or pick a high-res photo preset:</p>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {PRESET_IMAGES.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormImage(img.url)}
                      className={`relative h-12 rounded-xl overflow-hidden border transition-all ${
                        formImage === img.url ? 'ring-2 ring-amber-400 border-amber-400 scale-105' : 'border-stone-800 opacity-60 hover:opacity-100'
                      }`}
                      title={img.name}
                    >
                      <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Dietary Tags */}
              <div>
                <label className="block text-xs font-bold text-stone-300 mb-2">
                  Dietary Tags & Badges
                </label>
                <div className="flex flex-wrap gap-2">
                  {ALL_DIETARY_TAGS.map((tag) => {
                    const isSelected = formDietaryTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleToggleDietaryTag(tag)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize border transition-all flex items-center space-x-1.5 ${
                          isSelected
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold'
                            : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                        <span>{tag.replace('-', ' ')}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Inventory Stock & Threshold */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-stone-950 border border-stone-800 rounded-2xl">
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1">
                    Initial Stock Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formStockQuantity}
                    onChange={(e) => setFormStockQuantity(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1">
                    Low Stock Warning Threshold
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formLowStockThreshold}
                    onChange={(e) => setFormLowStockThreshold(parseInt(e.target.value, 10) || 5)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex items-center justify-end space-x-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs rounded-xl transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs rounded-xl shadow-lg transition-all"
                >
                  {editingItem ? 'Save Changes' : 'Publish Dish to Menu'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
