// Daily Practice: Minimum Size Subarray Sum (LeetCode 209)
// Target: Find the minimal length of a contiguous subarray of which the sum >= target.

function minSubArrayLen(target: number, nums: number[]): number {
    let minLength = Infinity;
    let currentSum = 0;
    let left = 0;

    for (let right = 0; right < nums.length; right++) {
        currentSum += nums[right];

        // console.log(`Added ${nums[right]} at index ${right}. Current sum is ${currentSum}`); // debug tracker

        while (currentSum >= target) {
            const currentLength = right - left + 1;
            minLength = Math.min(minLength, currentLength);
            
            // Shrink window from the left to find a smaller valid window
            currentSum -= nums[left];
            left++;
        }
    }

    // TODO: Double check if returning 0 is the correct behavior when no subarray matches
    return minLength === Infinity ? 0 : minLength;
}

// Quick inline verification
const test1 = minSubArrayLen(7, [2, 3, 1, 2, 4, 3]);
console.log("Test 1 (Expected 2):", test1); // Should be 2 ([4, 3])

const test2 = minSubArrayLen(4, [1, 4, 4]);
console.log("Test 2 (Expected 1):", test2); // Should be 1 ([4])

const test3 = minSubArrayLen(11, [1, 1, 1, 1, 1, 1, 1, 1]);
console.log("Test 3 (Expected 0):", test3); // Should be 0

// FIXME: If input contains negative numbers, this standard sliding window breaks.
// Need to remember to use prefix sums with monotonic queue if negative integers are introduced.