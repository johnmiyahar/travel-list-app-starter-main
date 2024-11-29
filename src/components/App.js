import React, { useState } from "react";

function Logo() {
  return <h1>Travel List</h1>;
}

function Form({ addItem }) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleQuantityChange = (e) => {
    setQuantity(Number(e.target.value));
  };

  function handleSubmit(e) {
    e.preventDefault();

    if (description.trim() === "") return;

    const newItem = {
      id: Date.now(),
      description,
      quantity,
      packed: false,
    };

    addItem(newItem);
    setDescription("");
    setQuantity(1);
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you need to pack?</h3>
      <select value={quantity} onChange={handleQuantityChange}>
        <option value={1}>1</option>
        <option value={2}>2</option>
        <option value={3}>3</option>
      </select>
      <input
        value={description}
        onChange={handleDescriptionChange}
        type="text"
        placeholder="Enter item here"
      />
      <button>Add</button>
    </form>
  );
}

function Item({ item, onDeleteItem, onUpdateItem }) {
  return (
    <li>
      <input
        type="checkbox"
        checked={item.packed}
        onChange={() => onUpdateItem(item.id)}
      />
      <span
        style={{
          textDecoration: item.packed ? "line-through" : "none",
        }}
      >
        {item.description} ({item.quantity})
      </span>
      <button onClick={() => onDeleteItem(item.id)}>❌</button>
    </li>
  );
}

function PackingList({ items, onDeleteItem, onUpdateItem }) {
  return (
    <div className="list">
      <ul>
        {items.map((item) => (
          <Item
            key={item.id}
            item={item}
            onDeleteItem={onDeleteItem}
            onUpdateItem={onUpdateItem}
          />
        ))}
      </ul>
    </div>
  );
}

function Stats({ items }) {
  const numItems = items.length;
  const numPacked = items.filter((item) => item.packed).length;
  const percentage = Math.round((numPacked / numItems) * 100);

  return (
    <footer className="stats">
      <em>
        {percentage === 100
          ? "You got everything!"
          : `You have ${numItems} items in the list. You already packed ${numPacked} (${percentage}%).`}
      </em>
    </footer>
  );
}

function App() {
  const [items, setItems] = useState([
    { id: 1, description: "Shirt", quantity: 5, packed: false },
    { id: 2, description: "Pants", quantity: 2, packed: false },
  ]);
  const [sortOption, setSortOption] = useState("alphabetical"); // Alphabetical is the default

  const addItem = (item) => {
    setItems((prevItems) => [item, ...prevItems]);
  };

  const handleDeleteItem = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleUpdateItem = (id) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  };

  // Sorting function
  const sortedItems = [...items]
    .sort((a, b) => {
      if (sortOption === "alphabetical") {
        return a.description.localeCompare(b.description);
      } else if (sortOption === "quantity") {
        return a.quantity - b.quantity;
      }
      return 0;
    })
    .sort((a, b) => a.packed - b.packed); // Move packed items to the end

  return (
    <div className="app">
      <Logo />
      <Form addItem={addItem} />
      <div className="sort-buttons">
        <button onClick={() => setSortOption("alphabetical")}>Alphabetical</button>
        <button onClick={() => setSortOption("quantity")}>Quantity</button>
      </div>
      <PackingList
        items={sortedItems}
        onDeleteItem={handleDeleteItem}
        onUpdateItem={handleUpdateItem}
      />
      <Stats items={sortedItems} />
    </div>
  );
}

export default App;
