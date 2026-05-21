# ScreamRose 電吉他購物網站

電吉他主題電商平台，個人獨立開發專題。

## 技術架構

- 後端：Java / Spring Boot / Spring Data JPA / Maven
- 資料庫：MariaDB
- 驗證：JWT（JSON Web Token）+ Role-based 權限控制
- 前端：HTML / CSS / JavaScript
- 部署：Render + Aiven + Cloudinary

## 功能介紹

**前台（用戶端）**
- 商品列表、價格篩選、顏色即時切換
- 購物車、結帳流程
- 會員登入／註冊、歷史訂單查詢

**後台（ADMIN）**
- 商品新增／編輯／刪除
- 訂單管理
- JWT 驗證，非 ADMIN 無法存取

## 線上展示

https://screamrose-demo.onrender.com

> 注意：使用免費版 Render，閒置時會進入休眠，首次開啟請稍等約 30 秒。
