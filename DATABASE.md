# HostelAI Database Design

## 1. Overview
The database is designed to support hostel operations, student lifecycle management, finance, visitor tracking, complaints, and AI-driven insights.

## 2. Core Tables
### Users
Stores authentication and role information.
- UserId
- FullName
- Email
- PasswordHash
- Role
- IsActive
- CreatedAt

### Students
Represents hostel residents.
- StudentId
- UserId
- StudentCode
- Department
- YearOfStudy
- PhoneNumber
- EmergencyContact
- MedicalInfo

### Rooms
Represents available hostel rooms.
- RoomId
- RoomNumber
- Floor
- Capacity
- RoomType
- Status

### Beds
Represents physical bed allocations inside rooms.
- BedId
- RoomId
- BedNumber
- Status

### Allocations
Tracks student-to-room assignments.
- AllocationId
- StudentId
- RoomId
- BedId
- CheckInDate
- CheckOutDate
- Status

### Attendance
Stores attendance records.
- AttendanceId
- StudentId
- Date
- Status
- Method
- VerifiedBy

### Visitors
Tracks visitor entry and exit logs.
- VisitorId
- StudentId
- VisitorName
- VisitorPhone
- CheckInTime
- CheckOutTime
- Approved
- Purpose

### Complaints
Stores maintenance or service complaints.
- ComplaintId
- StudentId
- RoomId
- Category
- Description
- Priority
- Status
- AssignedTo
- CreatedAt

### LeaveRequests
Tracks student leave applications.
- LeaveRequestId
- StudentId
- StartDate
- EndDate
- Reason
- Status
- ApprovedBy

### Payments
Stores financial transactions.
- PaymentId
- StudentId
- Amount
- Type
- Status
- PaymentDate
- ReferenceNumber

### Invoices
Keeps generated invoices records.
- InvoiceId
- StudentId
- InvoiceNumber
- Amount
- DueDate
- Status

### Announcements
Stores notices and updates.
- AnnouncementId
- Title
- Message
- CreatedBy
- CreatedAt

### Notifications
Tracks messages sent to users.
- NotificationId
- UserId
- Type
- Message
- IsRead
- CreatedAt

## 3. Relationship Summary
- One User can have one Student profile.
- One Room has many Beds.
- One Student has many Allocations over time.
- One Student has many Attendance records.
- One Student can have many Complaints and LeaveRequests.
- One Student can have many Payments and Invoices.
- One Student can have many Visitors.

## 4. Suggested Indexes
- StudentId in Attendance, Complaints, Payments
- RoomId in Allocations and Complaints
- Status in LeaveRequests and Complaints
- CreatedAt in Announcements and Notifications

## 5. Future Database Extensions
- MessMenu and FoodRatings
- Laundry and Inventory tables
- AIRecommendations and AuditLogs
- IoT sensor and maintenance prediction tables
