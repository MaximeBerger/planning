interface FilterPanelProps {
  events: Array<{
    category?: string;
    [key: string]: any;
  }>;
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
}

export default function FilterPanel({ 
  events, 
  selectedCategories, 
  onCategoriesChange 
}: FilterPanelProps) {
  const categories = Array.from(new Set(
    events
      .map(event => event.category)
      .filter((category): category is string => category !== undefined)
  ));

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoriesChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoriesChange([...selectedCategories, category]);
    }
  };

  console.log("categories", categories);
  return (
    <div className="p-4 border-2 border-gray-900 rounded-lg shadow-lg h-full">
      <h3 className="font-bold mb-4 text-gray-900">Filtres</h3>
      <div className="space-y-2">
        {categories.map(category => (
          <label key={category} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedCategories.includes(category)}
              onChange={() => toggleCategory(category)}
              className="rounded"
            />
            <span>{category}</span>
          </label>
        ))}
      </div>
    </div>
  );
} 