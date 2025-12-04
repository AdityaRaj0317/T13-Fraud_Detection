# backend/models/schema.py
from typing import List, Dict, Optional
from pydantic import BaseModel


class ColumnMeta(BaseModel):
    name: str
    type: str  # "numeric" | "categorical" | "datetime"


class FilterOption(BaseModel):
    column: str
    type: str  # "categorical" | "datetime" | "numeric"
    values: Optional[List[str]] = None  # for categorical
    min: Optional[float] = None         # for numeric/datetime (timestamp)
    max: Optional[float] = None


class ChartConfig(BaseModel):
    id: str
    title: str
    chart_type: str  # "bar" | "line" | "pie"
    x_field: str
    y_field: str
    agg_func: str  # "sum" | "mean" | "count"
    # frontend will call /filter-data with filters to get data for this chart


class DashboardResponse(BaseModel):
    dataset_id: str
    columns: List[ColumnMeta]
    filters: List[FilterOption]
    charts: List[ChartConfig]


class FilterCondition(BaseModel):
    column: str
    operator: str  # "eq", "in", "gte", "lte", "between"
    value: Optional[str] = None
    values: Optional[List[str]] = None


class ChartDataRequest(BaseModel):
    dataset_id: str
    chart_id: str
    filters: List[FilterCondition] = []


class ChartDataResponse(BaseModel):
    chart_id: str
    data: List[Dict]  # list of {x: ..., y: ...}
