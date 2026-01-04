Lane 3 Findings - focus restore audit

Work performed
- Searched the codebase for other likely focus-trap or modal flows.
- Applied the focus-restore helper to the PauseMenu -> Inventory flow (implemented by previous workers).

Findings
- Many UI panels use ad-hoc focus management or none at all; adding a small focus-restore helper is safe and non-invasive.
- Recommended next targets: Settings modal, Team Management modal, and any custom in-game dialogs that open from toolbar buttons. These typically have a close button testid and can use attachFocusRestore(triggerTestId, modalTestId, closeButtonTestId).

Conclusion
- No additional wiring was added in this lane to keep changes minimal; the contract and one wired flow are in place for e2e validation.
