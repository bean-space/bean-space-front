import { useEffect, useState } from "react";
import { getCouponList, issueCoupon } from "../api/coupon";

const CouponContainer = () => {
  const [coupons, setCoupons] = useState([]);

  const fetchCoupons = async () => {
    const data = await getCouponList();
    setCoupons(data);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCouponButtonClick = async (id) => {
    try {
      await issueCoupon(id);
      alert("쿠폰 발급에 성공했습니다.");
      fetchCoupons();
    } catch (error) {
      if (error.response.data) {
        if (error.response.data.code == "401") {
          alert("쿠폰 발급을 위해 로그인을 해주세요.");
        } else {
          alert(error.response.data.msg);
        }
      } else {
        alert("쿠폰 발급에 실패했습니다.");
      }
      return;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}.${month}.${day}`;
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${year}.${month}.${day} ${hours}:${minutes} ~`;
  };

  const getCouponDetailsBox = (coupon) => {
    const now = new Date();
    const startTime = new Date(coupon.issueStartAt);
    const endTime = new Date(coupon.issueEndAt);
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(now.getDate() - 2);
    const isStarted = now >= startTime;
    const isEnded = endTime < now;
    const isOutofStock = coupon.stock == 0;

    if (now < twoDaysAgo) {
      return null;
    }

    if (isEnded) {
      return (
        <button
          style={{
            backgroundColor: "#ccc",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "not-allowed",
          }}
        >
          발급 마감
        </button>
      );
    } else if (isOutofStock) {
      return (
        <button
          style={{
            backgroundColor: "#ccc",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "not-allowed",
          }}
        >
          쿠폰 소진
        </button>
      );
    } else if (!isStarted) {
      return (
        <div>
          <p
            style={{
              margin: "0 0 10px 0",
              fontSize: "12px",
              textAlign: "center",
            }}
          >
            시작 시간 : {formatDateTime(coupon.issueStartAt)}
          </p>
          <p
            style={{
              margin: "0 0 10px 0",
              fontSize: "12px",
              textAlign: "center",
            }}
          >
            발급 수량 : {coupon.totalQuantity}
          </p>
        </div>
      );
    } else {
      return (
        <div
          style={{
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <p
            style={{
              margin: "0 0 10px 0",
              fontSize: "12px",
              textAlign: "center",
            }}
          >
            남은 수량: {coupon.stock} / {coupon.totalQuantity}
          </p>
          <button
            onClick={() => {
              handleCouponButtonClick(coupon.id);
            }}
            style={{
              backgroundColor: "#5bc0de",
              color: "#fff",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            발급 받기
          </button>
        </div>
      );
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        height: "100vh",
        boxSizing: "border-box",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>쿠폰</h2>
      <div
        style={{
          width: "80%",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {coupons.map((coupon) => (
          <div
            key={coupon.id}
            style={{
              display: "flex",
              border: "1px solid #ccc",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#fff",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                flex: 2,
                padding: "20px",
                backgroundColor: "#f9f9f9",
              }}
            >
              <p
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  margin: "0 0 10px 0",
                }}
              >
                {coupon.name}
              </p>
              <p
                style={{
                  margin: "0 0 5px 0",
                  fontSize: "12px",
                }}
              >
                할인율: {coupon.discountRate}%
              </p>
              <p
                style={{
                  margin: "0 0 5px 0",
                  fontSize: "12px",
                }}
              >
                최대 할인 금액: {coupon.maxDiscount}원
              </p>
              <p
                style={{
                  margin: "0",
                  fontSize: "12px",
                }}
              >
                만료 기간: {formatDate(coupon.expirationAt)}
              </p>
            </div>

            <div
              style={{
                flex: 1,
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {getCouponDetailsBox(coupon)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default CouponContainer;
