import React from "react";
import Preview from "./components/preview";
import { fetchProcurementDetails } from "../../api/axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

function RequisitionForm() {
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  console.log(id);
  const [procurement, setProcurement] = useState(null);
  const [error, setError] = useState(null);
  console.log(procurement);

  useEffect(() => {
    const fetchProcurement = async () => {
      setLoading(true);
      const procurement = await fetchProcurementDetails(id);
      setProcurement(procurement);
      setLoading(false);
    };
    fetchProcurement();
  }, [id]);
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-pink-600 dark:text-pink-400 animate-spin" />
        </div>
      </div>
    );
  }
  return (
    <div className=" w-full">
      <div>
        <Preview procurement={procurement} />
      </div>
    </div>
  );
}

export default RequisitionForm;
