# Sambhav Group Portfolio Website

This repository contains the source code for the Sambhav Group's portfolio website. The website showcases the company's projects, press releases, and other relevant information. It is built using Next.js and Next API, with a focus on performance, scalability, and ease of deployment.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [Scripts](#scripts)
- [Deployment](#deployment)
- [License](#license)

## Features

- **Project Showcase**: Detailed information about all the projects undertaken by Sambhav Group.
- **Press Releases**: A dedicated section for the company's press releases.
- **Responsive Design**: Optimized for various screen sizes.
- **Animation and Effects**: Enhanced user experience with animations using GSAP.
- **Cloudinary Integration**: Efficient image and media management.
- **Authentication**: Secure login system with JWT and bcrypt for admin only.

## Technologies Used

- **Next.js**: For server-side rendering and static site generation.
- **React.js**: For building the user interface.
- **Prisma**: ORM for interacting with the PostgreSQL database.
- **Tailwind CSS**: For styling and responsive design.
- **Cloudinary**: For managing and serving images and media files.
- **Postgress**: For database management.
- **Vercel**: For deployment and hosting.

## Setup and Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/sambhav-group.git
   cd sambhav-group
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root of the project and add your environment variables for the database, JWT secret, Cloudinary credentials, etc.

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Build and start the production server**:
   ```bash
   npm run build
   npm start
   ```

## Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm start`: Starts the production server.
- `npm run lint`: Runs ESLint to check for code quality.
- `npm run nextbuild`: Builds and starts the production server.

## Deployment

The website is deployed on Vercel, which is fully integrated with Next.js. To deploy:

1. Push your code to the GitHub repository.
2. Connect the repository to Vercel.
3. Vercel will automatically build and deploy your project.


For any inquiries or issues, please contact the repository owner.

---

**Sambhav Group** - Building the future, today.