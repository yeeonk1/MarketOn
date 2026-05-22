import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { priceAPI } from "../api/Api";
import { REGIONS } from "../types/DTO";
import "../css/BargainList.css";

export const BargainList = () => {
  const [bargainItems, setBargainItems] = useState<any[]>([]);
  const navigate = useNavigate();
  const [region, setRegion] = useState(
    localStorage.getItem("userRegion") || "서울",
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadList = async () => {
      setLoading(true);
      setBargainItems([]);

      try {
        const data = await priceAPI.getBargainList(region);
        setBargainItems(data);
      } catch (error) {
        console.error("추천 리스트 로드 실패: ", error);
      } finally {
        setLoading(false);
      }
    };
    loadList();
  }, [region]);

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>최적의 물가 데이터를 분석 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="bargain-page-container">
      <header className="bargain-header">
        <div className="header-text">
          <h2 className="title">
            지금이 가장 저렴해요! <span>추천 순위</span>
          </h2>
          <p className="explain">
            평균 가격이 평소 최저가에 근접하여{" "}
            <strong>물가가 가장 안정적인</strong> 품목 리스트
          </p>
        </div>

        <div className="region-filter">
          <label className="label">지역 선택</label>
          <select
            className="selectRegion"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </header>

      <main className="bargain-content">
        <div className="list-wrapper">
          {bargainItems.length > 0 ? (
            bargainItems.map((item, index) => {
              const diffPercent = Math.max(
                0,
                Math.round((1 - item.avgPrice / item.maxPrice) * 100),
              );

              return (
                <div
                  className="bargain-item-card"
                  key={item.productId || index}
                  onClick={() => navigate(`/products/detail/${item.productId}`)}
                >
                  <div className="rank-badge">{index + 1}</div>

                  <div className="item-info">
                    <div className="name-group">
                      <strong className="item-name">{item.itemName}</strong>
                      <span className="item-category">{item.category}</span>
                    </div>
                    <p className="item-sub-info">
                      {item.kindName} | {item.rankName || "일반"}
                    </p>
                    <div className="unit-tag">
                      {item.unitSz}
                      {item.unit} 기준
                    </div>
                  </div>

                  <div className="price-comparison-grid">
                    <div className="price-box current">
                      <span className="price-label">현재 평균가</span>
                      <span className="price-value">
                        {item.avgPrice?.toLocaleString()}원
                      </span>
                    </div>
                    <div className="price-box range">
                      <span className="price-label">최저-최고 범위</span>
                      <span className="price-range">
                        {item.minPrice?.toLocaleString()} ~{" "}
                        {item.maxPrice?.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="saving-highlight">
                    <div className="percent-label">최고가 대비</div>
                    <div className="percent-value">
                      {diffPercent}% <span>SALE</span>
                    </div>
                  </div>

                  <div className="arrow-icon">➔</div>
                </div>
              );
            })
          ) : (
            <div className="no-data-box">
              <p className="noData">해당 지역의 데이터를 불러올 수 없습니다.</p>
            </div>
          )}
        </div>
      </main>

      <footer className="bargain-footer">
        <button
          className="goBackMain"
          type="button"
          onClick={() => navigate("/")}
        >
          메인으로 돌아가기
        </button>
      </footer>
    </div>
  );
};
