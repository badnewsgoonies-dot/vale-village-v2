import { validateGameData, formatValidationResult } from '../../src/data/validateData';

test('validateData-run', async () => {
  const result = await validateGameData();
  // Print formatted validation summary to the test output for inspection
  // eslint-disable-next-line no-console
  console.log(formatValidationResult(result));
  // Ensure function completed (assertion avoids test being skipped)
  expect(result).toBeTruthy();
});
