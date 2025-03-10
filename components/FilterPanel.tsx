import { Event } from './Calendar';
import { ParsedDescription, HierarchicalItem } from '../utils/stringParser';

interface FilterPanelProps {
  events: Event[];
  categories: string[];
  filterOptions: ParsedDescription;
  hierarchicalOptions: {
    Ressources: HierarchicalItem[];
    Formateurs: HierarchicalItem[];
    Groupes: HierarchicalItem[];
  };
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  isOpen: boolean;
}

export default function FilterPanel({
  categories,
  hierarchicalOptions,
  selectedCategories,
  onCategoriesChange,
  isOpen
}: FilterPanelProps) {

  const renderCategory = (category: string) => (
    <div key={category} className="col-span-1">
      <h3 className="font-medium mb-4 text-gray-800 border-b pb-2">{category}</h3>
      <div className="space-y-4">
        {category === 'Formateurs' ? (
          <div className="space-y-2">
            {hierarchicalOptions[category][0]?.items.map((item: string) => {
              if (!isOpen && !selectedCategories.includes(item)) return null;
              return (
                <label key={item} className="flex items-center space-x-2 py-0.5">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(item)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onCategoriesChange([...selectedCategories, item]);
                      } else {
                        onCategoriesChange(selectedCategories.filter(cat => cat !== item));
                      }
                    }}
                    className="form-checkbox h-4 w-4 text-blue-600"
                  />
                  <span className="text-gray-800">{item}</span>
                </label>
              );
            })}
          </div>
        ) : (
          hierarchicalOptions[category as keyof typeof hierarchicalOptions].map(group => {
            // Si le panneau est fermé, vérifier si le groupe a des items sélectionnés
            if (!isOpen && !group.items.some(item => selectedCategories.includes(item))) {
              return null;
            }
            return (
              <FilterGroup
                key={group.title}
                group={group}
                selectedCategories={selectedCategories}
                onCategoriesChange={onCategoriesChange}
                isOpen={isOpen}
              />
            );
          })
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-900">
        {isOpen ? 'Filtres' : 'Filtres sélectionnés'}
      </h2>
      
      <div className="grid grid-cols-3 gap-6">
        {categories.map(category => {
          // Si le panneau est fermé, vérifier si la catégorie a des éléments sélectionnés
          if (!isOpen) {
            const hasSelectedItems = category === 'Formateurs'
              ? hierarchicalOptions[category][0]?.items.some(item => selectedCategories.includes(item))
              : hierarchicalOptions[category as keyof typeof hierarchicalOptions].some(group => 
                  group.items.some(item => selectedCategories.includes(item))
                );
            if (!hasSelectedItems) return null;
          }
          return renderCategory(category);
        })}
      </div>
    </div>
  );
}

function FilterGroup({ group, selectedCategories, onCategoriesChange, isOpen }: {
  group: HierarchicalItem;
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  isOpen: boolean;
}) {
  const isGroupSelected = group.items.every((item: string) => selectedCategories.includes(item));
  const isGroupPartiallySelected = !isGroupSelected && group.items.some((item: string) => selectedCategories.includes(item));
  
  const handleGroupChange = (checked: boolean) => {
    if (checked) {
      const newCategories = [...selectedCategories, group.title, ...group.items];
      onCategoriesChange(Array.from(new Set(newCategories)));
    } else {
      onCategoriesChange(
        selectedCategories.filter(cat => 
          cat !== group.title && !group.items.includes(cat)
        )
      );
    }
  };

  return (
    <div className="mb-4">
      <label className="flex items-center space-x-2 font-medium text-gray-800">
        <input
          type="checkbox"
          checked={isGroupSelected}
          ref={input => {
            if (input) {
              input.indeterminate = isGroupPartiallySelected;
            }
          }}
          onChange={(e) => handleGroupChange(e.target.checked)}
          className="form-checkbox h-4 w-4 text-blue-600"
        />
        <span>{group.title}</span>
      </label>
      
      <div className="ml-8 space-y-1 mt-1">
        {group.items.map((item: string) => {
          if (!isOpen && !selectedCategories.includes(item)) return null;
          return (
            <label key={item} className="flex items-center space-x-2 py-0.5">
              <input
                type="checkbox"
                checked={selectedCategories.includes(item)}
                onChange={(e) => {
                  if (e.target.checked) {
                    onCategoriesChange([...selectedCategories, item]);
                  } else {
                    onCategoriesChange(selectedCategories.filter(cat => cat !== item));
                  }
                }}
                className="form-checkbox h-3 w-3 text-blue-500"
              />
              <span className="text-gray-700 text-sm">{item}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
} 