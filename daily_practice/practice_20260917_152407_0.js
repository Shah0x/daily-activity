/**
 * Finds the minimal length of a contiguous subarray of which the sum is >= target.
 * If there isn't one, return 0 instead.
 * 
 * Time Complexity: O(n) - sliding window technique where each element is visited at most twice.
 * Space Complexity: O(1) - in-place pointers.
 */
function minSubArrayLen(target, nums) {
    if (!nums || nums.length === 0) {
        return 0;
    }

    let left = 0;
    let currentSum = 0;
    let minLength = Infinity;

    for (let right = 0; right < nums.length; right++) {
        currentSum += nums[right];

        // Commented out my debug statement so I don't pollute the test output
        // console.log(`Added index ${right} (${nums[right]}). Sum is now: ${currentSum}`);

        // Shrink the window as much as possible while the condition is met
        while (currentSum >= target) {
            let currentWindowSize = right - left + 1;
            minLength = Math.min(minLength, currentWindowSize);
            
            // Try to shrink from the left to find a smaller valid window
            currentSum -= nums[left];
            left++;
        }
    }

    // TODO: Would it be faster to check if the array total sum is < target at the very beginning?
    // e.g., nums.reduce((a, b) => a + b, 0) < target -> return 0.
    // But that takes O(n) upfront, maybe not worth it if target is usually small.

    return minLength === Infinity ? 0 : minLength;
}

// Basic smoke tests
// console.log(minSubArrayLen(7, [2,3,1,2,4,3])); // Expected: 2 (because of [4,3])
// console.log(minSubArrayLen(4, [1,4,4]));       // Expected: 1 (because of [4])
// console.log(minSubArrayLen(11, [1,1,1,1,1,1])); // Expected: 0