The AI-Powered Full-Stack Creator Project

This repository contains a series of exercises that build upon each other, starting from fundamental web technologies and culminating in a functional e-commerce storefront built with React and TypeScript.

Project Structure

The project is divided into three main phases, each located in its own directory:

01-html-css-exercise/: A basic exercise focusing on HTML structure and CSS styling to create static web content.

02-typescript-exercises/: An introduction to TypeScript for data modeling, defining the shapes of the data used in the final application.

03-react-app/: The main project—an interactive e-commerce storefront for a luxury beauty brand.

📂 01-html-css-exercise

This folder contains a simple, static website created using only HTML and CSS.

Purpose: To practice fundamental web development by building profile cards for K-pop idols.

Contents:

index.html: The main HTML file containing the structure of the profile cards.

jennie-kim.jpg, lisa-manobal.jpg: Image assets used in the HTML.

How to View: Simply open the index.html file directly in any web browser.

📂 02-typescript-exercises

This folder contains TypeScript files focused on defining data structures.

Purpose: To practice data modeling with TypeScript, preparing structured data for use in a larger application.

Contents:

idolStats.ts: Defines an Idol interface and creates objects for different K-pop idols.

makeupPalette.ts: Defines the data structure for makeup products.

How to Use: These are code-only exercises. You can view the code to understand the data structures or compile and run them using a TypeScript compiler (tsc) to see the console output.

📂 03-react-app

This is the main application—a dynamic and interactive e-commerce storefront for a luxury makeup brand.

Purpose: To build a functional front-end application using modern web technologies.

Features:

Dynamic product grid that renders makeup items.

Client-side filtering by category and price range.

An interactive, auto-scrolling image carousel in the header.

Wishlist functionality that saves user selections to the browser's local storage.

Technology Stack:

React / Next.js (using the App Router structure)

TypeScript

CSS for styling

🚀 How to Run This Application

To run the React application on your local machine, follow these steps:

Navigate to the Directory:
Open your terminal and change to the 03-react-app directory:

cd D:/The_AI-Powered_Full_Stack_Creator/The_AI-Powered_Full_Stack_Creator/03-react-app


Install Dependencies:
If you haven't already, install the necessary packages using npm:

npm install


Run the Development Server:
Start the application with the following command:

npm run dev


View in Browser:
Open your web browser and go to the local address provided in the terminal (usually http://localhost:5173).