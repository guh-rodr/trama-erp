import { useState } from 'react';
import { useFetchCategories } from '../../../hooks/useCategories';
import { CategoryAccordion } from './CategoryAccordion';

export function CategoriesList() {
  const [expandedCategoryId, setExpandedCategoryId] = useState('');
  const [editCategoryId, setEditCategoryId] = useState('');

  const handleClickCategory = (id: string) => {
    if (expandedCategoryId === id) {
      setExpandedCategoryId('');
    } else {
      setExpandedCategoryId(id);
    }
  };

  const { data: categories } = useFetchCategories({ fetchOnMount: true, canFetchModels: true });

  return (
    <div className="space-y-3">
      {categories?.length ? (
        <>
          {categories.map((category) => (
            <CategoryAccordion
              key={category.id}
              category={category}
              editCategoryId={editCategoryId}
              setEditCategoryId={setEditCategoryId}
              expandedCategoryId={expandedCategoryId}
              handleClickCategory={handleClickCategory}
            />
          ))}
        </>
      ) : (
        <span className="text-lg text-center w-full block text-neutral-400 font-normal mt-8">
          Nenhuma categoria existente, comece adicionando uma.
        </span>
      )}
    </div>
  );
}
