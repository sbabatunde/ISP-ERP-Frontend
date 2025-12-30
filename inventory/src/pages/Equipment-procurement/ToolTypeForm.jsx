import TypeForm from "../../components/forms/TypeForm";

export default function ToolTypeForm() {
  return (
    <TypeForm
      type="tool"
      title="Create Tool Type"
      description="Add a new tool type/category"
      successMessage="Tool type created successfully!"
      errorMessage="Failed to create tool type."
      typeOptions={[
        { value: "outdoor", label: "Outdoor Unit" },
        { value: "indoor", label: "Indoor Unit" },
      ]}
      placeholder="screwdriver, drill, multimeter, etc."
    />
  );
}
