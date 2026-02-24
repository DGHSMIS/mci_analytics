# Tech Stack - MCI Analytics

This document details the technology stack and libraries used in the MCI Analytics application.

## Core Framework
- **Next.js (v14)**: The core React framework used for both frontend and backend (API routes). It provides Server-Side Rendering (SSR) capabilities which are used for initial dashboard data loading.

## User Interface & Styling
- **Tailwind CSS**: A utility-first CSS framework used for most of the application's styling and layout.
- **Material UI (MUI)**: Used for core UI components like icons (`@mui/icons-material`) and date pickers (`@mui/x-date-pickers`).
- **Bootstrap (v5)**: Included for some legacy or specific UI components (`react-bootstrap`).
- **Styled Components / Emotion**: Used for component-level styling, often in conjunction with MUI.
- **Sass**: Used for global styles and complex styling logic (`globals.scss`).

## Data Visualization
- **Nivo**: A rich set of data visualization components built on top of D3. Used for bars, lines, and pie charts.
- **Highcharts**: Used for complex charts and interactive data visualizations (`highcharts-react-official`).

## State Management & Data Fetching
- **Zustand**: A small, fast, and scalable bearbones state-management solution. Used for managing global application state, initialized using `StoreInitializer`.
- **React Query (TanStack Query)**: Used for fetching, caching, and synchronizing asynchronous data from API routes.

## Database & Storage
- **Prisma**: The primary ORM used for interacting with PostgreSQL and MySQL databases.
- **ElasticSearch**: Used for high-performance searching and analytics queries.
- **Cassandra**: A distributed NoSQL database used for handling large volumes of health data.
- **Minio**: An object storage server used for storing files and media.
- **Pg (node-postgres)**: Used for direct PostgreSQL interactions when needed.

## Standards & Health Data
- **FHIR (Fast Healthcare Interoperability Resources)**: The application follows FHIR standards for representing health data (`fhir`, `@types/fhir`).
- **FHIR UI**: Specific UI components for handling FHIR data.

## Authentication
- **NextAuth.js**: The complete open-source authentication solution for Next.js applications.

## Utilities
- **Moment.js / Date-fns**: Used for date and time manipulation.
- **Lodash**: A modern JavaScript utility library delivering modularity, performance & extras.
- **UUID**: Used for generating unique identifiers.
- **XLSX / jsPDF**: Used for exporting data to Excel and PDF formats.
