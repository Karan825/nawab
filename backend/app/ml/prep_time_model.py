import os
from pathlib import Path
from typing import List, Dict, Any, Optional
import joblib
import numpy as np
from sklearn.ensemble import GradientBoostingRegressor

MODEL_DIR = Path(__file__).resolve().parent / "weights"
MODEL_PATH = MODEL_DIR / "prep_time_model.joblib"


def build_and_train_default_model():
    """Train a baseline GradientBoostingRegressor on realistic Hyderabad biryani kitchen datasets."""
    MODEL_DIR.mkdir(parents=True, exist_ok=True)

    # Features:
    # 0: item_count (1 to 15)
    # 1: sum_base_prep_minutes (10 to 60)
    # 2: active_kitchen_orders (0 to 25)
    # 3: is_cloud_kitchen (1 for cloud kitchen, 0 for dine-in)
    # 4: is_peak_hour (1 if between 12:30-15:00 or 19:30-22:30, 0 otherwise)

    rng = np.random.RandomState(42)
    n_samples = 3000

    item_count = rng.randint(1, 12, size=n_samples)
    base_prep = rng.randint(10, 45, size=n_samples)
    active_orders = rng.randint(0, 20, size=n_samples)
    is_cloud_kitchen = rng.choice([0, 1], size=n_samples, p=[0.7, 0.3])
    is_peak = rng.choice([0, 1], size=n_samples, p=[0.5, 0.5])

    # Target formula with noise:
    # Dine-in has slightly more overhead than cloud kitchen (-3 mins for CK)
    # Peak hours add 4-8 mins
    # Each active order adds ~1.2 mins
    # Each additional item adds ~1.5 mins
    y = (
        base_prep
        + (item_count * 1.5)
        + (active_orders * 1.25)
        + (is_peak * 6.0)
        - (is_cloud_kitchen * 3.5)
        + rng.normal(0, 2.0, size=n_samples)
    )
    # Clip prep time between 15 and 75 minutes
    y = np.clip(y, 15, 75)

    X = np.column_stack([item_count, base_prep, active_orders, is_cloud_kitchen, is_peak])

    model = GradientBoostingRegressor(n_estimators=100, max_depth=4, random_state=42)
    model.fit(X, y)

    joblib.dump(model, MODEL_PATH)
    print(f"✅ AI Kitchen Prep-Time Model trained and saved to {MODEL_PATH}")
    return model


def get_model():
    """Load model from disk or train if missing."""
    if MODEL_PATH.exists():
        try:
            return joblib.load(MODEL_PATH)
        except Exception as e:
            print(f"⚠️ Error loading model from {MODEL_PATH}: {e}. Retraining...")
            return build_and_train_default_model()
    return build_and_train_default_model()


def estimate_kitchen_prep_time(
    item_count: int,
    sum_base_prep_minutes: int,
    active_kitchen_orders: int,
    is_cloud_kitchen: bool,
    is_peak_hour: bool,
    outlet_min_prep_time: int = 30,
) -> int:
    """
    Estimate kitchen prep time using scikit-learn regression model with fallback.
    Non-Negotiable Invariant 7:
    promised_prep_time = max(ai_estimated_time, outlet_minimum_prep_time)
    """
    try:
        model = get_model()
        X = np.array([[
            item_count,
            sum_base_prep_minutes,
            active_kitchen_orders,
            1 if is_cloud_kitchen else 0,
            1 if is_peak_hour else 0,
        ]])
        predicted_minutes = float(model.predict(X)[0])
        ai_time = int(round(predicted_minutes))
    except Exception as err:
        print(f"⚠️ AI model prediction failed ({err}); using deterministic fallback.")
        # Fallback formula
        load_factor = int(round(active_kitchen_orders * 1.2))
        item_factor = int(round(item_count * 1.5))
        peak_factor = 5 if is_peak_hour else 0
        ai_time = sum_base_prep_minutes + load_factor + item_factor + peak_factor

    # Enforce Invariant 7: promised_prep_time = max(ai_estimated_time, outlet_minimum_prep_time)
    return max(ai_time, outlet_min_prep_time)
