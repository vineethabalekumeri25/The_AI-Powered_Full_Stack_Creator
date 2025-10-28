Phase 2: The Next.js Evolution - The High-Fashion Show

Objective

The primary goal of this phase was to transition from basic frontend concepts to building a complete, multi-page web application using the modern and powerful Next.js framework. This involved setting up a new project, understanding its file-based routing system, implementing navigation, and creating shared layouts for a consistent user experience.

Project: Style Journal App (style-journal)

This phase culminated in the creation of a basic Next.js application named style-journal, located within this directory (04-nextjs-app).

Key Concepts Learned & Implemented

Step 4: Your First Next.js App

Task 1: Setup & Page Routing

Concept: Learned how to initialize a new Next.js project using npx create-next-app.

Concept: Understood Next.js's file-system-based routing within the app directory (or pages directory in older versions). Creating a file like app/trends/page.tsx automatically creates a route at /trends.

Exercise: Created the style-journal app with three distinct pages:

Homepage (app/page.tsx)

Trends Page (app/trends/page.tsx)

Journal Page (app/journal/page.tsx)

Task 2: Linking Pages

Concept: Learned the importance of the <Link> component from next/link for client-side navigation. Understood how it enables faster page transitions compared to standard <a> tags by preventing full page reloads.

Exercise: Implemented a simple navigation bar (components/navbar.tsx) using the <Link> component to allow users to navigate between the Home, Trends, and Journal pages.

Task 3: Shared Layouts

Concept: Understood how Next.js (specifically using the App Router) utilizes a root app/layout.tsx file to define a consistent structure that wraps all pages.

Exercise:

Created reusable Navbar (components/navbar.tsx) and Footer (components/footer.tsx) components.

Integrated these components into the root app/layout.tsx file, ensuring they appear consistently across all three created pages.

How to Run This Project

Navigate to the project directory:

cd 04-nextjs-app 

Install dependencies:

npm install


Run the development server:

npm run dev


View in browser:
Open your web browser and go to http://localhost:3000.

Outcome

This phase successfully established a foundational multi-page Next.js application, demonstrating key framework features like routing, client-side navigation, and shared UI layouts. This serves as the base for further development in subsequent phases.