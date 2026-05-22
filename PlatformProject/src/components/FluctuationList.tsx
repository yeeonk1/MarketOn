import { useEffect, useState } from "react";
import { REGIONS, type productDTO } from "../types/DTO";
import { priceAPI } from "../api/Api";
import { useNavigate } from "react-router-dom";

export const FluctuationList: React.FC = () => {
  const [fluctuationItems, setFluctuationItems] = useState<productDTO[]>([]);
  const navigate = useNavigate();

  const [region, setRegion] = useState(
    localStorage.getItem("userRegion") || "서울",
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await priceAPI.getFluctuationList(region, true);

        if (Array.isArray(data)) {
          setFluctuationItems(data);
        } else if (data && data.content) {
          setFluctuationItems(data.content);
        }
      } catch (error) {
        console.error("인기 목록 로드 실패: ", error);
      }
    };
    loadData();
  }, [region]);

  return (
    <div className="table-container">
      <div className="table-card">
        <h2 className="table-title">지금 구매하세요</h2>

        <div className="region-select">
          <span className="region">지역 </span>
          <select value={region} onChange={(e) => setRegion(e.target.value)}>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <table className="table-list">
          <thead className="th-list">
            <tr className="th-tr-list">
              <th className="rank">순위</th>
              <th className="item-name">품목</th>
              <th className="price">가격</th>
              <th className="category">카테고리</th>
              <th className="kind-name">품종</th>
              <th className="rank-name">등급</th>
              <th className="unit-size">단위크기</th>
              <th className="unit">단위</th>
            </tr>
          </thead>

          <tbody className="td-list">
            {Array.isArray(fluctuationItems) && fluctuationItems.length > 0 ? (
              fluctuationItems.map((item, index) => (
                <tr
                  className="td-tr-list"
                  key={item.productId?.toString() || index}
                >
                  <td className="rank-data">{index + 1}</td>
                  <td
                    className="item-name-data"
                    onClick={() =>
                      navigate(`/products/detail/${item.productId}`)
                    }
                    style={{ cursor: "pointer" }}
                  >
                    {item.itemName}
                  </td>
                  <td className="price-data">
                    {item.avgPrice ? item.avgPrice.toLocaleString() : 0}원
                  </td>
                  <td className="category-data">{item.category}</td>
                  <td className="kind-name-data">{item.kindName || "-"}</td>
                  <td className="rank-name-data">{item.rankName || "-"}</td>
                  <td className="unit-size-data">{item.unitSz}</td>
                  <td className="unit-data">{item.unit}</td>
                </tr>
              ))
            ) : (
              <tr className="no-data">
                <td colSpan={7} className="no-data-explain">
                  목록을 표시할 수 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FluctuationList;
