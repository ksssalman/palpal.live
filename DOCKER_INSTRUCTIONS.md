# Docker Instructions

This project has been set up with Docker to easily build and run the entire application, including the main site and the `work-tracker` sub-project.

## Prerequisites

- Docker
- Docker Compose

## Quick Start

1.  **Build and Run**
    Run the following command in the project root:

    ```bash
    docker compose up --build
    ```

2.  **Access the Application**
    Open [http://localhost:8080](http://localhost:8080) in your browser.

## Architecture

The Docker setup uses a multi-stage `Dockerfile`:

1.  **Build Stage (Node.js)**:

    - Installs dependencies for `projects/work-tracker`.
    - Builds the `work-tracker` using Vite.

2.  **Production Stage (Nginx)**:
    - Copies the static root files (`index.html`, authentication scripts, etc.).
    - Copies the built `work-tracker` artifacts to `/projects/work-tracker/`.
    - Serves everything using Nginx on port 80 (mapped to 8080 locally).

## Configuration

- **Ports**: The application runs on port `8080` by default. You can change this in `docker-compose.yml`.
- **Firebase Config**: The `public/firebase-config.js` file is copied into the image. Ensure this file exists and contains valid configuration for the app to work correctly.

## Troubleshooting

- **Rebuild**: If you make changes to the code, you need to rebuild the options:
  ```bash
  docker compose up --build
  ```
