import importlib
import os
import tempfile
import unittest
from pathlib import Path

import src.api.app as app_module


class MediSyncApiTests(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        database_path = Path(self.temp_dir.name) / "test_emergency_portal.db"
        self.original_database_uri = os.environ.get("DATABASE_URI")
        os.environ["DATABASE_URI"] = f"sqlite:///{database_path.as_posix()}"

        self.app_module = importlib.reload(app_module)
        self.app = self.app_module.app
        self.cache = self.app_module.cache
        self.db = self.app_module.db
        self.limiter = self.app_module.limiter
        self.resolve_log_level = self.app_module.resolve_log_level
        self.should_enable_debug = self.app_module.should_enable_debug

        self.app.config.update(
            TESTING=True,
            RATELIMIT_ENABLED=False,
            CACHE_TYPE="NullCache",
        )
        self.cache.init_app(self.app)
        self.limiter.enabled = False
        self.client = self.app.test_client()

        with self.app.app_context():
            self.cache.clear()
            self.db.drop_all()
            self.db.create_all()

    def tearDown(self):
        with self.app.app_context():
            self.db.session.remove()
            self.db.drop_all()
            self.cache.clear()
            for engine in self.db.engines.values():
                engine.dispose()

        if self.original_database_uri is None:
            os.environ.pop("DATABASE_URI", None)
        else:
            os.environ["DATABASE_URI"] = self.original_database_uri

        importlib.reload(app_module)
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
        self.assertEqual(self.resolve_log_level("not-a-level"), 20)

    def test_debug_flag_requires_explicit_truthy_value(self):
        self.assertFalse(self.should_enable_debug(None))
        self.assertFalse(self.should_enable_debug("false"))
        self.assertTrue(self.should_enable_debug("true"))


if __name__ == "__main__":
    unittest.main()
