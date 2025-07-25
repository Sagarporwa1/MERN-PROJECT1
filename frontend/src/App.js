import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Recipe Card Component
const RecipeCard = ({ recipe, onEdit, onDelete }) => {
  const difficultyColors = {
    Easy: "bg-green-100 text-green-800",
    Medium: "bg-yellow-100 text-yellow-800",
    Hard: "bg-red-100 text-red-800"
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div 
        className="h-48 bg-cover bg-center"
        style={{
          backgroundImage: `url(${recipe.image_url || 'https://images.unsplash.com/photo-1532980400857-e8d9d275d858?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwxfHxmb29kJTIwcGhvdG9ncmFwaHl8ZW58MHx8fHwxNzUzNDYxNTQ3fDA&ixlib=rb-4.1.0&q=85'})`
        }}
      >
        <div className="h-full bg-black bg-opacity-20 flex items-end">
          <div className="p-4">
            <h3 className="text-white font-bold text-lg">{recipe.title}</h3>
          </div>
        </div>
      </div>
      <div className="p-4">
        <p className="text-gray-600 text-sm mb-3">{recipe.description}</p>
        <div className="flex items-center justify-between mb-3">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${difficultyColors[recipe.difficulty]}`}>
            {recipe.difficulty}
          </span>
          <span className="text-sm text-gray-500">🕒 {recipe.cooking_time}</span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => onEdit(recipe)}
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors text-sm"
          >
            Edit
          </button>
          <button 
            onClick={() => onDelete(recipe.id)}
            className="flex-1 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// Recipe Form Component
const RecipeForm = ({ recipe, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: recipe?.title || "",
    description: recipe?.description || "",
    ingredients: recipe?.ingredients?.join("\n") || "",
    instructions: recipe?.instructions?.join("\n") || "",
    cooking_time: recipe?.cooking_time || "",
    difficulty: recipe?.difficulty || "Easy",
    image_url: recipe?.image_url || ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const recipeData = {
      ...formData,
      ingredients: formData.ingredients.split("\n").filter(item => item.trim()),
      instructions: formData.instructions.split("\n").filter(item => item.trim())
    };
    onSubmit(recipeData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">{recipe ? "Edit Recipe" : "Add New Recipe"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Recipe Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter recipe title..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description of the recipe..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ingredients (one per line)</label>
              <textarea
                name="ingredients"
                value={formData.ingredients}
                onChange={handleChange}
                required
                rows="5"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1 cup flour&#10;2 eggs&#10;1/2 cup milk..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instructions (one per line)</label>
              <textarea
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                required
                rows="5"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Mix flour and eggs&#10;Add milk gradually&#10;Cook for 5 minutes..."
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cooking Time</label>
                <input
                  type="text"
                  name="cooking_time"
                  value={formData.cooking_time}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 30 minutes"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image URL (optional)</label>
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/recipe-image.jpg"
              />
            </div>
            
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
              >
                {recipe ? "Update Recipe" : "Add Recipe"}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch recipes
  const fetchRecipes = async (search = "") => {
    try {
      const response = await axios.get(`${API}/recipes`, {
        params: search ? { search } : {}
      });
      setRecipes(response.data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add or update recipe
  const handleSubmitRecipe = async (recipeData) => {
    try {
      if (editingRecipe) {
        await axios.put(`${API}/recipes/${editingRecipe.id}`, recipeData);
      } else {
        await axios.post(`${API}/recipes`, recipeData);
      }
      setShowForm(false);
      setEditingRecipe(null);
      fetchRecipes(searchTerm);
    } catch (error) {
      console.error("Error saving recipe:", error);
    }
  };

  // Delete recipe
  const handleDeleteRecipe = async (recipeId) => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      try {
        await axios.delete(`${API}/recipes/${recipeId}`);
        fetchRecipes(searchTerm);
      } catch (error) {
        console.error("Error deleting recipe:", error);
      }
    }
  };

  // Edit recipe
  const handleEditRecipe = (recipe) => {
    setEditingRecipe(recipe);
    setShowForm(true);
  };

  // Search recipes
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    fetchRecipes(term);
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading recipes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div 
        className="bg-cover bg-center h-64 relative"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHw0fHxjb29raW5nfGVufDB8fHx8MTc1MzQ0MzE3Nnww&ixlib=rb-4.1.0&q=85')`
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">🍳 Recipe Sharing App</h1>
            <p className="text-xl">Discover and share amazing recipes with the world</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search recipes by name, description, or ingredients..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors whitespace-nowrap"
          >
            Add New Recipe
          </button>
        </div>

        {/* Recipe Grid */}
        {recipes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍴</div>
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">No recipes found</h2>
            <p className="text-gray-500">
              {searchTerm ? "Try searching with different keywords" : "Add your first recipe to get started!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onEdit={handleEditRecipe}
                onDelete={handleDeleteRecipe}
              />
            ))}
          </div>
        )}
      </div>

      {/* Recipe Form Modal */}
      {showForm && (
        <RecipeForm
          recipe={editingRecipe}
          onSubmit={handleSubmitRecipe}
          onCancel={() => {
            setShowForm(false);
            setEditingRecipe(null);
          }}
        />
      )}
    </div>
  );
}

export default App;