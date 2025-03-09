import { Event } from './Calendar';
import { ParsedDescription } from '../utils/stringParser';

interface FilterPanelProps {
  events: Event[];
  categories: string[];
  filterOptions: ParsedDescription;
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
}

export default function FilterPanel({
  categories,
  filterOptions,
  selectedCategories,
  onCategoriesChange
}: FilterPanelProps) {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4 text-gray-900">Filtres</h2>
      
      {categories.map(category => (
        <div key={category} className="mb-4">
          <h3 className="font-medium mb-2 text-gray-800">{category}</h3>
          <div className="space-y-2">
            {filterOptions[category as keyof ParsedDescription].map(item => (
              <label key={item} className="flex items-center space-x-2">
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
                <span className="text-gray-900">{item}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 