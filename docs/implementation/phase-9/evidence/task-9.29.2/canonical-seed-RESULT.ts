import { createDayFrameStore } from '../../../../../code/src/state/dayFrameStore.js';
Object.assign(globalThis, {
  async seedPublication9292(label = 'Publication source') {
    const store = createDayFrameStore(); await store.whenReady();
    store.setSchedulingPreferences({ dayBoundaryStartTime: '00:00', weekStartsOn: 'monday' });
    const recordedAt = '2026-09-01T00:00:00.000Z';
    const sleep = store.authorSleepRequirement({ id: 'sleep', expectedRevision: null, recordedAt, intent: { enabled: true, effectiveFrom: '2026-09-01', weekdays: 'all', durationMinutes: 120, bufferBeforeMinutes: 30, bufferAfterMinutes: 30, window: { kind: 'clock', startClock: '00:00', endClock: '08:00' } } });
    if (sleep.status !== 'authored') throw Error(JSON.stringify(sleep));
    store.setShiftDefinitions([{ id: 'day', userId: 'u', name: label, startTime: '12:00', endTime: '13:00', workDays: ['thursday'], crossesMidnight: false, createdAt: recordedAt, updatedAt: recordedAt }]);
    store.setShiftCycles([{ id: 'cycle', userId: 'u', name: 'Cycle', type: 'fixedSegments', startsOnDate: '2026-09-01', endsOnDate: '2027-01-01', segments: [{ id: 'segment', shiftCycleId: 'cycle', shiftDefinitionId: 'day', startsOnDate: '2026-09-01', endsOnDate: '2027-01-01' }], createdAt: recordedAt, updatedAt: recordedAt }]);
    store.setBlockTemplates([{ id: 'routine', userId: 'u', title: 'Routine', category: 'maintenance', placementType: 'fixed', fixedStartTime: '18:00', durationMinutes: 30, priority: 2, preferredWindow: 'anyAvailable', rescheduleBehavior: 'askUser', requiresResource: false, externalResources: [], enabled: true, createdAt: recordedAt, updatedAt: recordedAt }]);
    store.setBlockRecurrences([{ id: 'daily', blockTemplateId: 'routine', frequency: 'daily' }]);
    store.setPreviewRange({ source: 'custom', preset: 'custom', startDate: '2026-09-17', endDate: '2026-09-17' });
    const goal = await store.createGoal({ title: label + ' Goal' });
    if (goal.status !== 'accepted') throw Error(JSON.stringify(goal));
    const shift = store.getState().shiftDefinitions[0]!;
    const linked = await store.linkCommitment(goal.goal.id, goal.goal.revision, { sourceKind: 'shiftDefinition', id: shift.id, incarnationId: shift.incarnationId! });
    if (linked.status !== 'accepted') throw Error(JSON.stringify(linked));
    return { goalId: goal.goal.id, shiftId: shift.id, incarnationId: shift.incarnationId };
  }
});
