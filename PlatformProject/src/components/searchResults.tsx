import { useEffect, useState } from "react";
import type { productDTO } from "../types/DTO";
import { priceAPI } from "../api/Api";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../css/SearchResults.css";

export const SearchResults = () => {
  const [searchResults, setSearchResults] = useState<productDTO[]>([]);
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (keyword) {
      setLoading(true);
      const userRegion = localStorage.getItem("userRegion") || "서울";
      priceAPI
        .getSearch(keyword, userRegion)
        .then(setSearchResults)
        .finally(() => setLoading(false));
    }
  }, [keyword]);

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>가격 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="search-results-container">
      <header className="search-header-zone">
        <h2 className="search-main-title">
          "<span>{keyword}</span>" 검색 결과
        </h2>
        <div className="search-count-badge">총 {searchResults.length}건</div>
      </header>

      <main className="search-table-card">
        <div className="table-responsive-wrapper">
          <table className="search-premium-table">
            <thead>
              <tr>
                <th className="th-item-name">품목명</th>
                <th className="th-kind-name">품종</th>
                <th className="th-category">카테고리</th>
                <th className="th-unit">단위 규격</th>
                <th className="th-avg-price">현재 평균가</th>
                <th className="th-arrow"></th>
              </tr>
            </thead>
            <tbody>
              {searchResults.length > 0 ? (
                searchResults.map((item) => {
                  const pId = item.productId;
                  const iName = item.itemName;
                  const kName = item.kindName || "-";
                  const cat = item.category;

                  const hasUnit = item.unitSz || item.unit;
                  const unitText = hasUnit
                    ? `${item.unitSz || ""} ${item.unit || ""}`
                    : "-";

                  return (
                    <tr
                      key={pId?.toString()}
                      className="search-data-tr"
                      onClick={() => navigate(`/products/detail/${pId}`)}
                    >
                      <td className="td-item-name">
                        <span className="name-click-target">{iName}</span>
                      </td>
                      <td className="td-kind-name">
                        <span>{kName}</span>
                      </td>
                      <td className="td-category">
                        <span className="cat-badge">{cat}</span>
                      </td>
                      <td className="td-unit">{unitText}</td>
                      <td className="td-avg-price">
                        {item.avgPrice ? (
                          <strong className="price-active">
                            {item.avgPrice.toLocaleString()}원
                          </strong>
                        ) : (
                          <span className="price-none">정보 없음</span>
                        )}
                      </td>
                      <td className="td-arrow">➔</td>
                    </tr>
                  );
                })
              ) : (
                <tr className="search-no-data-tr">
                  <td colSpan={6}>
                    <div className="search-empty-box">
                      <span className="empty-icon">🔍</span>
                      <p className="empty-text">
                        "{keyword}"에 일치하는 농수산물 정보가 부재합니다.
                      </p>
                      <p className="empty-sub">
                        오타가 없는지 확인하거나 다른 키워드로 검색해 보세요.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className="search-action-area">
          <button
            className="search-back-btn"
            type="button"
            onClick={() => navigate(-1)}
          >
            뒤로가기
          </button>
        </footer>
      </main>
    </div>
  );
};

export default SearchResults;
