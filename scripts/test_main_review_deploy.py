import copy
import unittest
from check_main_review_deploy import REVIEW_URL, SITE_ID, validate_result


class ReviewDeployTests(unittest.TestCase):
    def setUp(self):
        self.sha = "a" * 40
        self.deploy = {"site_id": SITE_ID, "state": "ready", "context": "branch-deploy",
                       "branch": "main-review", "title": f"Iris Green canonical main review {self.sha}",
                       "deploy_ssl_url": REVIEW_URL, "available_functions": [{"n": "sabik-voice-proxy"}]}
        self.site = {"id": SITE_ID, "sso_login": True, "sso_login_context": "non_production",
                     "published_deploy": {"id": "maintenance-id", "locked": True, "title": "Public maintenance"}}

    def test_ready_review_preserving_maintenance(self):
        validate_result(self.deploy, self.site, self.sha, "maintenance-id")

    def test_rejects_wrong_or_incomplete_deploy(self):
        for key, bad in (("state", "error"), ("context", "production"), ("branch", "feature"),
                         ("title", "another commit"), ("site_id", "another site"),
                         ("available_functions", []), ("published_at", "2026-10-06"),
                         ("deploy_ssl_url", "https://another.example")):
            with self.subTest(key=key):
                deploy = {**self.deploy, key: bad}
                with self.assertRaises(ValueError):
                    validate_result(deploy, self.site, self.sha, "maintenance-id")

    def test_rejects_changed_production_or_access(self):
        for key, bad in (("id", "other"), ("locked", False), ("title", "Product")):
            with self.subTest(key=key):
                site = copy.deepcopy(self.site)
                site["published_deploy"][key] = bad
                with self.assertRaises(ValueError):
                    validate_result(self.deploy, site, self.sha, "maintenance-id")
        for key, bad in (("sso_login", False), ("sso_login_context", "all")):
            with self.subTest(key=key):
                with self.assertRaises(ValueError):
                    validate_result(self.deploy, {**self.site, key: bad}, self.sha, "maintenance-id")


if __name__ == "__main__":
    unittest.main()
