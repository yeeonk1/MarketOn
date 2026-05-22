import { useEffect, useState } from "react";
import { REGIONS, type productDTO } from "../types/DTO";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/Main.css";

export const MainPage: React.FC = () => {
  const [popularItems, setPopularItems] = useState<productDTO[]>([]);
  const [fluctuationItems, setFluctuationItems] = useState<productDTO[]>([]);

  const navigate = useNavigate();
  const [region, setRegion] = useState("서울");
  const [todayPick, setTodayPick] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [resPop, resFluc, resPick] = await Promise.all([
          axios.get("/api/products/popular"),
          axios.get("/api/products/fluctuation"),
          axios.get(
            `/api/products/bargainTop?region=${encodeURIComponent(region)}`,
          ),
        ]);

        console.log("인기 품목 전체 응답: ", resPop.data);
        console.log("변동률 전체 응답: ", resFluc.data);
        console.log("오늘의 PICK 전체 응답: ", resPick.data);

        setPopularItems(resPop.data || []);
        setFluctuationItems(resFluc.data || []);

        setTodayPick(resPick.data || null);
      } catch (error) {
        console.error("데이터 로드 실패: ", error);
      }
    };
    loadData();
  }, [region]);

  const [info, setInfo] = useState({
    name: localStorage.getItem("name"),
    userRegion: localStorage.getItem("userRegion"),
  });

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    const storedUserRegion = localStorage.getItem("userRegion");

    if (storedUserRegion) {
      setRegion(storedUserRegion);
      setInfo({ name: storedName, userRegion: storedUserRegion });
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setPopularItems([]);
      setFluctuationItems([]);

      try {
        const [resPop, resFluc] = await Promise.all([
          axios.get(`/api/products/popular?region=${region}`),
          axios.get(`/api/products/fluctuation?region=${region}`),
        ]);

        setPopularItems(resPop.data || []);
        setFluctuationItems(resFluc.data || []);
      } catch (error) {
        console.error("데이터 로드 실패", error);
      }
    };
    loadData();
  }, [region]);

  return (
    <div className="container">
      <div
        className="main-upper-layout"
        style={{
          display: "flex",
          gap: "40px",
          alignItems: "flex-start",
          width: "100%",
          marginBottom: "20px",
        }}
      >
        <div className="left-content" style={{ flex: 1, minWidth: 0 }}>
          <section className="today-pick-sec">
            <div
              className="today-pick-card"
              style={{
                cursor: todayPick?.productId ? "pointer" : "default",
              }}
              onClick={() =>
                todayPick?.productId &&
                navigate(`/products/detail/${todayPick.productId}`)
              }
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "between",
                  alignItems: "center",
                }}
              >
                <div>
                  <span
                    style={{
                      background: "#1890ff",
                      color: "#fff",
                      padding: "4px 8px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    🔥 오늘의 PICK
                  </span>
                  {todayPick ? (
                    <>
                      <h2 style={{ margin: "10px 0 5px 0", color: "#0050b3" }}>
                        {todayPick.itemName || "추천 상품"}[
                        {todayPick.category || "농산물"}]{" "}
                      </h2>
                      <p
                        style={{
                          margin: 0,
                          color: "#434343",
                          fontSize: "15px",
                        }}
                      >
                        현재 역대급 최저가 수준! 평균가{" "}
                        <strong style={{ color: "#f5222d", fontSize: "18px" }}>
                          {todayPick.avgPrice?.toLocaleString()}원
                        </strong>{" "}
                        ({todayPick.unitSz} {todayPick.unit})
                      </p>
                    </>
                  ) : (
                    <p
                      style={{ margin: "10px 0 0 0", color: "#8c8c8c" }}
                      className="no-pick-data"
                    >
                      현재 지역에 추천할 오늘의 PICK 상품이 없습니다.
                    </p>
                  )}
                </div>
                {todayPick?.productId && (
                  <div
                    style={{
                      marginLeft: "auto",
                      fontSize: "24px",
                      color: "#1890ff",
                    }}
                  >
                    지금 보러가기 ➔
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        <div
          className="right-content"
          style={{
            width: "240px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            flexShrink: 0,
          }}
        >
          <div className="region" style={{ margin: 0, display: "block" }}>
            {info.name && info.userRegion ? (
              <div
                className="regionNotice"
                style={{ width: "100%", margin: 0 }}
              >
                <p>
                  <strong>{info.name}</strong>님이 등록하신
                  <br />
                  <strong>{info.userRegion}</strong>
                  <span> 지역의 정보가 먼저 표시됩니다.</span>
                </p>
              </div>
            ) : (
              <p className="regionSelect" style={{ margin: 0 }}>
                원하시는 지역을 선택해 주세요
              </p>
            )}
          </div>
          <p className="plz-select-region">지역을 선택해주세요</p>

          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            style={{ width: "40%", margin: 0 }}
          >
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      <section className="list-sec">
        <div className="list-grid-wrapper">
          <div className="popularList-card">
            <h4 className="popularList-title">인기 급상승 품목</h4>
            <p>가장 많이 조회된 상품이 표시됩니다.</p>
            <button
              className="btn-detail"
              onClick={() => navigate("/products/popular")}
            >
              자세히 보기
            </button>
            <table className="popular-list">
              <tbody>
                {popularItems.length > 0 ? (
                  popularItems.map((item, index) => (
                    <tr
                      key={`pop-${item.productId || index}`}
                      onClick={() =>
                        navigate(`/products/detail/${item.productId}`)
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <td className="rankNum">{index + 1}</td>
                      <td className="itemName">{item.itemName}</td>
                      <td className="itemPrice">
                        {item.avgPrice?.toLocaleString()}원
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="noList">
                    <td colSpan={3} className="noListText">
                      현재 추천할 상품이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="fluctuationList-card">
            <h4 className="fluctuationList-title">지금 구매하세요!</h4>
            <p>현재 가격이 하락한 상품이 표시됩니다.</p>
            <button
              className="btn-detail"
              onClick={() => navigate("/products/fluctuation")}
            >
              자세히 보기
            </button>

            <table className="fluctuationList-list">
              <tbody>
                {fluctuationItems.length > 0 ? (
                  fluctuationItems.map((item, index) => (
                    <tr
                      key={`fluc-${item.productId || index}`}
                      onClick={() =>
                        navigate(`/products/detail/${item.productId}`)
                      }
                    >
                      <td className="rankNum">{index + 1}</td>
                      <td className="itemName">{item.itemName}</td>
                      <td className="itemPrice">
                        {item.avgPrice?.toLocaleString()}원
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="noList">
                    <td colSpan={3} className="noListText">
                      현재 추천할 상품이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MainPage;
