export const conflictResolver = {
  /**
   * Resolves a conflict between a local mutation and remote state.
   * Currently implements a simple "Last Write Wins" (LWW) strategy based on timestamps
   * for optimistic updates, but server enforces RLS.
   */
  resolveConflict(localPayload: any, remoteData: any): any {
    if (!remoteData) return localPayload;

    const localTimestamp = localPayload.updated_at ? new Date(localPayload.updated_at).getTime() : 0;
    const remoteTimestamp = remoteData.updated_at ? new Date(remoteData.updated_at).getTime() : 0;

    // Last Write Wins
    return localTimestamp >= remoteTimestamp ? localPayload : remoteData;
  }
};
