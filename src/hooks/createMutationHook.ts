import { useState, useCallback, useRef } from "react"
import { UnauthorizedError } from "../api"
import { useExitApp } from "./useExitApp"

interface MutationState {
    loading: boolean
    error: string | null
}

interface MutationResult<TInput> extends MutationState {
    run: (input: TInput) => Promise<boolean>
    reset: () => void // do not use it yet.
}

function formatError(err: unknown): string {
    // TODO verify error formatting
    if (err instanceof Error) {
        return err.message
    }
    if (typeof err === "string") {
        return err
    }
    return "알 수 없는 오류가 발생했습니다."
}

interface MutationConfig<TState, TInput, TRequest, TResponse> {
    stateHook: () => TState
    requestFn: (input: TInput) => TRequest
    apiFn: (request: TRequest) => Promise<TResponse>
    updateFn: (response: TResponse, state: TState) => void
}

class MutationBuilder<TState, TInput, TRequest, TResponse> {
    private config: Partial<
        MutationConfig<TState, TInput, TRequest, TResponse>
    > = {}

    state<TNewState>(
        hook: () => TNewState,
    ): MutationBuilder<TNewState, TInput, TRequest, TResponse> {
        const builder = new MutationBuilder<
            TNewState,
            TInput,
            TRequest,
            TResponse
        >()

        builder.config = {
            ...this.config,
            stateHook: hook,
        } as Partial<
            MutationConfig<TNewState, TInput, TRequest, TResponse>
        >

        return builder
    }

    request<TNewRequest>(
        fn: (input: TInput) => TNewRequest,
    ): MutationBuilder<TState, TInput, TNewRequest, TResponse> {
        const builder = new MutationBuilder<
            TState,
            TInput,
            TNewRequest,
            TResponse
        >()

        builder.config = {
            ...this.config,
            requestFn: fn,
        } as Partial<
            MutationConfig<TState, TInput, TNewRequest, TResponse>
        >

        return builder
    }

    api<TNewResponse>(
        fn: (request: TRequest) => Promise<TNewResponse>,
    ): MutationBuilder<TState, TInput, TRequest, TNewResponse> {
        const builder = new MutationBuilder<
            TState,
            TInput,
            TRequest,
            TNewResponse
        >()

        builder.config = {
            ...this.config,
            apiFn: fn,
        } as Partial<
            MutationConfig<TState, TInput, TRequest, TNewResponse>
        >

        return builder
    }

    update(
        fn: (response: TResponse, state: TState) => void,
    ): MutationBuilder<TState, TInput, TRequest, TResponse> {
        this.config.updateFn = fn
        return this
    }

    build(): () => MutationResult<TInput> {
        const { stateHook, requestFn, apiFn, updateFn } =
            this.config as MutationConfig<
                TState,
                TInput,
                TRequest,
                TResponse
            >

        if (!stateHook || !requestFn || !apiFn || !updateFn) {
            throw new Error(
                "MutationBuilder: state, request, api, and update must all be configured",
            )
        }

        return function useMutation(): MutationResult<TInput> {
            const context = stateHook()
            const exitApp = useExitApp()

            const [state, setState] = useState<MutationState>({
                loading: false,
                error: null,
            })

            const configRef = useRef({
                requestFn,
                apiFn,
                updateFn,
            })
            const requestIdRef = useRef(0)

            const run = useCallback(
                async (input: TInput): Promise<boolean> => {
                    const requestId = ++requestIdRef.current
                    setState({ loading: true, error: null })

                    try {
                        const request = configRef.current.requestFn(input)
                        const response =
                            await configRef.current.apiFn(request)

                        // Ignore late responses from an older store / request.
                        if (requestId !== requestIdRef.current) {
                            return false
                        }

                        configRef.current.updateFn(response, context)

                        setState({
                            loading: false,
                            error: null,
                        })

                        return true
                    } catch (err) {
                        if (requestId !== requestIdRef.current) {
                            return false
                        }

                        if (err instanceof UnauthorizedError) {
                            exitApp()
                            return false
                        }

                        setState({
                            loading: false,
                            error: formatError(err),
                        })

                        return false
                    }
                },
                [context, exitApp],
            )

            const reset = useCallback(() => {
                setState({
                    loading: false,
                    error: null,
                })
            }, [])

            return {
                ...state,
                run,
                reset,
            }
        }
    }
}

export function createMutationHook<
    TInput,
    TResponse = TInput,
>(): MutationBuilder<unknown, TInput, TInput, TResponse> {
    return new MutationBuilder<
        unknown,
        TInput,
        TInput,
        TResponse
    >()
}
