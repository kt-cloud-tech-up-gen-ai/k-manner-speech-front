import importlib.util
import os
import unittest
from pathlib import Path
from unittest.mock import patch


MODULE_PATH = Path(__file__).with_name("sync.py")


def load_sync():
    spec = importlib.util.spec_from_file_location("figma_sync", MODULE_PATH)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


class FigmaConfigTests(unittest.TestCase):
    def test_file_key_is_single_configurable_source(self) -> None:
        with patch.dict(os.environ, {"FIGMA_FILE_KEY": "replacement-key"}):
            sync = load_sync()

        self.assertEqual(sync.FILE_KEY, "replacement-key")
        self.assertEqual(
            sync.file_url(),
            "https://api.figma.com/v1/files/replacement-key",
            "AC-FIGMA-FILE-KEY-CONFIGURABLE",
        )
        self.assertIn("/v1/images/replacement-key?", sync.images_url(["1:2"]))


if __name__ == "__main__":
    unittest.main()
