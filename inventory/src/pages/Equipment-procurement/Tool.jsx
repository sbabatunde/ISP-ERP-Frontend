import ItemForm from "../../components/forms/ItemForm";

export default function ToolForm() {
  return (
    <ItemForm
      type="tool"
      title="Add New Tool"
      description="Fill in the tool details"
      successMessage="Tool created successfully!"
      errorMessage="Something went wrong. Please try again."
      nameLabel="Tool Name"
      typeLabel="Tool Type"
      submitText="Add Tool"
    />
  );
}
