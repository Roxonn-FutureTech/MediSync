import tempfile
import unittest
from pathlib import Path

from src.api.app import (
    app,
    cache,
    db,
    limiter,
    resolve_log_level,
    should_enable_debug,
)


class MediSyncApiTests(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        database_path = Path(self.temp_dir.name) / "test_emergency_portal.db"
        self.original_config = {
            "TESTING": app.config.get("TESTING"),
            "SQLALCHEMY_DATABASE_URI": app.config.get("SQLALCHEMY_DATABASE_URI"),
            "RATELIMIT_ENABLED": app.config.get("RATELIMIT_ENABLED"),
            "CACHE_TYPE": app.config.get("CACHE_TYPE"),
        }
        self.original_limiter_enabled = limiter.enabled
        app.config.update(
            TESTING=True,
            SQLALCHEMY_DATABASE_URI=f"sqlite:///{database_path.as_posix()}",
            RATELIMIT_ENABLED=False,
            CACHE_TYPE="NullCache",
        )
        cache.init_app(app)
        limiter.enabled = False
        self.client = app.test_client()
        with app.app_context():
            cache.clear()
            db.drop_all()
            db.create_all()

    def tearDown(self):
        with app.app_context():
            db.session.remove()
            db.drop_all()
            db.engine.dispose()
            cache.clear()
        app.config.update(self.original_config)
        cache.init_app(app)
        limiter.enabled = self.original_limiter_enabled
        self.temp_dir.cleanup()

    def test_health_check(self):
        response = self.client.get("/health")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), {"status": "OK"})

    def test_register_and_list_hospital(self):
        payload = {
            "name": "General Hospital",
            "address": "123 Main St",
            "phone": "+12345678901",
            "capacity": 100,
        }

        created = self.client.post("/api/hospitals", json=payload)
        listed = self.client.get("/api/hospitals")

        self.assertEqual(created.status_code, 201)
        self.assertEqual(created.get_json()["name"], payload["name"])
        self.assertEqual(listed.status_code, 200)
        self.assertEqual(len(listed.get_json()), 1)

    def test_validation_errors_return_json(self):
        response = self.client.post("/api/hospitals", json={"name": ""})

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json()["error"], "Validation Error")

    def test_missing_hospital_returns_json_404(self):
        response = self.client.get("/api/hospitals/999")

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.get_json()["error"], "Not Found")

    def test_invalid_log_level_falls_back_to_info(self):
        self.assertEqual(resolve_log_level("not-a-level"), 20)

    def test_debug_flag_requires_explicit_truthy_value(self):
        self.assertFalse(should_enable_debug(None))
        self.assertFalse(should_enable_debug("false"))
        self.assertTrue(should_enable_debug("true"))


if __name__ == "__main__":
    unittest.main()
