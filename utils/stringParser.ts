export interface HierarchicalItem {
  title: string;
  items: string[];
  subgroups: HierarchicalItem[];
}

function organizeItems(items: string[], category: 'Ressources' | 'Formateurs' | 'Groupes'): HierarchicalItem[] {
  const result: HierarchicalItem[] = [];

  if (category === 'Ressources') {
    const sections = {
      'Amphithéatre': [] as string[],
      'Salle formation': [] as string[],
      'Salle BIM': [] as string[],
      'Salle informatique': [] as string[]
    };

    items.forEach((item: string) => {
      let found = false;
      for (const [section, itemList] of Object.entries(sections)) {
        if (item.toLowerCase().includes(section.toLowerCase())) {
          itemList.push(item);
          found = true;
          break;
        }
      }
      // Si l'item n'a pas été classé, on le met dans "Autres"
      if (!found) {
        if (!result.find(group => group.title === 'Autres')) {
          result.push({
            title: 'Autres',
            items: [],
            subgroups: []
          });
        }
        result.find(group => group.title === 'Autres')?.items.push(item);
      }
    });

    // Créer les sections non vides
    Object.entries(sections).forEach(([title, sectionItems]) => {
      if (sectionItems.length > 0) {
        result.push({
          title,
          items: sectionItems,
          subgroups: []
        });
      }
    });

  } else if (category === 'Groupes') {
    const mainSections = ['ING_PGE1D', 'ING_PGE2D'];
    
    // Créer les sections principales
    mainSections.forEach(section => {
      const sectionItems = items.filter(item => item.startsWith(section) && item !== section);
      if (sectionItems.length > 0) {
        result.push({
          title: section,
          items: sectionItems,
          subgroups: []
        });
      }
    });

    // Ajouter les items qui ne correspondent à aucune section
    const remainingItems = items.filter((item: string) => 
      !mainSections.some(section => item.startsWith(section))
    );

    if (remainingItems.length > 0) {
      result.push({
        title: 'Autres',
        items: remainingItems,
        subgroups: []
      });
    }
  } else {
    // Pour les Formateurs, pas de hiérarchie
    if (items.length > 0) {
      result.push({
        title: '',
        items: items,
        subgroups: []
      });
    }
  }

  return result;
}

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
  filterOptions: ParsedDescription;
  hierarchicalOptions: {
    Ressources: HierarchicalItem[];
    Formateurs: HierarchicalItem[];
    Groupes: HierarchicalItem[];
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
        items.forEach((item: string) => {
          uniqueItems[category as keyof typeof uniqueItems].add(item);
        });
      });
    }
  });

  const filterOptions = {
    Ressources: Array.from(uniqueItems.Ressources),
    Formateurs: Array.from(uniqueItems.Formateurs),
    Groupes: Array.from(uniqueItems.Groupes)
  };

  return {
    categories: allCategories,
    filterOptions,
    hierarchicalOptions: {
      Ressources: organizeItems(filterOptions.Ressources, 'Ressources'),
      Formateurs: organizeItems(filterOptions.Formateurs, 'Formateurs'),
      Groupes: organizeItems(filterOptions.Groupes, 'Groupes')
    }
  };
} 