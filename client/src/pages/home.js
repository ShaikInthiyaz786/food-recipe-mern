// import React, { useEffect, useState } from "react";
// import { useGetUserID } from "../hooks/useGetUserID";
// import axios from "axios";
// import "./home.css";

// export const Home = () => {
//   const [recipes, setRecipes] = useState([]);
//   const [savedRecipes, setSavedRecipes] = useState([]);
//   const [searchQuery, setSearchQuery] = useState(""); // State for search input

//   const userID = useGetUserID();

//   useEffect(() => {
//     const fetchRecipes = async () => {
//       try {
//         const response = await axios.get("http://localhost:3001/recipes");
//         setRecipes(response.data);
//       } catch (err) {
//         console.log(err);
//       }
//     };

//     const fetchSavedRecipes = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:3001/recipes/savedRecipes/ids/${userID}`
//         );
//         setSavedRecipes(response.data.savedRecipes);
//       } catch (err) {
//         console.log(err);
//       }
//     };

//     fetchRecipes();
//     fetchSavedRecipes();
//   }, []);

//   const saveRecipe = async (recipeID) => {
//     try {
//       const response = await axios.put("http://localhost:3001/recipes", {
//         recipeID,
//         userID,
//       });
//       setSavedRecipes(response.data.savedRecipes);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const isRecipeSaved = (id) => savedRecipes.includes(id);

//   // Filter recipes based on the search query
//   const filteredRecipes = recipes.filter((recipe) =>
//     recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div>
//       <h1>Recipes</h1>

//       {/* Search Input */}
//       <div>
//         <input
//           type="text"
//           placeholder="Search recipes..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//       </div>

//       <ul>
//         {filteredRecipes.map((recipe) => (
//           <li key={recipe._id}>
//             <div>
//               <h2>{recipe.name}</h2>
//               <button
//                 onClick={() => saveRecipe(recipe._id)}
//                 disabled={isRecipeSaved(recipe._id)}
//               >
//                 {isRecipeSaved(recipe._id) ? "Saved" : "Save"}
//               </button>
//             </div>
//             <div className="instructions">
//               <p>{recipe.instructions}</p>
//             </div>
//             <img src={recipe.imageUrl} alt={recipe.name} />
//             <p>Cooking Time: {recipe.cookingTime} minutes</p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import "./home.css";
import Cookies from "js-cookie";

export const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search input

  const userID = useGetUserID();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get("http://localhost:3001/recipes");
        setRecipes(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/recipes/savedRecipes/ids/${userID}`
        );
        setSavedRecipes(response.data.savedRecipes);
      } catch (err) {
        console.log(err);
      }
    };

    fetchRecipes();
    fetchSavedRecipes();
  }, [userID]);

  const saveRecipe = async (recipeID) => {
    try {
      const response = await axios.put("http://localhost:3001/recipes", {
        recipeID,
        userID,
      });
      setSavedRecipes(response.data.savedRecipes);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteRecipe = async (recipeID) => {
    try {
      const token = Cookies.get("access_token"); // Assuming the token is stored in cookies
      if (!token) {
        alert("Authentication token not found!");
        return;
      }

      await axios.delete(`http://localhost:3001/recipes/${recipeID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRecipes((prevRecipes) =>
        prevRecipes.filter((recipe) => recipe._id !== recipeID)
      );
      setSavedRecipes((prevSavedRecipes) =>
        prevSavedRecipes.filter((id) => id !== recipeID)
      );

      alert("Recipe deleted successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data || "Error deleting recipe!");
    }
  };

  const isRecipeSaved = (id) =>
    Array.isArray(savedRecipes) && savedRecipes.includes(id);

  // Filter recipes based on the search query
  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h1>Recipes</h1>

      {/* Search Input */}
      <div>
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <ul>
        {filteredRecipes.map((recipe) => (
          <li key={recipe._id} className="recipe-card">
            <div>
              <h2>{recipe.name}</h2>
              <button
                onClick={() => saveRecipe(recipe._id)}
                disabled={isRecipeSaved(recipe._id)}
              >
                {isRecipeSaved(recipe._id) ? "Saved" : "Save"}
              </button>
              {/* Delete Button */}
              <button
                className="delete-button"
                onClick={() => deleteRecipe(recipe._id)}
              >
                <i className="fas fa-trash-alt"></i>
              </button>
            </div>
            <div className="instructions">
              <p>{recipe.instructions}</p>
            </div>
            <img src={recipe.imageUrl} alt={recipe.name} />
            <p>Cooking Time: {recipe.cookingTime} minutes</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
