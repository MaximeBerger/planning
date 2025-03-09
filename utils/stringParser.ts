export interface ParsedDescription {
  Ressources: string[];
  Formateurs: string[];
  Groupes: string[];
}

export function parseDescriptionString(description: string | undefined): ParsedDescription {
  if (!description) {
    return {
      Ressources: [],
      Formateurs: [],
      Groupes: []
    };
  }

  const result = {
    Ressources: [] as string[],
    Formateurs: [] as string[],
    Groupes: [] as string[]
  };

  // Diviser la chaîne en sections
  const sections = description.split('\n\n');

  sections.forEach(section => {
    // Pour chaque section, extraire le titre et les éléments
    const [title, ...items] = section.split('\n');
    const category = title.replace(' : ', '');

    if (category in result) {
      // Filtrer les éléments vides et enlever les tirets
      result[category as keyof typeof result] = items
        .filter(item => item.trim())
        .map(item => item.replace('- ', '').trim());
    }
  });

  return result;
}

export function extractUniqueCategories(events: { description?: string }[]): {
  categories: string[];
  filterOptions: {
    Ressources: string[];
    Formateurs: string[];
    Groupes: string[];
  };
} {
  const allCategories = ['Ressources', 'Formateurs', 'Groupes'];
  const uniqueItems = {
    Ressources: new Set<string>(),
    Formateurs: new Set<string>(),
    Groupes: new Set<string>()
  };

  events.forEach(event => {
    if (event.description) {
      const parsed = parseDescriptionString(event.description);
      Object.entries(parsed).forEach(([category, items]) => {
        items.forEach(item => {
          uniqueItems[category as keyof typeof uniqueItems].add(item);
        });
      });
    }
  });

  return {
    categories: allCategories,
    filterOptions: {
      Ressources: Array.from(uniqueItems.Ressources),
      Formateurs: Array.from(uniqueItems.Formateurs),
      Groupes: Array.from(uniqueItems.Groupes)
    }
  };
} 