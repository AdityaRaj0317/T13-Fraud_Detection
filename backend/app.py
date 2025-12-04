# backend/app.py
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict
import uuid

from models.schema import (
    DashboardResponse,
    ChartDataRequest,
    ChartDataResponse,
    ColumnMeta,
    FilterOption,
    ChartConfig,
)
from services.parser import read_file_to_df
from services.viz_engine import generate_default_dashboard, apply_filters, build_chart_data
from data_store import DATASETS, DASHBOARDS, CHART_INDEX

app = FastAPI(title="Auto Dashboard Backend")

# CORS (adjust origins as per your frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # during dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/upload", response_model=DashboardResponse)
async def upload_file(file: UploadFile = File(...)):
    try:
        content = await file.read()
        df = read_file_to_df(file.filename, content)

        if df.empty:
            raise HTTPException(status_code=400, detail="File contains no data.")

        # Generate dataset ID
        dataset_id = str(uuid.uuid4())

        # Build dashboard config
        dashboard_raw = generate_default_dashboard(df)

        # Store in memory
        DATASETS[dataset_id] = df
        DASHBOARDS[dataset_id] = dashboard_raw

        # Build chart index
        CHART_INDEX.clear()
        for chart in dashboard_raw["charts"]:
            CHART_INDEX[f"{dataset_id}:{chart['id']}"] = chart

        # Convert to Pydantic models
        columns = [
            ColumnMeta(name=col, type=col_type)
            for col, col_type in dashboard_raw["columns"].items()
        ]

        filters = [FilterOption(**f) for f in dashboard_raw["filters"]]
        charts = [ChartConfig(**c) for c in dashboard_raw["charts"]]

        return DashboardResponse(
            dataset_id=dataset_id,
            columns=columns,
            filters=filters,
            charts=charts,
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error parsing file: {e}")


@app.post("/chart-data", response_model=ChartDataResponse)
async def get_chart_data(req: ChartDataRequest):
    dataset_id = req.dataset_id
    chart_id = req.chart_id

    if dataset_id not in DATASETS:
        raise HTTPException(status_code=404, detail="Dataset not found")

    key = f"{dataset_id}:{chart_id}"
    if key not in CHART_INDEX:
        raise HTTPException(status_code=404, detail="Chart config not found")

    df = DATASETS[dataset_id]
    chart_config = CHART_INDEX[key]

    # Convert filters to simple dicts
    filters = [f.dict() for f in req.filters]

    filtered_df = apply_filters(df, filters)
    data = build_chart_data(filtered_df, chart_config)

    return ChartDataResponse(chart_id=chart_id, data=data)
