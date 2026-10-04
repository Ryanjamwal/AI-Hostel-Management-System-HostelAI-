# HostelAI ER Diagram Overview

## 1. Entity Relationship Summary
The core entities in HostelAI form a relational model for hostel operations and student lifecycle management.

```text
Users
  1 ── 0..1 Students
  1 ── 0..* Notifications

Students
  1 ── 0..* Allocations
  1 ── 0..* Attendance
  1 ── 0..* Complaints
  1 ── 0..* LeaveRequests
  1 ── 0..* Payments
  1 ── 0..* Invoices
  1 ── 0..* Visitors

Rooms
  1 ── 0..* Beds
  1 ── 0..* Allocations
  1 ── 0..* Complaints

Allocations
  1 ── 1 Students
  1 ── 1 Rooms
  0..1 ── 1 Beds

Complaints
  1 ── 1 Students
  1 ── 1 Rooms

LeaveRequests
  1 ── 1 Students

Payments
  1 ── 1 Students

Invoices
  1 ── 1 Students

Visitors
  1 ── 1 Students
```

## 2. Suggested Logical Relationships
- A user can own a student profile.
- A student may be assigned to one room at a time through allocations.
- A room contains multiple beds and can receive multiple complaints.
- Attendance, leave requests, payments, and visitors are all related to the student entity.

## 3. Backend Implementation Plan
1. Create entity models for Users, Students, Rooms, Beds, Allocations, Attendance, Complaints, LeaveRequests, Payments, Invoices, Visitors, and Notifications.
2. Add EF Core DbContext and configure relationships.
3. Create initial migration for the core schema.
4. Add repositories or services for each domain.
5. Expose API controllers for the main modules.

## 4. Recommended Next Step
Implement the core entities in Entity Framework Core and generate the first migration for the backend.
