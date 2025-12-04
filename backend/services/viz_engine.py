# backend/services/viz_engine.py
import pandas as pd
from typing import Dict, List
from .type_inference import infer_column_types


def generate_default_dashboard(df: pd.DataFrame) -> Dict:
    col_types = infer_column_types(df)

    numeric_cols = [c for c, t in col_types.items() if t == "numeric"]
    cat_cols = [c for c, t in col_types.items() if t == "categorical"]
    dt_cols = [c for c, t in col_types.items() if t == "datetime"]

    charts = []
    chart_id = 1

    # 1. Bar chart: first categorical vs first numeric
    if cat_cols and numeric_cols:
        charts.append({
            "id": f"chart_{chart_id}",
            "title": f"{numeric_cols[0]} by {cat_cols[0]}",
            "chart_type": "bar",
            "x_field": cat_cols[0],
            "y_field": numeric_cols[0],
            "agg_func": "sum",
        })
        chart_id += 1

    # 2. Line chart: first datetime vs first numeric
    if dt_cols and numeric_cols:
        charts.append({
            "id": f"chart_{chart_id}",
            "title": f"{numeric_cols[0]} over time",
            "chart_type": "line",
            "x_field": dt_cols[0],
            "y_field": numeric_cols[0],
            "agg_func": "sum",
        })
        chart_id += 1

    # 3. Pie chart: categorical proportion (using count of rows)
    if cat_cols:
        charts.append({
            "id": f"chart_{chart_id}",
            "title": f"Distribution of {cat_cols[0]}",
            "chart_type": "pie",
            "x_field": cat_cols[0],
            "y_field": "__count__",
            "agg_func": "count",
        })

    # Filters
    filters = []

    # Categorical filter options
    for col in cat_cols:
        values = df[col].dropna().astype(str).unique().tolist()[:50]
        filters.append({
            "column": col,
            "type": "categorical",
            "values": values,
        })

    # Numeric & datetime min/max
    for col in numeric_cols + dt_cols:
        series = df[col]
        filters.append({
            "column": col,
            "type": col_types[col],
            "min": float(series.min()) if len(series) else None,
            "max": float(series.max()) if len(series) else None,
        })

    return {
        "columns": col_types,
        "charts": charts,
        "filters": filters,
    }


def apply_filters(df: pd.DataFrame, filters: List[Dict]) -> pd.DataFrame:
    filtered = df.copy()
    for f in filters:
        col = f["column"]
        op = f["operator"]
        if op == "eq" and f.get("value") is not None:
            filtered = filtered[filtered[col].astype(str) == str(f["value"])]
        elif op == "in" and f.get("values"):
            filtered = filtered[filtered[col].astype(str).isin([str(v) for v in f["values"]])]
        elif op == "gte" and f.get("value") is not None:
            filtered = filtered[filtered[col] >= f["value"]]
        elif op == "lte" and f.get("value") is not None:
            filtered = filtered[filtered[col] <= f["value"]]
        elif op == "between" and f.get("values") and len(f["values"]) == 2:
            low, high = f["values"]
            filtered = filtered[(filtered[col] >= low) & (filtered[col] <= high)]
    return filtered


def build_chart_data(df: pd.DataFrame, chart_config: Dict) -> List[Dict]:
    x_field = chart_config["x_field"]
    y_field = chart_config["y_field"]
    agg = chart_config["agg_func"]

    if y_field == "__count__":
        grouped = df.groupby(x_field).size().reset_index(name="value")
    else:
        grouped = df.groupby(x_field)[y_field].agg(agg).reset_index(name="value")

    # rename columns to x, y for frontend simplicity
    grouped = grouped.rename(columns={x_field: "x", "value": "y"})
    return grouped.to_dict(orient="records")
