import time
import random
from functools import wraps
from typing import Callable, Any

def retry(max_retries: int = 3, initial_delay: float = 1.0, backoff_factor: float = 2.0):
    """
    Decorator to retry a function call with exponential backoff and jitter.
    """
    def decorator(func: Callable[..., Any]) -> Callable[..., Any]:
        @wraps(func)
        def wrapper(*args: Any, **kwargs: Any) -> Any:
            delay = initial_delay
            for attempt in range(1, max_retries + 1):
                try:
                    # debug log - commented out for production
                    # print(f"[DEBUG] Attempt {attempt} for {func.__name__}")
                    return func(*args, **kwargs)
                except Exception as e:
                    # TODO: Allow passing a tuple of specific exceptions to catch 
                    # (e.g. (ValueError, ConnectionError)) instead of a broad catch-all.
                    if attempt == max_retries:
                        print(f"Error: All {max_retries} attempts failed. Raising last exception.")
                        raise e
                    
                    # Add proportional jitter (10% of current delay) to prevent synchronized retries
                    jitter = random.uniform(0, 0.1 * delay)
                    sleep_time = delay + jitter
                    
                    print(f"Warning: {func.__name__} failed (attempt {attempt}/{max_retries}) due to: {e}. Retrying in {sleep_time:.2f}s...")
                    time.sleep(sleep_time)
                    
                    # Increase delay for next run
                    delay *= backoff_factor
        return wrapper
    return decorator

# --- Manual Test ---
if __name__ == "__main__":
    # Simulating a flaky network call
    attempts_tracker = 0

    @retry(max_retries=4, initial_delay=0.5, backoff_factor=2.0)
    def fetch_user_data(user_id: int):
        global attempts_tracker
        attempts_tracker += 1
        if attempts_tracker < 3:
            raise ConnectionError("Timeout contacting auth server")
        return {"id": user_id, "username": "dev_practitioner"}

    print("--- Starting flaky request test ---")
    try:
        user = fetch_user_data(101)
        print(f"Success! Retrieved user: {user}")
    except Exception as final_err:
        print(f"Process failed permanently: {final_err}")