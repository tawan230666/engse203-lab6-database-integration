# ENGSE203 — สัปดาห์ที่ 8: Database Integration (Phase 2)

Case Study: **Agent Wallboard System**  
Course: **ENGSE203 การเขียนโปรแกรมสำหรับวิศวกรซอฟต์แวร์**

## 3‑Phase Plan
| Phase | Focus | Duration | Complexity | Key Learning |
|---|---|---|---|---|
| 1 | Basic API + CRUD | 4 hrs | ⭐ Beginner | Express.js, RESTful API, In‑memory |
| 2 | Database + Simple WebSocket | 4 hrs | ⭐⭐ Intermediate | MongoDB basics, Real‑time |
| 3 | Authentication + Production | 4 hrs | ⭐⭐⭐ Advanced | JWT, Deploy |

**Today = Phase 2**: Add MongoDB persistence + structure your backend professionally.

---

## Why Backend?
Frontend‑only → ข้อมูลไม่ sync, ไม่มี persistence, ทำ real‑time ยาก.  
Backend แก้ด้วย: Centralized Data, Real‑time (WebSocket), Persistence, Business Logic, Security.

---

## Node.js & Express.js Recap
- **Node.js**: V8 runtime, event‑driven, non‑blocking I/O, NPM ecosystem
- **Express.js**: minimal web framework, middleware, routing, large community
- **CORS**: เปิดสื่อสาร Frontend (Electron/React) ↔ Backend
- **REST Design**: resource‑based URLs + correct HTTP methods & status codes

---

## Core API Endpoints (Phase 2 scope)
Agents
```
GET    /api/agents
GET    /api/agents/:id
POST   /api/agents/:id/login
POST   /api/agents/:id/logout
PATCH  /api/agents/:id/status
```
Messages (สเกลตัน, ทำเพิ่มเองได้)
```
POST   /api/messages
GET    /api/messages/agent/:id
PUT    /api/messages/:id/read
```

---

## Project Structure (recommended)
```
agent-wallboard-backend/
  controllers/      # Business logic
  middleware/       # Auth, validation, error handler
  models/           # Mongoose schemas
  routes/           # Express routers
  services/         # Domain services
  utils/            # Logger, helpers
  config/           # DB connect, env
  tests/            # Unit/Integration tests
  .env              # (create from .env.example)
  package.json
  server.js
docs/
  Lab6-Notes.md
  Postman_Collection.json
```

---

## Quick Start
```bash
cd agent-wallboard-backend
cp .env.example .env     # แก้ DATABASE_URL/PORT ตามเครื่อง
npm install
npm run dev              # nodemon
# หรือ
npm start                # node
```

### .env (ตัวอย่าง)
ดูไฟล์ `.env.example` ในแพ็กเกจ

---

## Health & Metrics
- `GET /health` : ตรวจสถานะระบบและฐานข้อมูล
- (Optional) `GET /metrics` : ตัวอย่าง metrics payload

---

## Testing (เบื้องต้น)
- แถมตัวอย่าง test โครง (Mocha/Chai/Supertest) — เติมเองได้ตามโจทย์

---

## Notes
เอกสารสรุปย้ายไว้ที่ `docs/Lab6-Notes.md` (ย่อยจากสไลด์/เนื้อหาที่ให้มา)
