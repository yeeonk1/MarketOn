import { useEffect, useState } from "react";
import axios from "axios";
import { ANALYSIS_ITEMS, REGIONS } from "../types/DTO";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export const Analysis = () => {
  const navigate = useNavigate();

  const [itemName, setItemName] = useState<string>("배추");
  const [region, setRegion] = useState<string>(
    localStorage.getItem("userRegion") || "서울",
  );
  const [period, setPeriod] = useState<number>(30);

  const [options, setOptions] = useState<any[]>([]);
  const [selectedOptIdx, setSelectedOptIdx] = useState<number>(0);

  const [analysisData, setAnalysisData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get("/api/products/analysis/options", {
          params: { itemName },
        });
        const validOptions = response.data || [];
        setOptions(validOptions);
        setSelectedOptIdx(0);
      } catch (error) {
        console.error("하위 옵션 조합 데이터 로드 실패: ", error);
        setOptions([]);
      }
    };
    fetchOptions();
  }, [itemName]);

  useEffect(() => {
    if (options.length === 0 || !options[selectedOptIdx]) {
      setAnalysisData([]);
      return;
    }

    const fetchAnalysis = async () => {
      setLoading(true);
      try {
        const currentOpt = options[selectedOptIdx];

        const response = await axios.get("/api/products/analysis", {
          params: {
            itemName,
            region,
            period,
            kindName: currentOpt.kindName,
            rankName: currentOpt.rankName,
            unitSz: currentOpt.unitSz,
            unit: currentOpt.unit,
          },
        });
        console.log("정밀 시세 분석 응답 데이터:", response.data);
        setAnalysisData(response.data || []);
      } catch (error) {
        console.error("정밀 시세 분석 데이터 로드 실패: ", error);
        setAnalysisData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [itemName, region, period, options, selectedOptIdx]);

  return (
    <div
      className="analysis-container"
      style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}
    >
      <header className="analysis-header" style={{ marginBottom: "25px" }}>
        <h2 style={{ margin: 0, color: "#333" }}>
          📊 전국 농산물 시세 동향 분석
        </h2>
        <p style={{ color: "#666", margin: "5px 0 0 0" }}>
          원하는 품목과 동적 규격을 선택하여 왜곡 없는 1대1 가격 추이를 정밀
          분석하세요.
        </p>
      </header>

      <section
        className="filter-zone"
        style={{
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
          background: "#f8f9fa",
          padding: "15px",
          borderRadius: "10px",
          marginBottom: "25px",
          alignItems: "center",
        }}
      >
        <div className="filter-group">
          <label style={{ marginRight: "8px", fontWeight: "bold" }}>품목</label>
          <select
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            style={{
              padding: "6px 12px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          >
            {ANALYSIS_ITEMS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label style={{ marginRight: "8px", fontWeight: "bold" }}>
            세부 규격 조합
          </label>
          <select
            value={selectedOptIdx}
            onChange={(e) => setSelectedOptIdx(Number(e.target.value))}
            style={{
              padding: "6px 12px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              background: "#fff",
              maxWidth: "400px",
            }}
            disabled={options.length === 0}
          >
            {options.length > 0 ? (
              options.map((opt, idx) => (
                <option key={idx} value={idx}>
                  {opt.kindName} / {opt.rankName}등급 / {opt.unitSz}
                  {opt.unit}
                </option>
              ))
            ) : (
              <option>세부 규격을 불러오는 중...</option>
            )}
          </select>
        </div>

        <div className="filter-group">
          <label style={{ marginRight: "8px", fontWeight: "bold" }}>지역</label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            style={{
              padding: "6px 12px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          >
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group" style={{ marginLeft: "auto" }}>
          {[7, 30, 90, 365].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              style={{
                padding: "6px 15px",
                marginLeft: "5px",
                borderRadius: "5px",
                border: "1px solid #1890ff",
                background: period === p ? "#1890ff" : "#fff",
                color: period === p ? "#fff" : "#1890ff",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              {p === 365 ? "1년" : `${p}일`}
            </button>
          ))}
        </div>
      </section>

      <section
        className="chart-zone"
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          marginBottom: "30px",
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: "20px", color: "#222" }}>
          📈 {region} 지역 [{itemName} -{" "}
          {options[selectedOptIdx]?.kindName || ""}] 시세 추이 ({period}일
          데이터)
        </h3>

        {loading ? (
          <div
            style={{
              height: "350px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#999",
            }}
          >
            정밀 계산을 진행하고 있습니다. 잠시만 기다려주세요...
          </div>
        ) : analysisData.length > 0 ? (
          <div style={{ width: "100%", height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={analysisData}
                margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#8c8c8c" fontSize={12} />
                <YAxis
                  stroke="#8c8c8c"
                  fontSize={12}
                  tickFormatter={(val) => `${val.toLocaleString()}원`}
                />
                <Tooltip
                  formatter={(value: any) => [`${value.toLocaleString()}원`]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="avgPrice"
                  name="평균 가격"
                  stroke="#1890ff"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="maxPrice"
                  name="최고 가격"
                  stroke="#ff4d4f"
                  strokeDasharray="4 4"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="minPrice"
                  name="최저 가격"
                  stroke="#52c41a"
                  strokeDasharray="4 4"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div
            style={{
              height: "350px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#999",
            }}
          >
            해당 조건(품종, 등급, 규격)에 일치하는 시세 통계 데이터가 존재하지
            않습니다.
          </div>
        )}
      </section>

      {/* ■ 3단 구역: 일자별 누적 세부 시세 정보 테이블 리스트 */}
      <section
        className="table-zone"
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: "15px" }}>
          📋 일자별 정밀 시세 명세서
        </h3>
        <div
          style={{
            maxHeight: "300px",
            overflowY: "auto",
            border: "1px solid #f0f0f0",
            borderRadius: "6px",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "center",
            }}
          >
            <thead
              style={{
                position: "sticky",
                top: 0,
                background: "#fafafa",
                borderBottom: "2px solid #eee",
                zIndex: 10,
              }}
            >
              <tr>
                <th style={{ padding: "12px 8px" }}>조회 일자</th>
                <th>품목명</th>
                <th>품종</th>
                <th>등급</th>
                <th>단위 규격</th>
                <th>평균가</th>
                <th>최고가</th>
                <th>최저가</th>
              </tr>
            </thead>
            <tbody>
              {analysisData.length > 0 ? (
                [...analysisData].reverse().map((row, idx) => {
                  // 💡 안전한 렌더링을 위해 현재 선택된 동적 옵션(품종, 등급, 규격 등)을 확보합니다.
                  const currentOpt = options[selectedOptIdx];

                  return (
                    <tr
                      key={row.date || idx}
                      style={{ borderBottom: "1px solid #f0f0f0" }}
                    >
                      <td style={{ padding: "10px 8px", color: "#555" }}>
                        {row.date}
                      </td>

                      {/* 💡 [수정] row 자체에 itemName이 있다면 그것을 먼저 뿌리고, 없다면 상단 선택된 메인 품목명(itemName)을 강제로 동기화합니다. */}
                      <td style={{ fontWeight: "bold", color: "#222" }}>
                        {row.itemName || itemName}
                      </td>

                      {/* 💡 품종과 등급도 현재 선택된 동적 옵션의 값으로 정확하게 고정 출력 */}
                      <td style={{ color: "#666" }}>
                        {row.kindName || currentOpt?.kindName || "-"}
                      </td>
                      <td style={{ color: "#8c8c8c" }}>
                        {row.rankName || currentOpt?.rankName || "일반"}
                      </td>

                      {/* 단위 규격 매핑 */}
                      <td style={{ color: "#111", fontWeight: "600" }}>
                        {row.unitSz || currentOpt?.unitSz}
                        {row.unit || currentOpt?.unit}
                      </td>

                      <td style={{ color: "#1890ff", fontWeight: "bold" }}>
                        {row.avgPrice?.toLocaleString()}원
                      </td>
                      <td style={{ color: "#ff4d4f" }}>
                        {row.maxPrice?.toLocaleString()}원
                      </td>
                      <td style={{ color: "#52c41a" }}>
                        {row.minPrice?.toLocaleString()}원
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} style={{ padding: "20px", color: "#999" }}>
                    선택한 규격 조합의 내역이 존재하지 않습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <footer
        style={{
          marginTop: "25px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <button
          type="button"
          onClick={() => navigate("/")}
          style={{
            padding: "10px 20px",
            borderRadius: "6px",
            border: "1px solid #d9d9d9",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          메인으로 이동
        </button>
      </footer>
    </div>
  );
};

export default Analysis;
