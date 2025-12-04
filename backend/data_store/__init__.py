# backend/data_store/__init__.py
from typing import Dict
import pandas as pd

DATASETS: Dict[str, pd.DataFrame] = {}
DASHBOARDS: Dict[str, Dict] = {}
CHART_INDEX: Dict[str, Dict] = {}  # key: f"{dataset_id}:{chart_id}" -> chart_config
