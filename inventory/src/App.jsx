import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Form from "./components/Form";
import SuppliersForm from "./components/Suppliers";
import EquipmentForm from "./pages/Equipment-procurement/EquipmentProcurementForm";
import EquipmentList from "./pages/Equipment-procurement/EquipmentList";
import SuppliersList from "./pages/suppliers/SuppliersList"
import EquipmentProcurementForm from "./pages/Equipment-procurement/EquipmentProcurementForm";
import EquipmentMovementForm from "./pages/Equipment-procurement/EquipmentMovementForm";
import EquipmentTypeForm from "./pages/Equipment-procurement/EquipmentTypeForm";
import ProcurementForm from "./pages/Equipment-procurement/ProcurementForm";
import Equipment from "./pages/Equipment-procurement/Equipment"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="form" element={<Form />} />
          <Route path="inventory/suppliers" element={<SuppliersForm />} />
          <Route path="inventory/suppliers-list" element={<SuppliersList />} />
          <Route path="equipment-form" element={<EquipmentForm />} />
          <Route path="equipment-list" element={<EquipmentList />} />
          <Route path="equipment-type-form" element={<EquipmentTypeForm />} />
          <Route path="movement-form" element={<EquipmentMovementForm />} />
          <Route path="procurement-form" element={<ProcurementForm />} />
          <Route path="moveement-form" element={<EquipmentMovementForm/>} />
          <Route path="equipment" element={<Equipment/>} />

          
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
