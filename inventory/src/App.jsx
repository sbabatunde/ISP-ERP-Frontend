import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Form from "./components/Form";
import SuppliersForm from "./components/Suppliers";
import EquipmentForm from "./pages/Equipment-procurement/EquipmentForm";
import EquipmentList from "./pages/Equipment-procurement/EquipmentList";
// import Sidebartest from "./components/Sidebartest";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="form" element={<Form />} />
          <Route path="suppliers" element={<SuppliersForm />} />
          <Route path="equipment-form" element={<EquipmentForm />} />
          <Route path="equipment-list" element={<EquipmentList />} />
          {/* <Route path="about" element={<div>About Page</div>} />
          <Route path="contact" element={<div>Contact Page</div>} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
