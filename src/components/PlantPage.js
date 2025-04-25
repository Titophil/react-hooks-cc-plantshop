import React, { useState, useEffect } from "react";
import NewPlantForm from "./NewPlantForm";
import PlantList from "./PlantList";
import Search from "./Search";

function PlantPage() {
  const [plants, setPlants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = "http://localhost:6001/plants";

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(API_URL);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setPlants(data || []);
        setError(null);
      } catch (error) {
        console.error("Error fetching plants:", error);
        setError("Failed to load plants.");
      
        setPlants([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlants();
  }, []);

  const addPlant = async (newPlant) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPlant),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setPlants(prevPlants => [...prevPlants, data]);
    } catch (error) {
      console.error("Error adding plant:", error);
      alert("Failed to add plant.");
    }
  };

  const toggleStock = (id) => {
    if (!id) return;
    
    setPlants(prevPlants => 
      prevPlants.map(plant => {
        if (plant.id === id) {
          return { ...plant, inStock: plant.inStock === undefined ? false : !plant.inStock };
        }
        return plant;
      })
    );
  };

  const safeSearchTerm = searchTerm || "";
  
  const filteredPlants = plants.filter(plant => 
    plant && plant.name && plant.name.toLowerCase().includes(safeSearchTerm.toLowerCase())
  );

  return (
    <main>
      <NewPlantForm addPlant={addPlant} />
      <Search searchTerm={safeSearchTerm} setSearchTerm={setSearchTerm} />
      
      {isLoading && <p>Loading ...</p>}
      {error && <div className="error-message">{error}</div>}
      
      <PlantList plants={filteredPlants} toggleStock={toggleStock} />
    </main>
  );
}

export default PlantPage;