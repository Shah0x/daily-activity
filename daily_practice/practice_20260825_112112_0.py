import time
import random
from typing import List, Dict, Any

# TODO: Switch to standard logging module once integrated into the main service
# import logging
# logger = logging.getLogger(__name__)

class BatchProcessor:
    def __init__(self, batch_size: int = 10, max_retries: int = 3):
        self.batch_size = batch_size
        self.max_retries = max_retries
        self.backoff_factor = 1.5

    def _chunk_data(self, data: List[Any]) -> List[List[Any]]:
        """Splits a list into smaller chunks of batch_size."""
        return [data[i:i + self.batch_size] for i in range(0, len(data), self.batch_size)]

    def _simulate_api_call(self, batch: List[Any]) -> Dict[str, Any]:
        """Simulates sending data to an external API endpoint."""
        # Flaky API simulation: 30% failure rate
        if random.random() < 0.3:
            raise ConnectionError("Temporary network glitch or rate limit exceeded.")
        
        # debug log - remove before PR
        # print(f"[DEBUG] Successfully processed batch of size: {len(batch)}")
        return {"status": "success", "processed_count": len(batch)}

    def process(self, items: List[Any]) -> List[Dict[str, Any]]:
        batches = self._chunk_data(items)
        results = []

        for index, batch in enumerate(batches):
            retries = 0
            success = False
            delay = 1.0

            while not success and retries < self.max_retries:
                try:
                    # Refactor Note: Maybe pass a custom handler/callback instead of hardcoding the API simulation
                    response = self._simulate_api_call(batch)
                    results.append(response)
                    success = True
                except ConnectionError as e:
                    retries += 1
                    if retries >= self.max_retries:
                        print(f"Failed to process batch {index} after {self.max_retries} attempts. Error: {e}")
                        # TODO: Decide if we should raise exception or collect partial failures
                        results.append({"status": "failed", "batch_size_failed": len(batch), "error": str(e)})
                    else:
                        print(f"Retry {retries}/{self.max_retries} for batch {index} in {delay:.2f}s...")
                        time.sleep(delay)
                        delay *= self.backoff_factor

        return results

# Quick manual verification
if __name__ == "__main__":
    processor = BatchProcessor(batch_size=5, max_retries=3)
    dummy_data = list(range(1, 23))
    print(f"Starting processing of {len(dummy_data)} items...")
    report = processor.process(dummy_data)
    print("\nProcessing complete. Summary:")
    for r in report:
        print(r)