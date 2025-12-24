import React, { useEffect, useState } from "react";
import { getCourseIngredients, addIngredient } from "../../api/inventoryApi";
import { useParams } from "react-router-dom";

function CourseIngredients() {
  const { courseName } = useParams();
  const [ingredients, setIngredients] = useState([]);
  const [itemName, setItemName] = useState("");
  const [amountRequired, setAmountRequired] = useState("");

  const loadIngredients = async () => {
    const data = await getCourseIngredients(courseName);
    setIngredients(data);
  };

  useEffect(() => {
    loadIngredients();
  }, [courseName]);

  const handleAdd = async (e) => {
    e.preventDefault();

    const payload = {
      itemName,
      amountRequired: Number(amountRequired)
    };

    // ✅ backend insert
    await addIngredient(courseName, payload);

    // ✅ OPTIMISTIC UI UPDATE
    setIngredients(prev => [
      ...prev,
      {
        first: {
          itemName,
          cost: 0,
          amount: 0,
          containsMeat: false,
          containsGluten: false
        },
        second: payload.amountRequired
      }
    ]);

    setItemName("");
    setAmountRequired("");
  };

  return (
    <div>
      <h2>Ingredients for {courseName}</h2>

      <table border="1" width="100%">
        <thead>
          <tr>
            <th>Item</th>
            <th>Required</th>
            <th>In Stock</th>
            <th>Cost</th>
            <th>Meat</th>
            <th>Gluten</th>
          </tr>
        </thead>
        <tbody>
          {ingredients.length === 0 && (
            <tr>
              <td colSpan="6">No ingredients</td>
            </tr>
          )}

          {ingredients.map(pair => (
            <tr key={pair.first.itemName}>
              <td>{pair.first.name}</td>
              <td>{pair.second}</td>
              <td>{pair.first.amount}</td>
              <td>{pair.first.cost}</td>
              <td>{pair.first.containsMeat ? "Yes" : "No"}</td>
              <td>{pair.first.containsGluten ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Add Ingredient</h3>
      <form onSubmit={handleAdd}>
        <input
          placeholder="Item Name"
          value={itemName}
          onChange={e => setItemName(e.target.value)}
          required
        />
        <input
          type="number"
          step="0.01"
          placeholder="Amount Required"
          value={amountRequired}
          onChange={e => setAmountRequired(e.target.value)}
          required
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}

export default CourseIngredients;
