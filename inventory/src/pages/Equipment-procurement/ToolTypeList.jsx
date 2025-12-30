import EquipmenToolTypeList from "../../components/list/tool-equipment-type-list";
function ToolTypeList() {
  return (
    <div>
      <EquipmenToolTypeList
        type="tool"
        title="Tool Types"
        description="Manage all tool types in your inventory"
      />
    </div>
  );
}

export default ToolTypeList;
