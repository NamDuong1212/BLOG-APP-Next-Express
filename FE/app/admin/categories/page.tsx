'use client';

import React, { useState, useEffect } from 'react';

interface Category {
  _id: string;
  name: string;
  createdAt: string;
}

const CategoryManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [editCategory, setEditCategory] = useState({ id: "", name: "" });
  const [isEditing, setIsEditing] = useState(false);
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const access_Token = localStorage.getItem('access_token');

  // Fetch list categories
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${baseURL}/category/get`);
      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      alert('Failed to fetch categories');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Create category
  const handleCreate = async () => {
    try {
      const response = await fetch(`${baseURL}/category/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_Token}`
        },
        body: JSON.stringify({ name: newCategory }),
      });

      if (!response.ok) {
        throw new Error('Failed to create category');
      }

      await fetchCategories();
      setNewCategory("");
      alert('Category created successfully');
    } catch (error) {
      alert('Failed to create category');
    }
  };

  // Update category
  const handleUpdate = async () => {
    try {
      const response = await fetch(`${baseURL}/category/category/${editCategory.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_Token}`
        },
        body: JSON.stringify({ name: editCategory.name }),
      });

      if (!response.ok) {
        throw new Error('Failed to update category');
      }

      await fetchCategories();
      setIsEditing(false);
      setEditCategory({ id: "", name: "" });
      alert('Category updated successfully');
    } catch (error) {
      alert('Failed to update category');
    }
  };

  // Delete category
  const handleDelete = async (categoryID) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      const response = await fetch(`${baseURL}/category/delete/${categoryID}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_Token}`
          },
      });

      if (!response.ok) {
        throw new Error('Failed to delete category');
      }

      await fetchCategories();
      alert('Category deleted successfully');
    } catch (error) {
      alert('Failed to delete category');
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Category Management</h1>
      
      {/* Create Form */}
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category name"
          className="border p-2 rounded"
        />
        <button
          onClick={handleCreate}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Category
        </button>
      </div>

      {/* Categories List */}
      <div className="border rounded">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Created At</th>
              <th className="p-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id} className="border-t">
                <td className="p-2">
                  {isEditing && editCategory.id === category._id ? (
                    <input
                      type="text"
                      value={editCategory.name}
                      onChange={(e) =>
                        setEditCategory({ ...editCategory, name: e.target.value })
                      }
                      className="border p-1 rounded w-full"
                    />
                  ) : (
                    category.name
                  )}
                </td>
                <td className="p-2">
                  {new Date(category.createdAt).toLocaleDateString()}
                </td>
                <td className="p-2 text-right">
                  {isEditing && editCategory.id === category._id ? (
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={handleUpdate}
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setEditCategory({ id: "", name: "" });
                        }}
                        className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setEditCategory({
                            id: category._id,
                            name: category.name,
                          });
                        }}
                        className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(category._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryManagement;