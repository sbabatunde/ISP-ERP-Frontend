import React from "react";
import { fetchEquipmentMovementList } from "@/api/axios";
import { useState, useEffect } from "react";
import Status from "../status";

function CompletedRetrieval() {
  const [data, setData] = useState([]);
  console.log(data);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchEquipmentMovementList();
        setData(result.filter((item) => item.status === "completed"));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  return (
    <div>
      <Status data={data} />
    </div>
  );
}

export default CompletedRetrieval;
