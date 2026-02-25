
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { TransactionManager } from '../../lib/transactionManager';
import { backupService } from '../../modules/system/backup/backupService';
import { useNeuronStore } from '../../store/useNeuronStore';

describe('System Module Tests', () => {
    
    // --- Transaction Manager Tests ---
    describe('Transaction Manager', () => {
        interface MockState { count: number }
        let state: MockState;
        let tm: TransactionManager<MockState>;

        beforeEach(() => {
            state = { count: 0 };
            tm = new TransactionManager(
                () => state,
                (newState) => { state = newState; }
            );
        });

        it('should execute transaction and update state', async () => {
            await tm.execute('Increment', (s) => ({ count: s.count + 1 }));
            expect(state.count).toBe(1);
        });

        it('should rollback on error', async () => {
            await tm.execute('Initial', (s) => ({ count: 10 }));
            
            try {
                await tm.execute('Faulty Update', () => {
                    throw new Error("Boom");
                });
            } catch (e) {
                // Ignore error
            }

            expect(state.count).toBe(10); // Should remain 10, not partial update
        });

        it('should support undo', async () => {
            await tm.execute('Step 1', (s) => ({ count: 1 }));
            await tm.execute('Step 2', (s) => ({ count: 2 }));
            
            expect(state.count).toBe(2);
            
            tm.undo();
            expect(state.count).toBe(1);
            
            tm.undo();
            expect(state.count).toBe(0);
        });
    });

    // --- Backup Service Tests ---
    describe('Backup Service', () => {
        beforeEach(() => {
            useNeuronStore.setState({ 
                ideas: [{ id: '1', content: 'Backup Test Idea', status: 'EXPLORING' } as any],
                domains: []
            });
        });

        it('should create valid backup object', async () => {
            const backup = await backupService.createBackup();
            
            expect(backup).toBeDefined();
            expect(backup.metadata.version).toBe('1.0.0');
            expect(backup.payload.neuron.ideas).toHaveLength(1);
            expect(backup.payload.neuron.ideas[0].content).toBe('Backup Test Idea');
        });

        it('should restore state from backup', async () => {
            // Create backup
            const backup = await backupService.createBackup();
            
            // Clear state
            useNeuronStore.setState({ ideas: [] });
            expect(useNeuronStore.getState().ideas).toHaveLength(0);

            // Restore
            const blob = new Blob([JSON.stringify(backup)], { type: 'application/json' });
            const file = new File([blob], 'backup.json', { type: 'application/json' });
            
            await backupService.restoreBackup(file);
            
            expect(useNeuronStore.getState().ideas).toHaveLength(1);
            expect(useNeuronStore.getState().ideas[0].content).toBe('Backup Test Idea');
        });
    });
});
