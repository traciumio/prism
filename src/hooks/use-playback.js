import { useState, useCallback, useEffect, useRef } from "react";
/**
 * Step navigation hook for trace playback.
 * Manages current step index, auto-play, and speed control.
 */
export function usePlayback(totalSteps) {
    const [state, setState] = useState({
        currentIndex: 0,
        isPlaying: false,
        speed: 1000,
    });
    const intervalRef = useRef(null);
    const totalRef = useRef(totalSteps);
    totalRef.current = totalSteps;
    const stateRef = useRef(state);
    stateRef.current = state;
    const goTo = useCallback((index) => {
        setState((prev) => ({
            ...prev,
            currentIndex: Math.max(0, Math.min(index, totalRef.current - 1)),
        }));
    }, []);
    const next = useCallback(() => {
        setState((prev) => {
            const nextIndex = prev.currentIndex + 1;
            if (nextIndex >= totalRef.current) {
                // Reached the end -- stop playing
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
                return { ...prev, isPlaying: false };
            }
            return { ...prev, currentIndex: nextIndex };
        });
    }, []);
    const prev = useCallback(() => {
        setState((prev) => ({
            ...prev,
            currentIndex: Math.max(0, prev.currentIndex - 1),
        }));
    }, []);
    const pause = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setState((prev) => ({ ...prev, isPlaying: false }));
    }, []);
    const play = useCallback(() => {
        pause();
        setState((prev) => ({ ...prev, isPlaying: true }));
    }, [pause]);
    const setSpeed = useCallback((ms) => {
        setState((prev) => ({ ...prev, speed: ms }));
    }, []);
    // Auto-advance interval
    useEffect(() => {
        if (state.isPlaying) {
            intervalRef.current = window.setInterval(() => {
                next();
            }, state.speed);
        }
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [state.isPlaying, state.speed, next]);
    // Reset to 0 when total steps change (new trace loaded)
    useEffect(() => {
        setState((prev) => ({
            ...prev,
            currentIndex: 0,
            isPlaying: false,
        }));
    }, [totalSteps]);
    const actions = { goTo, next, prev, play, pause, setSpeed };
    return { playback: state, ...actions };
}
