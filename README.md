# 🧠 BiteSpeed Identity Reconciliation

This project solves the BiteSpeed Identity Reconciliation Backend Task, where users can be identified via email or phone number and linked across multiple records using a deduplication and reconciliation process.

---

## 🛠️ Tech Stack

- **Node.js** with **Express.js**
- **TypeScript**
- **Sequelize ORM**
- **PostgreSQL** (hosted on [Render](https://render.com))
- **dotenv** for environment config

---

## 📁 Project Structure

```
src/
├── config/            # Sequelize & app config
├── controllers/       # Express route handlers
├── models/            # Sequelize models
├── services/          # Business logic
├── routes/            # Express routers
├── index.ts           # Entry point
.env                   # Environment variables
.env.example           # Example env template
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/rajnsunny/Identity-Reconciliation.git
cd Identity-Reconciliation
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file based on `.env.example`:

```env
DATABASE_HOST=your-render-db-host
DATABASE_PORT=5432
DATABASE_USERNAME=your-db-username
DATABASE_PASSWORD=your-db-password
DATABASE_NAME=your-db-name
PORT=3000
```

### 4. Run the App

**Development Mode:**

```bash
npm run dev
```

**Production Build:**

```bash
npm run build
npm start
```

---

## 🧪 API Endpoint

### POST `/identify`

**Request:**

```json
{
  "email": "george@hillvalley.edu",
  "phoneNumber": "717171"
}
```

**Response:**

```json
{
  "contact": {
    "primaryContactId": 3,
    "emails": [
      "george@hillvalley.edu",
      "biffsucks@hillvalley.edu"
    ],
    "phoneNumbers": [
      "919191",
      "717171"
    ],
    "secondaryContactIds": [
      4
    ]
  }
}
```

---

## 🧠 Logic Summary

- Contacts can be linked by either `email` or `phoneNumber`.
- The **oldest contact** is always considered the **primary**.
- All other matched or related contacts are linked as **secondary** with `linkedId = primary.id`.
- Duplicate primaries are corrected by updating the newest one to secondary.
- Contacts are reconciled in a consolidated format.

---

## 🧹 Useful Scripts

```bash
# Run in dev mode
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

---

## 🧼 Clear All Data (For Development)

To clear all records (optional for dev):

```ts
await db.Contact.destroy({ where: {}, force: true });
```

Use with caution! For dev/test only.

---

## 📄 License

MIT – © 2025
