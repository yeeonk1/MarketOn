import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userAPI } from "../api/Api";
import { REGIONS } from "../types/DTO";
import "../css/MyPage.css";

const CURRENT_USER_IDX = 1;

export const MyPage = () => {
  const nav = useNavigate();

  const [userInfo, setUserInfo] = useState<any>(null);
  const [favItems, setFavItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editForm, setEditForm] = useState({
    name: "",
    userRegion: "",
    password: "",
    email: "",
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await userAPI.getMyPageData(CURRENT_USER_IDX);
        setUserInfo(data.userInfo);
        setFavItems(data.favoriteItems || []);
      } catch (error) {
        console.error("마이페이지 데이터 로드 실패: ", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleEditStart = () => {
    setEditForm({
      name: userInfo.name,
      userRegion: userInfo.userRegion,
      password: userInfo.password,
      email: userInfo.email,
    });
    setIsEditing(true);
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userAPI.updateProfile(
        CURRENT_USER_IDX,
        editForm.name,
        editForm.userRegion,
        editForm.password,
        editForm.email,
      );
      setUserInfo((prev: any) => ({
        ...prev,
        name: editForm.name,
        userRegion: editForm.userRegion,
        password: editForm.password,
        email: editForm.email,
      }));
      localStorage.setItem("userRegion", editForm.userRegion);
      alert("내 정보가 성공적으로 수정되었습니다.");
      setIsEditing(false);
    } catch (error) {
      console.error("정보 수정 실패: ", error);
      alert("정보 수정에 실패했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-card">
          <p className="loading-text">마이페이지를 불러오는 중입니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="mypage-header">
        <h1 className="my-page-title">마이페이지</h1>
      </header>
      <div className="my-info-card">
        <section className="profile-section">
          <h2 className="my-info-title">내 정보</h2>
          {userInfo && !isEditing ? (
            <div className="profile-view">
              <p className="my-name">
                이름 | <span> {userInfo.name}</span>
              </p>
              <p className="my-id">
                아이디 | <span>{userInfo.id}</span>
              </p>
              <p className="my-email">
                이메일 | <span>{userInfo.email || "등록 안 됨"}</span>
              </p>
              <p className="my-region">
                내 지역 | <span>{userInfo.userRegion}</span>
              </p>
              <button
                type="button"
                onClick={handleEditStart}
                className="let-edit"
              >
                수정하기
              </button>
            </div>
          ) : (
            <form onSubmit={handleEditSave} className="profile-edit-form">
              <div className="form-group">
                <label htmlFor="edit-name">이름 </label>
                <input
                  className="edit-name"
                  id="edit-name"
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <p className="edit-id">
                  아이디 | <span>{userInfo?.id} (변경 불가)</span>
                </p>
              </div>
              <div className="form-group">
                <input
                  className="edit-pwd"
                  type="email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-region">지역 정보 </label>
                <select
                  className="edit-region"
                  id="edit-region"
                  value={editForm.userRegion}
                  onChange={(e) =>
                    setEditForm({ ...editForm, userRegion: e.target.value })
                  }
                >
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-buttons">
                <button type="submit" className="edit-save">
                  저장
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="edit-cancel"
                >
                  취소
                </button>
              </div>
            </form>
          )}
        </section>
      </div>

      <div className="fav-card">
        <section className="favorites-section">
          <h2 className="fav-title">관심 품목 리스트</h2>
          {favItems && favItems.length > 0 ? (
            <ul
              className="favorite-list"
              style={{
                maxHeight: "300px",
                overflowY: "auto",
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "10px",
              }}
            >
              {favItems.map((item, index) => {
                const pId = item.productId || item.productid || item.PRODUCTID;
                const iName = item.itemName || item.itemname || item.ITEMNAME;
                const cat = item.category || item.CATEGORY;

                return (
                  <li key={pId || index} className="favorite-item">
                    <div className="fav-info">
                      <strong
                        className="item-name-data"
                        style={{
                          cursor: "pointer",
                        }}
                        onClick={() => nav(`/products/detail/${pId}`)}
                      >
                        {iName}
                      </strong>
                      <span className="category-data"> [{cat}]</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="no-data">
              등록된 관심 품목이 없습니다. 상세 페이지에서 하트를 눌러보세요!
            </p>
          )}
        </section>
      </div>

      <div className="notification-card">
        <section className="notification-section">
          <h2 className="notification-title">알림 설정 (보류)</h2>
          <p className="notification-explain">
            ※ 시세 급등락 알림 서비스는 추후 업데이트 예정입니다.
          </p>
        </section>
      </div>

      <footer className="mypage-footer">
        <button type="button" onClick={() => nav("/")}>
          메인으로 이동
        </button>
      </footer>
    </div>
  );
};
