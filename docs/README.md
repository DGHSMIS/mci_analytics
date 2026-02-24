# MCI Analytics Platform

A comprehensive healthcare analytics dashboard for the Master Client Index (MCI) system used by the Directorate General of Health Services (DGHS) in Bangladesh.

## Overview

The MCI Analytics Platform is a Next.js-based web application that provides real-time analytics and insights into healthcare data across Bangladesh. It serves as a centralized dashboard for monitoring Health Identification (HID) registrations, clinical records, facility statistics, and Non-Communicable Disease (NCD) analytics.

## Purpose

- **Public Dashboard**: Monitor HID registration statistics, clinical records, and facility-wise data
- **NCD Dashboard**: Analyze pediatric NCD statistics and disease patterns
- **Administrative Analytics**: Provide verification analytics and data quality control
- **Data Integration**: Integrate with FHIR servers, identity services, and multiple data sources

## Key Features

### Public Analytics
- Real-time HID registration statistics
- Clinical records analytics by facility
- Demographic analysis (gender, age, division/district)
- Facility-wise performance metrics

### NCD Analytics
- Pediatric NCD statistics and trends
- Disease-wise analytics and reporting
- Lifetime patient statistics
- Aggregated NCD data analysis

### Administrative Tools
- Patient data management and verification
- Facility management and analytics
- Data validation and quality control
- Role-based access control for different user types

## Target Users

- **MCI Admin**: System administrators with full access
- **MCI User**: Regular users with data access
- **SHR User**: Users with specialized health record access

## Data Sources

The platform integrates with multiple data sources:
- PostgreSQL database for structured data
- Elasticsearch for real-time analytics
- Cassandra for patient data storage
- MinIO for file storage
- External FHIR servers and identity services

## Technology Stack

Built with modern web technologies:
- **Frontend**: Next.js 14, React 18, TypeScript
- **UI**: Material-UI, Tailwind CSS, styled-components
- **Data Visualization**: Highcharts, Nivo, React Table
- **State Management**: Zustand
- **Authentication**: NextAuth.js with custom credential provider
- **Database**: PostgreSQL with Prisma ORM, Elasticsearch, Cassandra

## Security & Compliance

The application implements:
- Role-based access control (RBAC)
- Token-based authentication with external identity server
- HRIS-based user authentication
- Data validation and quality control mechanisms

## Deployment

Supports multi-environment deployment:
- Development environment
- Production environment
- Configurable API endpoints and security settings

This platform serves as a critical tool for healthcare data analytics in Bangladesh, providing actionable insights for healthcare policy and service delivery improvement.