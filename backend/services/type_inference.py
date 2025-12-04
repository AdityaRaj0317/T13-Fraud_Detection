# backend/services/type_inference.py
import pandas as pd
from typing import Dict


def infer_column_types(df: pd.DataFrame) -> Dict[str, str]:
    """
    Return mapping: column_name -> "numeric" | "categorical" | "datetime"
    """
    col_types = {}

    for col in df.columns:
        series = df[col]
        # Try datetime
        try:
            parsed = pd.to_datetime(series, errors="raise")
            # if many unique values, treat as datetime
            col_types[col] = "datetime"
            continue
        except Exception:
            pass

        if pd.api.types.is_numeric_dtype(series):
            col_types[col] = "numeric"
        else:
            # default: categorical
            col_types[col] = "categorical"

    return col_types
