# backend/services/parser.py
import io
import pandas as pd
from typing import Tuple


def read_file_to_df(filename: str, file_bytes: bytes) -> pd.DataFrame:
    """
    Read CSV or Excel bytes into a pandas DataFrame.
    """
    extension = filename.split(".")[-1].lower()

    buf = io.BytesIO(file_bytes)

    if extension in ["csv"]:
        df = pd.read_csv(buf)
    elif extension in ["xls", "xlsx"]:
        df = pd.read_excel(buf)
    else:
        raise ValueError("Unsupported file type. Please upload CSV or Excel.")

    # Normalize column names (strip & replace spaces)
    df.columns = [str(c).strip() for c in df.columns]
    return df
