import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import PopularList from "./components/PopularList";
import MainPage from "./components/Main";
import FluctuationList from "./components/FluctuationList";
import Join from "./components/Join";
import Joinsuccess from "./components/JoinSuccess";
import Header from "./types/Header";
import Login from "./components/Login";
import { MyPage } from "./components/MyPage";
import { ProductDetail } from "./components/ProductDetail";
import { BargainList } from "./components/BargainList";
import SearchResults from "./components/searchResults";
import Analysis from "./components/Analysis";
function App() {
  const session = localStorage.getItem("name");
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/products/popular" element={<PopularList />} />
        <Route path="/products/fluctuation" element={<FluctuationList />} />
        <Route path="/auth/join" element={<Join />} />
        <Route path="/auth/joinSuccess" element={<Joinsuccess />} />
        <Route path="/auth/login" element={<Login />} />
        <Route
          path="/auth/mypage"
          element={session ? <MyPage /> : <Navigate to="/auth/login" />}
        />
        <Route path="/products/detail/:productId" element={<ProductDetail />} />
        <Route path="/products/bargainList" element={<BargainList />} />
        <Route path="/products/search" element={<SearchResults />} />
        <Route path="/products/analysis" element={<Analysis />} />
      </Routes>
    </Router>
  );
}

export default App;
