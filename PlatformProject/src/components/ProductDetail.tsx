import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { priceAPI, userAPI } from "../api/Api";
import { REGIONS, type ProductAnalysisDetailDTO } from "../types/DTO";
import "../css/ProductDetail.css";

const CURRENT_USER_IDX = 1;

export const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<ProductAnalysisDetailDTO | null>(null);
  const [region, setRegion] = useState(
    localStorage.getItem("userRegion") || "서울",
  );
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!productId) {
        return;
      }

      setLoading(true);

      if (productId) {
        try {
          const data = await priceAPI.getProductDetail(productId, region);
          setProduct(data as unknown as ProductAnalysisDetailDTO);

          const favStatus = await userAPI.checkFavStatus(
            CURRENT_USER_IDX,
            Number(productId),
          );
          setIsFavorite(favStatus);
        } catch (error) {
          console.error("상세 정보 또는 찜 상태 로드 실패: ", error);
        } finally {
          setLoading(false);
        }
      }
    };
    console.log("현재 요청 지역:", region, "상품ID: ", productId);
    fetchDetail();
  }, [productId, region]);

  const handleFavoriteToggle = async () => {
    if (!productId) return;
    try {
      const result = await userAPI.toggleFav(
        CURRENT_USER_IDX,
        Number(productId),
      );

      setIsFavorite(result.isFavorite);
      alert(result.message);
    } catch (error) {
      console.error("관심 품목 등록 실패: ", error);
      alert("관심 품목 처리 중 에러가 발생했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>제품 상세 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="detailCard">
        <div className="detail-top-bar">
          <div className="main-title-zone">
            <span className="mini-lbl-badge">
              {product?.category || "식품"}
            </span>
            <h1 className="giant-title">{product?.itemName || "상세 정보"}</h1>
          </div>
          <div className="region-select-wrapper">
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="chooseRegion"
            >
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        <main className="detail-main">
          {product !== null ? (
            <div className="detail-content-frame">
              <section className="product-group-card info-summary-box">
                <div className="info-grid">
                  <div className="info-item">
                    <span className="lbl">카테고리</span>{" "}
                    <span className="val">{product.category}</span>
                  </div>
                  <div className="info-item">
                    <span className="lbl">품종</span>{" "}
                    <span className="val">{product.kindName || "일반"}</span>
                  </div>
                  <div className="info-item">
                    <span className="lbl">기준 단위</span>{" "}
                    <span className="val">
                      {product.unitSz || "정보없음"} {product.unit || ""}
                    </span>
                  </div>
                </div>
              </section>

              <section className="price-summary-card">
                <div className="price-block avg">
                  <span className="price-lbl">{region} 평균 마켓가</span>
                  <strong className="price-val">
                    {product.avgPrice.toLocaleString()}원
                  </strong>
                </div>
                <div className="price-divider"></div>
                <div className="price-sub-grid">
                  <div className="price-block max">
                    <span className="price-lbl">최고가</span>
                    <span className="price-val-sub">
                      {product.maxPrice?.toLocaleString()}원
                    </span>
                  </div>
                  <div className="price-block min">
                    <span className="price-lbl">최저가</span>
                    <span className="price-val-sub">
                      {product.minPrice?.toLocaleString()}원
                    </span>
                  </div>
                </div>

                <div className="action-btns">
                  <button
                    onClick={handleFavoriteToggle}
                    type="button"
                    className={`like-toggle-btn ${isFavorite ? "liked" : ""}`}
                  >
                    {isFavorite ? "❤️ 관심 해제" : "🤍 관심 등록"}
                  </button>
                </div>
              </section>

              <section className="ai-report-section">
                <h3 className="section-inside-title">
                  실시간 시세 분석 리포트
                </h3>
                <div className="ai-report-grid">
                  <div className="ai-box score-box">
                    <div className="ai-box-header">
                      AI 구매 적합도 가성비 점수
                    </div>
                    <div className="ai-box-value">
                      <strong className="huge-score">
                        {product.costEffectiveScore}
                      </strong>
                      <span className="max-score">/ 100점</span>
                    </div>
                    <p className="ai-box-desc">
                      {product.costEffectiveScore >= 70
                        ? "🟢 현재 시세가 최저가 방어선에 가까워 손해 보지 않는 합리적인 구매 타이밍입니다!"
                        : "🔴 도매 마켓 단가가 최고점에 가깝게 굳어 있습니다. 시급하지 않다면 조율을 추천합니다."}
                    </p>
                  </div>

                  <div className="ai-box risk-box">
                    <div className="ai-box-header">
                      시장 가격 변동 위험도 등급
                    </div>
                    <div className="ai-box-value">
                      <span
                        className={`risk-tag ${
                          product.priceRiskLevel === "위험"
                            ? "danger"
                            : product.priceRiskLevel === "경계"
                              ? "warning"
                              : "safe"
                        }`}
                      >
                        {product.priceRiskLevel}
                      </span>
                    </div>
                    <p className="ai-box-desc">
                      이번 주 최고-최저 시세 진폭률은{" "}
                      <strong>{product.priceVolatility}%</strong> 입니다.
                      {product.priceRiskLevel === "위험"
                        ? " 산지 기후 변화 등으로 시세 요동이 극심하니 바가지 물가에 유의하세요."
                        : " 변동 굴곡이 완만하고 고른 정찰제형 안정 흐름이 유지되고 있습니다."}
                    </p>
                  </div>
                </div>
              </section>
            </div>
          ) : (
            <div className="no-data-box">
              <p className="noData">
                선택하신 지역(<strong>{region}</strong>)에는 해당 상품의 최신
                가격 정보가 존재하지 않습니다.
              </p>
            </div>
          )}
        </main>

        <div className="back-btn-wrapper">
          <button className="modern-back-btn" onClick={() => navigate(-1)}>
            목록으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
