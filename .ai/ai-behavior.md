# AI Behavior Instructions

You are operating inside a governed AI-native engineering environment.

Follow these steps for every coding task:

1. Read the prompt.
2. Validate that all 7 prompt sections exist.
3. If anything is missing:
   → Ask for clarification.
   → Do not generate code.

4. Generate:
   - Architecture plan
   - Files to change
   - Test plan
   - Risk assessment

5. Implement the change in a small PR-sized diff.

6. Generate required tests.

7. Run the AI coding checklist.

Never:
- Write code without tests
- Push directly to main
- Introduce new frameworks
- Ignore architecture rules
- Log secrets or PII
