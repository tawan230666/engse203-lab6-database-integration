# Lab 6 Notes — Database Integration & MongoDB

ประเด็นสำคัญ:
- Event loop & non‑blocking I/O → เหมาะ I/O intensive และ real‑time
- Express middleware chain: Logging → Auth → Validation → Route → Error handler
- CORS ต้องกำหนด origin ให้ถูก (dev: localhost, prod: domain จริง)
- Status code สำคัญมาก **200/201/400/401/404/500**
- Validation ก่อน mutate: ใช้ Joi / custom checks
- Environment variables: `.env` (PORT, DATABASE_URL, JWT_SECRET, CORS_ORIGIN)
- Logging: ใช้ `winston` (file + console), แยกระดับ **error/warn/info/debug**
- Real‑time: ใช้ `socket.io` เมื่อมีการเปลี่ยนสถานะ agent
- Structure: แยก controllers/services/models/routes ชัดเจน
- Health check & graceful shutdown (SIGTERM) เพื่อ production‑readiness
