import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./Components/ProtectedRoute";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
// import Dashboard from "./Pages/Dashboard";
import Customers from "./Pages/Customers";
import Items from "./Pages/Items";
import Sales from "./Pages/Sales";
import Reports from "./Pages/Reports";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Define the routes */}
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route element={<ProtectedRoute />}>
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          <Route path="/items" element={<Items />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/reports" element={<Reports />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
