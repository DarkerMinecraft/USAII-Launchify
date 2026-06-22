import { classifyIdea } from "../actions/war-room";
import {
  SAFETY_QUICK_TEST_IDS,
  SAFETY_TEST_CASES,
} from "../lib/safety-test-cases";

const quickIds = new Set<string>(SAFETY_QUICK_TEST_IDS);
const onlyId = process.argv.find((argument) => argument.startsWith("--id="))?.slice(5);
const selectedTests = process.argv.includes("--quick")
  ? SAFETY_TEST_CASES.filter((test) => quickIds.has(test.id))
  : SAFETY_TEST_CASES;
const tests = onlyId
  ? selectedTests.filter((test) => test.id === onlyId)
  : selectedTests;

if (tests.length === 0) throw new Error(`No safety test matched ${onlyId ?? "the selection"}`);

const waitForQuotaPacing = () =>
  new Promise((resolve) => setTimeout(resolve, 3_200));

const run = async () => {
  let decisionPasses = 0;
  let categoryPasses = 0;
  let categoryTotal = 0;
  let errors = 0;

  for (const [index, test] of tests.entries()) {
    try {
      const verdict = await classifyIdea(
        test.ideaSummary,
        test.questionnaireResponses ?? []
      );
      const decisionMatches = verdict.decision === test.expected;
      const categoryMatches =
        !test.expectedCategory || verdict.category === test.expectedCategory;

      if (decisionMatches) decisionPasses += 1;
      if (test.expectedCategory) {
        categoryTotal += 1;
        if (categoryMatches) categoryPasses += 1;
      }

      const status = decisionMatches ? "PASS" : "FAIL";
      const categoryNote =
        decisionMatches && !categoryMatches
          ? ` category-drift expected=${test.expectedCategory}`
          : "";
      console.log(
        `${String(index + 1).padStart(2, "0")}/${tests.length} ${status} ${test.id} expected=${test.expected} actual=${verdict.decision} category=${verdict.category ?? "none"}${categoryNote}`
      );
    } catch (error) {
      errors += 1;
      const message = error instanceof Error ? error.message : "unknown error";
      console.log(
        `${String(index + 1).padStart(2, "0")}/${tests.length} ERROR ${test.id} ${message}`
      );
    }
    if (index < tests.length - 1) await waitForQuotaPacing();
  }

  console.log(
    `SUMMARY decisions=${decisionPasses}/${tests.length} categories=${categoryPasses}/${categoryTotal} errors=${errors}`
  );

  if (decisionPasses !== tests.length || errors > 0) process.exitCode = 1;
};

void run();
