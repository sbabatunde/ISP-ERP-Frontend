// import React from 'react'
import TypeForm from "../../components/forms/TypeForm";
function Repair() {
  return (
    <div>
      <TypeForm
        type="equipment-repair"
        title="Repair Form"
        description="Fill Repair Form"
        placeholder="e.g., Screen Replacement, Battery Replacement, etc."
      />
    </div>
  );
}

export default Repair;
