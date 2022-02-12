import App from './App';
import TryYourself from './TryYourself';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TopNav from "./TopNav";
import SecondPage from "./SecondPage.js";

function RoutingApp() {
  return (
    <BrowserRouter>
      <TopNav />
      <Routes>
        <Route path="/" element={<App />}/>
        <Route path="/secondpage" element={<SecondPage />}/>
        <Route path="/tryYourself" element={<TryYourself />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default RoutingApp;