import { conflictResolver } from '@/features/sync/conflict/resolver';

describe('Conflict Resolver', () => {
  it('should prefer local payload if remote data is missing', () => {
    const local = { id: '1', updated_at: '2023-01-01T12:00:00Z' };
    expect(conflictResolver.resolveConflict(local, null)).toEqual(local);
  });

  it('should prefer local payload if it is newer', () => {
    const local = { id: '1', updated_at: '2023-01-02T12:00:00Z' };
    const remote = { id: '1', updated_at: '2023-01-01T12:00:00Z' };
    expect(conflictResolver.resolveConflict(local, remote)).toEqual(local);
  });

  it('should prefer remote data if it is newer', () => {
    const local = { id: '1', updated_at: '2023-01-01T12:00:00Z' };
    const remote = { id: '1', updated_at: '2023-01-02T12:00:00Z' };
    expect(conflictResolver.resolveConflict(local, remote)).toEqual(remote);
  });
});
