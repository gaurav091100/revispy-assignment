/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import styles from './categories.module.css';
import {API_BASE_URL} from "../../config/config";

// const API_BASE_URL = 'http://localhost:8080/api/v1';
const CATEGORIES_PER_PAGE = 6;

const Categories: React.FC = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);

    useEffect(() => {
        fetchCategories(currentPage);
        fetchUserSelections();
    }, [currentPage]);

    const fetchCategories = async (page: number) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/categories?page=${page}&limit=${CATEGORIES_PER_PAGE}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setCategories(data.categories);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchUserSelections = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/selections`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user selections');
            }

            const data = await response.json();
            const selections:any = new Set(data.selectedCategories);
            setSelectedCategories(selections);
        } catch (error) {
            console.error('Error fetching user selections:', error);
        }
    };

    const toggleSelection = (categoryId: string) => {
        setSelectedCategories((prev) => {
            const newSelection = new Set(prev);
            if (newSelection.has(categoryId)) {
                newSelection.delete(categoryId);
            } else {
                newSelection.add(categoryId);
            }
            return newSelection;
        });
    };

    const handlePageClick = (page: number) => {
        setCurrentPage(page);
    };

    const renderPagination = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageClick(i)}
                    className={i === currentPage ? styles.activePage : styles.pageButton}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    const saveUserSelections = async () => {
        const token = localStorage.getItem('token');
        const selections = Array.from(selectedCategories);

        try {
            const response = await fetch(`${API_BASE_URL}/selections`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ selectedCategories: selections }),
            });

            if (!response.ok) {
                throw new Error('Failed to save selections');
            }

            const result = await response.json();
            console.log('Selections saved successfully:', result);
        } catch (error) {
            console.error('Error saving selections:', error);
        }
    };

    useEffect(() => {
        if (selectedCategories.size > 0) {
            saveUserSelections();
        }
    }, [selectedCategories]);

    return (
        <main className={styles.container}>
            <h2>Please mark your interests!</h2>
            <p>We will keep you notified.</p>
            <hr />

            <h5>My saved interests!</h5>
            <ul>
                {categories.map((category) => (
                    <li key={category._id}>
                        <input
                            type="checkbox"
                            checked={selectedCategories.has(category._id)}
                            onChange={() => toggleSelection(category._id)}
                        />
                        {category.name}
                    </li>
                ))}
            </ul>
            <div className={styles.paginationContainer}>
                <button onClick={() => handlePageClick(currentPage - 1)} disabled={currentPage === 1}>
                    &lt;&lt;
                </button>
                {renderPagination()}
                <button onClick={() => handlePageClick(currentPage + 1)} disabled={currentPage >= totalPages}>
                    &gt;&gt;
                </button>
            </div>
        </main>
    );
};

export default Categories;

