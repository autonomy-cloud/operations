export type IncidentStateOrderTransition = {
  nextIsResolved: boolean;
  nextOrder: number;
  previousIsResolved: boolean;
  previousOrder: number;
};

/**
 * Incident state order is monotonic except for an explicit reopen from a
 * resolved state into an unresolved state. Keeping this rule pure makes the
 * timeline validator and integration tests share the same production
 * invariant.
 */
export function isIncidentStateOrderTransitionAllowed(
  transition: IncidentStateOrderTransition,
): boolean {
  return (
    transition.nextOrder > transition.previousOrder ||
    (transition.previousIsResolved && !transition.nextIsResolved)
  );
}
