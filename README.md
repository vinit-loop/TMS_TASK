# TMS



Key Features & Implementation Flow

1.User Roles & Authentication

The system includes two types of users:
Admin: Has full control over category management (CRUD operations).
Normal User: Can access category data but has restricted operational permissions.can not create anything,
Users must log in with their credentials to access the system.

2.Category Creation & Hierarchy

Categories can be created as either parent categories or subcategories under existing categories.
Categories are displayed in both tree structure (hierarchical view) and dropdown format for easy selection.
Users can create multiple subcategories under a single parent.

3.CRUD Operations

Create:
A category is created with a name, parent category (if applicable), and status (active/inactive).
Read:
Categories can be retrieved in a structured format, displaying hierarchical relationships.
Update:
Admins can rename or update category status.
Delete:
When a parent category is deleted, all its subcategories are recursively deleted.

4.Conditional Hierarchy Rules

If a parent category is marked inactive, all its child categories automatically become inactive.
Changes to a child category do not affect the parent category.

5.Role-Based Access Control (RBAC)

Admins can manage all category operations.
Normal Users can only view categories without modification rights.


for start the project 

do npm i at frontend and backend both side and then start command is npm start at both side.
