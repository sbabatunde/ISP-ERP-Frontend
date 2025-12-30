import TypeForm from "../../components/forms/TypeForm";

export default function EquipmentTypeForm() {
  return (
    <TypeForm
      type="equipment"
      title="Create Equipment Type"
      description="Add a new equipment type/category"
      successMessage="Equipment type created successfully!"
      errorMessage="Failed to create equipment type."
      typeOptions={[
        { value: "outdoor", label: "Outdoor Unit" },
        { value: "indoor", label: "Indoor Unit" },
      ]}
      placeholder="router, radio, dish, etc."
    />
  );
}
