// Type verification test - this file is only for type checking
import { createMutationHook } from "../createMutationHook"

// Example types matching the plan
interface CreateTodoRequest {
    title: string
    completed: boolean
}

interface CreateTodoResponse {
    id: number
    title: string
    completed: boolean
}

// Mock API
const todoApi = {
    create: async (request: CreateTodoRequest): Promise<CreateTodoResponse> => {
        return { id: 1, ...request }
    },
}

// Mock state updater
const addTodo = (_todo: CreateTodoResponse) => {
    // existing state update logic
}

// Example usage matching the plan:
// const useCreateTodo = createMutationHook<CreateTodoRequest, CreateTodoResponse>()
//     .request(/* construct request */)
//     .api(todoApi.create)
//     .update(/* existing state updater */)
//     .build();

const useCreateTodo = createMutationHook<CreateTodoRequest, CreateTodoResponse>()
    .request((input) => input) // identity transform for this example
    .api(todoApi.create)
    .update(addTodo)
    .build()

// Verify hook return type
function TestComponent() {
    const { run, loading, error, reset } = useCreateTodo()

    // Type checks
    const _loading: boolean = loading
    const _error: string | null = error
    const _reset: () => void = reset

    // run accepts CreateTodoRequest and returns Promise<boolean>
    const handleClick = async () => {
        const success: boolean = await run({ title: "Test", completed: false })
        console.log(success, _loading, _error)
        _reset()
    }

    return handleClick
}

// Prevent unused variable warnings
void TestComponent
