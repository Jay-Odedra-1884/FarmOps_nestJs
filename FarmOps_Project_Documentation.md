# FarmOps - Comprehensive Project Documentation
 
## 1. Project Overview & Detailing

**FarmOps** is a modern, responsive web application tailored for farm management and expense tracking. It bridges the gap between agricultural operations and financial accountability by allowing farmers and farm managers to track expenses, manage multiple farms (listings), categorize financial records, and get real-time insights into their business operations.

### Core Objectives:

- **Centralized Data:** Keep all farm-related financial records in one accessible place.
- **Granular Tracking:** Track expenses and incomes globally or attach them strictly to individual farm entities.
- **Customization:** Let users define custom expense categories specific to their agricultural needs alongside a robust set of global defaults.
- **Speed & Usability:** Provide a quick, seamless user experience using modern frontend techniques (optimistic UI updates, targeted data fetching, complex reusable modals).

### Technology Stack:

- **Frontend Layer:** Built using **Next.js** and React. Utilizes TailwindCSS for dynamic, responsive styling. It acts as the Client handling UI state, Modals, and API interactions.
- **Backend API Layer:** Powered by **Laravel (PHP)**. Exposes RESTful API endpoints for the client while securely authenticating via Laravel Sanctum. Follows the MVC (Model-View-Controller) structure using controllers like `ExpenseController` and `FarmController`.
- **Data Layer:** Uses a relational **MySQL** database. Interacts with the backend via Eloquent ORM for smooth, paginated queries.

---

## 2. System Architecture Diagram

This diagram illustrates the 3-Tier architecture linking the user interface to the business logic and storage.

```mermaid
graph TD;
    User((User)) -->|HTTPS Requests| Frontend

    subgraph Client Tier [Frontend - Next.js]
        Frontend[Web Application\n(React, Tailwind)]
    end

    Frontend -->|REST API Calls\nJSON Payload| Backend

    subgraph Server Tier [Backend API - Laravel]
        Backend[Backend Logic\n(Controllers, Routing, Sanctum)]
    end

    Backend -->|Eloquent ORM\nSQL Queries| Database

    subgraph Data Tier [Storage]
        Database[(MySQL Database)]
    end
```

---

## 3. Use Case Diagram

This overview maps out the capabilities an authenticated user leverages within FarmOps.

```mermaid
graph LR
    Actor_User((Farm Manager\n/ User))

    subgraph FarmOps Application Features
        UC1([Login / Authenticate])
        UC2([View Analytical Dashboard])
        UC3([Manage Farm Listings])
        UC4([Manage Financial Expenses])
        UC5([Manage Custom Categories])
    end

    Actor_User --> UC1
    Actor_User --> UC2
    Actor_User --> UC3
    Actor_User --> UC4
    Actor_User --> UC5

    %% Implicit relationships
    UC4 -.->|Uses| UC5
    UC2 -.->|Navigates To| UC3
```

---

## 4. Sequence / Workflow Diagram

This sequence maps out the internal flow of a standard user interacting with the platform from authentication to executing expense CRUD operations.

```mermaid
sequenceDiagram
    actor U as User
    participant F as Next.js Frontend
    participant B as Laravel Backend API
    participant D as Database

    U->>F: Open FarmOps Application
    F->>B: Login Request (Credentials)
    B->>D: Validate User Credentials
    D-->>B: User Record
    B-->>F: Auth Token (Success)
    F-->>U: Render Dashboard

    U->>F: Navigate to Farm Details
    F->>B: Fetch Farm Info & Paginated Expenses
    B->>D: Query Farm & Related Expenses
    D-->>B: Expense Dataset
    B-->>F: JSON Response
    F-->>U: Render Farm Component View

    U->>F: Open Expense Modal & Submit Details
    F->>B: POST /api/expenses
    B->>D: Insert Expense Row
    D-->>B: Record Confirmed
    B-->>F: Success Status
    F-->>U: Dynamic List Update (No reload)
```

---

## 5. Class / Data Model Diagram (ERD)

The underlying database relationships handling Users, Farms, Categories, and Expenses.

```mermaid
erDiagram
    USER ||--o{ FARM : manages
    USER ||--o{ EXPENSE : records
    USER ||--o{ CATEGORY : "creates custom"

    FARM ||--o{ EXPENSE : "has assigned"
    CATEGORY ||--o{ EXPENSE : "groups"

    USER {
        int id PK
        string name
        string email
        string password
    }

    FARM {
        int id PK
        int user_id FK
        string farm_name
        string location
        text description
    }

    EXPENSE {
        int id PK
        int user_id FK
        int farm_id FK "nullable"
        int category_id FK
        decimal amount
        date expense_date
        string type "income or expense"
    }

    CATEGORY {
        int id PK
        string title
        string scope "global | user"
        int user_id FK "nullable"
    }
```

---

## 6. User Interaction Workflow Outline

The direct step-by-step navigation map the User experiences on the web interface.

```mermaid
stateDiagram-v2
    [*] --> LoginScreen

    LoginScreen --> DashboardPage : Successful Login
    LoginScreen --> LoginScreen : Invalid Credentials

    DashboardPage --> FarmListingsPage : View Managed Farms
    DashboardPage --> GlobalExpensesView : View All Financials

    FarmListingsPage --> SpecificFarmDetails : Click Farm Card
    SpecificFarmDetails --> ExpenseModal : Click 'Add/Edit Expense'

    state ExpenseModal {
        [*] --> FillForm
        FillForm --> SelectCategory
        SelectCategory --> TriggerSave
    }

    ExpenseModal --> SpecificFarmDetails : Save Successful
    SpecificFarmDetails --> DashboardPage : Return to Overview
```
