import ItemForm from "../../components/forms/ItemForm";

export default function EquipmentForm() {
  return (
    <ItemForm
      type="equipment"
      title="Add New Equipment"
      description="Fill in the equipment details"
      successMessage="Equipment created successfully!"
      errorMessage="Something went wrong. Please try again."
      nameLabel="Equipment Name"
      typeLabel="Equipment Type"
      submitText="Add Equipment"
    />
  );
}
