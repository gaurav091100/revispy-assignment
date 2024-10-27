// src/utils/generateCategories.ts
import { faker } from '@faker-js/faker';

export const generateCategories = (num: number) => {
    const categories = [];
    for (let i = 0; i < num; i++) {
        categories.push({
            id: i + 1,
            name: faker.commerce.department(),
        });
    }
    return categories;
};
