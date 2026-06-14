# Contributing to Emergency Medical Portal

We're excited that you're interested in contributing to the Emergency Medical Portal project! Here's how you can help:

## Reporting Issues

- Use the GitHub issue tracker to report bugs or suggest features.
- Check if the issue already exists before creating a new one.
- Provide as much detail as possible in issue reports.

## Contributing Code

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Write your code, adhering to the project's coding standards
4. Write or update tests as necessary
5. Ensure all tests pass
6. Submit a pull request with a clear description of your changes

## Backend Development Setup

The backend lives in `src/api` and is a Flask application backed by SQLite.

```bash
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
python -m src.api.app
```

By default, the local development database is created in Flask's `instance/`
folder as `emergency_portal.db`. Do not commit generated SQLite databases.
Use `DATABASE_URI` to point the app at another database when needed.

Run backend tests with:

```bash
python -m unittest discover -s tests
```

## Frontend Development Setup

```bash
cd frontend
npm install
npm run dev
```

## Coding Standards

- Keep backend changes focused and covered by tests.
- Return JSON for API errors.
- Keep generated files, local databases, caches, and build outputs out of git.
- Update README or docs when setup commands or API behavior changes.

## Community

- Join our [Discord/Slack] channel for discussions
- Follow us on Twitter [@EmergencyMedPortal] for updates

Thank you for your interest in improving emergency medical services!
