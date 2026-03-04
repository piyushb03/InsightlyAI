"""
Day 5: Full implementation.
Prophet time-series forecast on local file.
"""
import pandas as pd


def generate_forecast(upload_id: str, file_path: str, date_col: str, target_col: str, horizon_days: int = 90) -> list:
    from prophet import Prophet

    # Load file — try common encodings for CSV
    if file_path.endswith(".csv"):
        for enc in ("utf-8", "utf-8-sig", "cp1252", "latin-1"):
            try:
                df = pd.read_csv(file_path, encoding=enc)
                break
            except (UnicodeDecodeError, ValueError):
                continue
        else:
            raise ValueError("Could not decode CSV file.")
    else:
        df = pd.read_excel(file_path)

    # Prepare Prophet dataframe: requires columns 'ds' and 'y'
    prophet_df = df[[date_col, target_col]].copy()
    prophet_df.columns = ["ds", "y"]
    prophet_df["ds"] = pd.to_datetime(prophet_df["ds"], errors="coerce")
    prophet_df["y"] = pd.to_numeric(prophet_df["y"], errors="coerce")
    prophet_df = prophet_df.dropna()

    if len(prophet_df) < 2:
        raise ValueError("Not enough valid rows to generate a forecast (need at least 2).")

    # Aggregate by day in case of duplicate dates
    prophet_df = prophet_df.groupby("ds", as_index=False)["y"].sum()
    prophet_df = prophet_df.sort_values("ds")

    model = Prophet(daily_seasonality=False, weekly_seasonality=True, yearly_seasonality=True)
    model.fit(prophet_df)

    future = model.make_future_dataframe(periods=horizon_days)
    forecast = model.predict(future)

    result = []
    for _, row in forecast.iterrows():
        result.append({
            "ds": row["ds"].strftime("%Y-%m-%d"),
            "yhat": round(float(row["yhat"]), 2),
            "yhat_lower": round(float(row["yhat_lower"]), 2),
            "yhat_upper": round(float(row["yhat_upper"]), 2),
        })

    return result
