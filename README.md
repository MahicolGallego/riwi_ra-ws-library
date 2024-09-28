<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://img.local.mx/2018/03/destacada3.jpg" width="70%" /></a>
</p>

# Riwi - Workshop Library API NestJS

## Description

RESTful API built with NestJS for managing books in small libraries.

The API includes user registration, request validation via API_KEY through headers, and authorization management using RBAC.

## Proposed Solution

The solution consists of two types of users: **admin** and **user**. Admins can perform CRUD operations on the existing books in their library, while users can only view available books.

Users register with their name and email address, and each is assigned a unique API KEY.

## Security

Security is enforced through API KEY validation, which must be included in the request headers. Depending on their role, RBAC authorization will allow or deny the requested operation.

## Architecture Pattern Used

### Composition of the Repository Pattern

The Repository Pattern typically consists of the following layers:

- **Model**:

  - Represents the data structure and business logic.
  - Defines the attributes and behaviors of the entities in the application.

- **View**:

  - The user interface that displays data to the user.
  - Handles user interactions and presents information from the model.

- **Controller**:

  - Acts as an intermediary between the model and the view.
  - Processes user input, manipulates the model, and updates the view accordingly.

- **Repository**:
  - Abstracts the logic for data access and persistence.
  - Provides methods for querying and manipulating data, allowing for separation of responsibilities between data handling and business logic.

This pattern helps keep the application organized and maintainable by clearly separating responsibilities.

## Running the Project

### Prerequisites

Before running the NestJS project, ensure you have the following installed on your system:

- **Node.js**:

  - Version: v14.x or higher (recommended: LTS version)
  - Download from: [Node.js Official Website](https://nodejs.org/)

- **npm (Node Package Manager)**:

  - npm comes bundled with Node.js.

- **Git**:

  - For version control and repository management.
  - Install Git from: [Git Official Website](https://git-scm.com/)

- **Postman or cURL** (optional):
  - For testing API endpoints easily.
  - Download Postman from: [Postman Official Website](https://www.postman.com/)

### Create Database

Create a PostgreSQL database with a service provider. You can use the same one utilized in the project's creation: Aiven Cloud [Aiven Cloud](https://aiven.io/).

With the provided connection URI, set up your environment variables:

- Based on the `.env.template` file found in the root of the project, create a `.env` file in the root directory of the project.
- Copy and paste the content of `.env.template` into the newly created `.env` file.

- Assign the appropriate values according to the URI or variables provided by your selected service provider.

# Project Setup

### Open Terminal in Project Directory

## Install Dependencies

To install the project dependencies, run the following command:

```bash
npm i
```

## Run the Project

To start the project in development mode, use:

```bash
npm run start:dev
```

## SQL Querys with necessary data

```sql

-- Inserts to permissions

INSERT INTO permissions (entity, role, "write", "read", "update", "delete") VALUES
('books', 'admin', TRUE, TRUE, TRUE, TRUE),
('books', 'user', FALSE, TRUE, FALSE, FALSE);

```

You can also insert this user and book data to just focus on testing the functionality.

```sql

-- Inserts to users
INSERT INTO users (name, email, role, api_key) VALUES
( 'Jhon Wel', 'john@techcorp.com', 'user', 'a4dbf025ac0cfe8f1fedf511877867e163916d97'),
( 'Alice Smith', 'alice@techcorp.com', 'user', '04549e31b67656654d7d9fa1d6cfc602462ec9e'),
( 'Bob Johnson', 'bob@techcorp.com', 'user', 'b62713354b753a37cccde0f9a1a3099a27f1dd7'),
( 'Charlie Brown', 'charlie@techcorp.com', 'user', '12fd706549136df05313d967afdd99921d7f6d1'),
( 'Eve Davis', 'eve@techcorp.com', 'user', '9dd6a17df1d524318ad7e6e75ecf4a90e324103d'),
( 'Admin User 1', 'admin1@techcorp.com', 'admin', 'd2c7b5f23d8f5c2f1e3a7b9c8e4d1a5b7c6f1e2a'),
( 'Admin User 2', 'admin2@techcorp.com', 'admin', 'abf3e7d4c2b1f0e9a8c7b2e1d5a6c3f4b8d7e1c2'),
( 'Admin User 3', 'admin3@techcorp.com', 'admin', '7d8f2a5b1c9e4a2d3f6b8c1e5d7a4e3f0b9c8d1e');

-- Inserts to books
INSERT INTO books (isbn, author, title, gender, publish_date) VALUES
('978-3-16-148410-0', 'John Doe', 'Learning SQL', 'Technology', '2020-05-10'),
('978-1-23-456789-7', 'Jane Smith', 'Mastering Python', 'Technology', '2019-08-15'),
('978-0-12-345678-9', 'John Doe', 'Data Science Basics', 'Technology', '2021-01-22'),
('978-1-40-289462-3', 'Emily Davis', 'The Art of Cooking', 'Cooking', '2020-11-05'),
('978-1-56-789123-4', 'John Doe', 'Advanced SQL', 'Technology', '2022-03-01'),
('978-0-00-000000-0', 'Alice Johnson', 'Gardening 101', 'Lifestyle', '2018-06-20'),
('978-3-16-148410-9', 'John Doe', 'SQL for Beginners', 'Technology', '2023-02-18'),
('978-1-23-456789-0', 'Emily Davis', 'Baking Secrets', 'Cooking', '2019-07-30'),
('978-1-40-289462-7', 'Michael Brown', 'The Great Outdoors', 'Travel', '2020-12-01'),
('978-0-12-345678-1', 'Alice Johnson', 'Home Improvement', 'Lifestyle', '2017-04-14'),
('978-1-23-456789-9', 'Jane Smith', 'The Future of Tech', 'Technology', '2022-05-25'),
('978-3-16-148410-1', 'Emily Davis', 'Healthy Eating', 'Health', '2021-09-09'),
('978-1-56-789123-7', 'Michael Brown', 'Travel Tips', 'Travel', '2018-10-11'),
('978-0-00-000000-1', 'John Doe', 'Culinary Techniques', 'Cooking', '2020-01-01'),
('978-1-40-289462-1', 'Alice Johnson', 'Mindfulness Practices', 'Health', '2019-02-28'),
('978-1-23-456789-1', 'Jane Smith', 'Blockchain Explained', 'Technology', '2021-11-15'),
('978-3-16-148410-2', 'Michael Brown', 'Traveling on a Budget', 'Travel', '2022-07-30'),
('978-0-12-345678-2', 'John Doe', 'Food Science', 'Cooking', '2023-04-25'),
('978-1-56-789123-5', 'Emily Davis', 'Fitness Fundamentals', 'Health', '2021-03-03'),
('978-1-23-456789-2', 'Alice Johnson', 'DIY Projects', 'Lifestyle', '2020-08-19'),
('978-0-00-000000-2', 'Jane Smith', 'Introduction to AI', 'Technology', '2023-06-12');
```

## Documentation

Once the project is running successfully, you can access the Swagger documentation for the API at:

[http://localhost:3000/library/api/v1/docs](http://localhost:3000/library/api/v1/docs)

## PDF UML Diagrams

You can find the UML diagrams in the following link:

[UML Diagrams PDF](https://drive.google.com/file/d/1yO4q7bCh5TIN-XC_rUyVzDcskA4xyMFc/view?usp=sharing)

## License

[MIT licensed](LICENSE).
