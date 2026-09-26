import { goalRecordedCanonicalFixture } from '../../../../../code/src/ui/tests/goalRecordedCanonicalFixture.js';
import { createDayFrameStore } from '../../../../../code/src/state/dayFrameStore.js';
import { GOAL_ACTIVITY_POLICY_V1 } from '../../../../../code/src/core/historicalIntelligence/goalActivity.js';
Object.assign(globalThis, {
  async seedDayFrame928() {
    const f = await goalRecordedCanonicalFixture();
    for (const [title, value] of [['Recorded zero', '0'], ['No recorded value', undefined]] as const) {
      const goal = await f.store.createGoal({ title }); if (goal.status !== 'accepted') throw Error(JSON.stringify(goal));
      const definition = await f.store.createMeasurementDefinition(goal.goal.id, { id: 'manualQuantityTarget', version: 1 }, { targetValue: '100', unitId: 'words' }); if (definition.status !== 'accepted') throw Error(JSON.stringify(definition));
      if (value !== undefined) { const observation = await f.store.createProgressObservation({ goalId: goal.goal.id, value, observedAt: definition.definition.effectiveFrom, expectedDefinitionRevision: 1 }); if (observation.status !== 'accepted') throw Error(JSON.stringify(observation)); }
    }
    return { goalId: f.goalId, requestId: f.requestId, acceptedIds: f.acceptedIds };
  },
  async readDayFrame928(goalId: string) {
    const store = createDayFrameStore(); await store.whenReady();
    const asOf = new Date().toISOString();
    return { progress: store.queryGoalProgress({ goalId: goalId as never, evaluationAsOf: asOf }), activity: await store.getGoalActivity({ goalId: goalId as never, startUserDayDate: '2026-09-10', endUserDayDate: '2026-09-11', evaluationAsOf: asOf, policy: GOAL_ACTIVITY_POLICY_V1 }), backup: await store.exportBackupV14(asOf) };
  },
});
