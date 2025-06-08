import React, { useState } from "react";

export default function App() {
  const [step, setStep] = useState(1);
  const [nameInput, setNameInput] = useState("");
  const [people, setPeople] = useState([]);
  const [items, setItems] = useState([{ name: "", amount: "", sharedBy: [] }]);

  const addPerson = () => {
    if (nameInput.trim() !== "") {
      setPeople([...people, nameInput.trim()]);
      setNameInput("");
    }
  };

  const removePerson = (index) => {
    const updated = [...people];
    updated.splice(index, 1);
    setPeople(updated);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const toggleShare = (index, person) => {
    const newItems = [...items];
    const sharedBy = newItems[index].sharedBy;
    if (sharedBy.includes(person)) {
      newItems[index].sharedBy = sharedBy.filter((p) => p !== person);
    } else {
      newItems[index].sharedBy.push(person);
    }
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { name: "", amount: "", sharedBy: [] }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    const totals = {};
    people.forEach((person) => (totals[person] = 0));

    items.forEach((item) => {
      const amount = parseFloat(item.amount);
      if (!isNaN(amount) && item.sharedBy.length > 0) {
        const share = amount / item.sharedBy.length;
        item.sharedBy.forEach((person) => {
          totals[person] += share;
        });
      }
    });
    return totals;
  };

  const totals = calculateTotals();

  if (step === 1) {
    return (
      <div style={{ padding: 20, maxWidth: 600, margin: 'auto' }}>
        <h1>Enter People</h1>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            placeholder="Enter a name"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
          />
          <button onClick={addPerson}>Add</button>
        </div>
        <ul>
          {people.map((name, idx) => (
            <li key={idx}>
              {name}
              <button onClick={() => removePerson(idx)} style={{ marginLeft: 10 }}>
                Remove
              </button>
            </li>
          ))}
        </ul>
        {people.length > 0 && (
          <button onClick={() => setStep(2)}>Next</button>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: 'auto' }}>
      <h1>Bill Splitter</h1>
      {items.map((item, index) => (
        <div key={index} style={{ marginBottom: 10 }}>
          <input
            placeholder="Item name"
            value={item.name}
            onChange={(e) => handleItemChange(index, "name", e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount"
            value={item.amount}
            onChange={(e) => handleItemChange(index, "amount", e.target.value)}
          />
          <button onClick={() => removeItem(index)}>Remove</button>
          <div>
            {people.map((person) => (
              <label key={person} style={{ marginRight: 10 }}>
                <input
                  type="checkbox"
                  checked={item.sharedBy.includes(person)}
                  onChange={() => toggleShare(index, person)}
                />
                {person}
              </label>
            ))}
          </div>
        </div>
      ))}
      <button onClick={addItem}>Add Item</button>
      <h2>Totals</h2>
      <ul>
        {people.map((person) => (
          <li key={person}>
            {person}: ${totals[person].toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}
