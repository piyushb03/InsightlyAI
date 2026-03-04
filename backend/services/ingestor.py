"""
Day 2: Full implementation.
pandas CSV/Excel parser — detects column types, computes stats.
"""
import pandas as pd


def ingest_file(upload_id: str, file_path: str) -> dict:
    # Load file — try common encodings for CSV (Excel exports often use cp1252/latin-1)
    if file_path.endswith(".csv"):
        for enc in ("utf-8", "utf-8-sig", "cp1252", "latin-1"):
            try:
                df = pd.read_csv(file_path, encoding=enc)
                break
            except (UnicodeDecodeError, ValueError):
                continue
        else:
            raise ValueError("Could not decode CSV file. Try saving it as UTF-8.")
    else:
        df = pd.read_excel(file_path)

    col_schema = []
    stats = {}

    # First pass: detect types
    for col in df.columns:
        series = df[col].dropna()
        dtype = _detect_dtype(series)

        if dtype == "date":
            df[col] = pd.to_datetime(df[col], errors="coerce", format="mixed")

        sample_values = series.head(5).tolist()
        sample_values = [_to_py(v) for v in sample_values]

        col_schema.append({
            "name": col,
            "dtype": dtype,
            "unique_count": int(series.nunique()),
            "sample_values": sample_values,
        })

    # Second pass: compute per-column stats
    for entry in col_schema:
        col = entry["name"]
        dtype = entry["dtype"]
        series = df[col].dropna()

        if dtype == "numeric":
            stats[col] = {
                "sum": _to_py(series.sum()),
                "mean": _to_py(series.mean()),
                "min": _to_py(series.min()),
                "max": _to_py(series.max()),
                "nunique": int(series.nunique()),
            }
        elif dtype == "categorical":
            top = series.value_counts().head(10)
            stats[col] = {
                "nunique": int(series.nunique()),
                "top_values": {str(k): int(v) for k, v in top.items()},
            }
        elif dtype == "date":
            parsed = df[col].dropna()
            if len(parsed) > 0:
                stats[col] = {
                    "min": str(parsed.min().date()),
                    "max": str(parsed.max().date()),
                    "nunique": int(parsed.nunique()),
                }

    # Third pass: build time-series aggregations for (date_col, numeric_col) pairs
    date_cols = [e["name"] for e in col_schema if e["dtype"] == "date"]
    numeric_cols = [e["name"] for e in col_schema if e["dtype"] == "numeric"]

    if date_cols and numeric_cols:
        date_col = date_cols[0]
        # Build a monthly aggregation for each numeric column (up to 4)
        df_ts = df[[date_col]].copy()
        df_ts["_period"] = df[date_col].dt.to_period("M")

        ts_data = {}
        for num_col in numeric_cols[:4]:
            monthly = (
                df[[date_col, num_col]]
                .assign(_period=df[date_col].dt.to_period("M"))
                .groupby("_period")[num_col]
                .sum()
                .reset_index()
            )
            monthly["_period"] = monthly["_period"].astype(str)
            ts_data[num_col] = [
                {"date": row["_period"], "value": _to_py(row[num_col])}
                for _, row in monthly.iterrows()
            ]

        stats["_time_series"] = {
            "date_col": date_col,
            "series": ts_data,
        }

    return {
        "row_count": len(df),
        "col_schema": col_schema,
        "stats": stats,
    }


def _detect_dtype(series: pd.Series) -> str:
    """Detect whether a series is date, numeric, or categorical."""
    if pd.api.types.is_numeric_dtype(series):
        return "numeric"

    if pd.api.types.is_datetime64_any_dtype(series):
        return "date"

    # pandas 3.0 uses str/StringDtype for text; older pandas uses object
    dtype_kind = getattr(series.dtype, "kind", None)
    is_string = series.dtype == object or dtype_kind == "U" or pd.api.types.is_string_dtype(series)

    if is_string:
        try:
            parsed = pd.to_datetime(series, errors="coerce", format="mixed")
            if parsed.notna().mean() > 0.5:
                return "date"
        except Exception:
            pass

    return "categorical"


def _to_py(val):
    """Convert numpy types to native Python for JSON serialization."""
    import numpy as np
    if isinstance(val, (np.integer,)):
        return int(val)
    if isinstance(val, (np.floating,)):
        return float(val)
    if isinstance(val, (np.bool_,)):
        return bool(val)
    if isinstance(val, float) and (val != val):  # NaN check
        return None
    return val
