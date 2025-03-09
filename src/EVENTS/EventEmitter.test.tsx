import { describe, it, expect, vi, afterEach } from 'vitest';
import EventEmitter from './EventEmitter'; // Adjust path as needed

describe('EventEmitter', () => {
  let ee;

  // Setup before each test
  beforeEach(() => {
    ee = new EventEmitter();
    vi.useFakeTimers(); // Mock timers for delay tests
  });

  // Cleanup after each test
  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers(); // Restore real timers
  });

  it('initializes with empty events object', () => {
    expect(ee.events).toEqual({});
  });

  it('subscribes to an event with on', () => {
    const listener = vi.fn();
    ee.on('testEvent', listener);
    expect(ee.events['testEvent']).toBeDefined();
    expect(ee.events['testEvent']).toHaveLength(1);
    expect(ee.events['testEvent'][0]).toBe(listener);
  });

  it('subscribes multiple listeners to the same event', () => {
    const listener1 = vi.fn();
    const listener2 = vi.fn();
    ee.on('multiEvent', listener1);
    ee.on('multiEvent', listener2);
    expect(ee.events['multiEvent']).toHaveLength(2);
    expect(ee.events['multiEvent']).toContain(listener1);
    expect(ee.events['multiEvent']).toContain(listener2);
  });

  it('emits an event and calls subscribed listeners with data', () => {
    const listener = vi.fn();
    ee.on('emitTest', listener);
    const data = { key: 'value' };
    ee.emit('emitTest', data);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(data);
  });

  it('emits an event with no listeners without error', () => {
    expect(() => ee.emit('noListeners', 'data')).not.toThrow();
  });

  it('unsubscribes from an event with off', () => {
    const listener = vi.fn();
    ee.on('offTest', listener);
    ee.off('offTest');
    expect(ee.events['offTest']).toBeUndefined();
    ee.emit('offTest', 'data');
    expect(listener).not.toHaveBeenCalled();
  });

  it('delay250 calls callback after 250ms', () => {
    const callback = vi.fn();
    ee.delay250(callback);
    expect(callback).not.toHaveBeenCalled();
    vi.advanceTimersByTime(250);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('delay500 calls callback after 500ms', () => {
    const callback = vi.fn();
    ee.delay500(callback);
    vi.advanceTimersByTime(499);
    expect(callback).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('delay1000 calls callback after 1000ms', () => {
    const callback = vi.fn();
    ee.delay1000(callback);
    vi.advanceTimersByTime(999);
    expect(callback).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('delay1500 calls callback after 1500ms', () => {
    const callback = vi.fn();
    ee.delay1500(callback);
    vi.advanceTimersByTime(1499);
    expect(callback).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('delay2000 calls callback after 2000ms', () => {
    const callback = vi.fn();
    ee.delay2000(callback);
    vi.advanceTimersByTime(1999);
    expect(callback).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});