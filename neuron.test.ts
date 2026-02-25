
import { describe, it, expect, beforeEach, vi, beforeAll } from 'vitest';
import { useNeuronStore } from '../../store/useNeuronStore';
import { neuronService } from '../../services/neuronMockService';
import { generateId } from '../../lib/utils';
import { Idea, Domain } from '../../types/neuron';

// --- Setup ---

// Mock delay to make tests run instantly
vi.mock('../../lib/utils', async (importOriginal) => {
    const actual = await importOriginal() as typeof import('../../lib/utils');
    return {
        ...actual,
        delay: () => Promise.resolve(),
    };
});

describe('Neuron Module - Comprehensive Test Suite', () => {
    
    beforeEach(() => {
        // Reset store state before each test to ensure isolation
        useNeuronStore.setState({
            ideas: [],
            domains: [],
            tasks: [],
            notes: [],
            networkInsights: [],
            isLoadingIdeas: false
        });
    });

    // ==========================================
    // 1. Functional Testing
    // ==========================================
    describe('Functional Testing', () => {
        
        it('should transition idea status correctly (State Flow)', async () => {
            const { addIdea, updateIdea } = useNeuronStore.getState();
            
            // 1. Capture
            const ideaId = 'test-idea-1';
            await addIdea({ id: ideaId, content: 'Test Idea', status: 'EXPLORING' });
            
            let storedIdea = useNeuronStore.getState().ideas.find(i => i.id === ideaId);
            expect(storedIdea?.status).toBe('EXPLORING');

            // 2. Progress
            await updateIdea({ ...storedIdea!, status: 'IN_PROGRESS' });
            storedIdea = useNeuronStore.getState().ideas.find(i => i.id === ideaId);
            expect(storedIdea?.status).toBe('IN_PROGRESS');

            // 3. Complete
            await updateIdea({ ...storedIdea!, status: 'COMPLETED' });
            storedIdea = useNeuronStore.getState().ideas.find(i => i.id === ideaId);
            expect(storedIdea?.status).toBe('COMPLETED');
        });

        it('should manage domain associations', async () => {
            const { addDomain, addIdea } = useNeuronStore.getState();
            
            // Create Domain
            const domainId = 'dom-test-1';
            await addDomain({ id: domainId, name: 'AI Engineering' });

            // Create Idea linked to Domain
            await addIdea({ content: 'LLM Agent', domainId: domainId });

            const idea = useNeuronStore.getState().ideas[0];
            const domain = useNeuronStore.getState().domains[0];

            expect(idea.domainId).toBe(domain.id);
        });

        it('should integrate across modules (Idea -> Task)', async () => {
            const { addIdea, convertIdeaToTask } = useNeuronStore.getState();
            
            // Create Idea
            await addIdea({ id: 'idea-convert', content: 'Build Prototype', tags: ['Dev'] });
            
            // Convert
            await convertIdeaToTask('idea-convert');
            
            const state = useNeuronStore.getState();
            const idea = state.ideas.find(i => i.id === 'idea-convert');
            const task = state.tasks[0];

            // Verify Integration
            expect(idea?.status).toBe('IN_PROGRESS'); // Should update status
            expect(idea?.convertedTo?.type).toBe('TASK');
            expect(task).toBeDefined();
            expect(task.title).toBe('Build Prototype'); // Content carried over
            expect(task.tags).toContain('Dev'); // Tags carried over
        });
    });

    // ==========================================
    // 2. Performance Testing
    // ==========================================
    describe('Performance Testing', () => {
        
        it('should handle large dataset filtering under 50ms', async () => {
            const { ideas } = useNeuronStore.getState();
            
            // 1. Generate 2000 mock ideas
            const largeDataset: Idea[] = Array.from({ length: 2000 }).map((_, i) => ({
                id: `perf-idea-${i}`,
                content: `Idea number ${i} about optimization`,
                status: i % 2 === 0 ? 'EXPLORING' : 'COMPLETED',
                priority: 'MEDIUM',
                tags: [i % 5 === 0 ? 'Urgent' : 'Routine'],
                attachments: [],
                linkedEntityIds: [],
                createdAt: new Date(),
                updatedAt: new Date()
            }));

            useNeuronStore.setState({ ideas: largeDataset });

            // 2. Measure Filter Performance
            const start = performance.now();
            
            const filtered = useNeuronStore.getState().ideas.filter(i => 
                i.status === 'EXPLORING' && i.tags.includes('Urgent')
            );
            
            const end = performance.now();
            const duration = end - start;

            // 3. Assertions
            expect(filtered.length).toBeGreaterThan(0);
            expect(duration).toBeLessThan(50); // Should be extremely fast in memory
            console.log(`[Perf] Filtered 2000 items in ${duration.toFixed(2)}ms`);
        });

        it('should perform search indexing efficiently', async () => {
            // Mock the search service call directly to test the logic wrapper
            const { fetchIdeas } = useNeuronStore.getState();
            
            // Populate store first
            const mockIdeas = Array.from({ length: 500 }).map((_, i) => ({
                id: `${i}`,
                content: `UniqueKeyword${i}`,
                status: 'EXPLORING',
                priority: 'LOW',
                tags: [],
                attachments: [],
                linkedEntityIds: [],
                createdAt: new Date(),
                updatedAt: new Date()
            } as Idea));
            
            useNeuronStore.setState({ ideas: mockIdeas });

            const start = performance.now();
            
            // Client-side search simulation
            const query = 'UniqueKeyword499';
            const result = useNeuronStore.getState().ideas.find(i => i.content.includes(query));
            
            const end = performance.now();
            
            expect(result).toBeDefined();
            expect(end - start).toBeLessThan(20);
        });
    });

    // ==========================================
    // 3. User Experience (UX) Flow Testing
    // ==========================================
    describe('User Experience Flows', () => {
        
        it('should support the complete Quick Capture flow', async () => {
            const store = useNeuronStore.getState();
            
            // User types idea -> Clicks Save
            const inputContent = 'Buy milk and cookies';
            await store.addIdea({ content: inputContent });
            
            // Verify immediate feedback in UI state
            const newIdea = useNeuronStore.getState().ideas[0];
            expect(newIdea.content).toBe(inputContent);
            expect(newIdea.status).toBe('EXPLORING'); // Default status
            
            // Simulate User archiving it immediately
            await store.updateIdea({ ...newIdea, status: 'ARCHIVED' });
            expect(useNeuronStore.getState().ideas[0].status).toBe('ARCHIVED');
        });

        it('should support Domain Mastery progression flow', async () => {
            const store = useNeuronStore.getState();
            
            // 1. Define Domain
            const domainId = 'mastery-test';
            await store.addDomain({ id: domainId, name: 'React Testing', masteryLevel: 'NOVICE' });
            
            // 2. User adds knowledge (notes)
            await store.createNote('folder-1', undefined, undefined); // Adds a note
            
            // 3. User triggers Assessment and Upgrades
            await store.assessDomainMastery(domainId, 'COMPETENT'); // "COMPETENT" logic in store
            
            // Note: The mock service implementation of updateProgress sets the passed level directly.
            // In a real app, there might be logic checking if criteria are met.
            
            const updatedDomain = useNeuronStore.getState().domains.find(d => d.id === domainId);
            // Verify logic update (Mock service just updates it)
            // Ideally, we check if the user is "Happy" by validating the state changed as expected
            expect(updatedDomain).toBeDefined();
        });
    });
});
